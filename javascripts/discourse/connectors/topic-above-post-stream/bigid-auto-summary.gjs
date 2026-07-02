import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";
import { service } from "@ember/service";
import icon from "discourse/helpers/d-icon";
import { ajax } from "discourse/lib/ajax";
import { bind } from "discourse/lib/decorators";
import DCookText from "discourse/ui-kit/d-cook-text";
import { i18n } from "discourse-i18n";

// Auto-summary: instead of a "Summarize" button that opens a modal, this
// fetches the AI topic summary as soon as a summarizable topic loads and
// renders it inline at the top of the post stream. Uses only core imports
// (ajax, messageBus, DCookText) plus the discourse-ai HTTP endpoint and
// message-bus channel — no plugin-internal JS imports. The old button is
// hidden via CSS, gated on the body class this adds (so it stays available
// if this ever fails to render).
export default class BigidAutoSummary extends Component {
  @service messageBus;
  @service currentUser;

  @tracked text = "";
  @tracked loading = false;
  requested = false;

  get topic() {
    return this.args.outletArgs.model;
  }

  get show() {
    return this.topic?.summarizable && !this.topic?.is_bot_pm;
  }

  get channel() {
    return `/discourse-ai/summaries/topic/${this.topic.id}`;
  }

  @action
  start() {
    document.body.classList.add("bigid-auto-summary-active");
    this.messageBus.subscribe(this.channel, this.onUpdate);
    this.request();
  }

  @action
  teardown() {
    document.body.classList.remove("bigid-auto-summary-active");
    this.messageBus.unsubscribe(
      "/discourse-ai/summaries/topic/*",
      this.onUpdate
    );
  }

  request() {
    if (this.requested) {
      return;
    }
    this.requested = true;
    this.loading = true;

    // Signed-in users can trigger generation (POST, streams over the
    // channel); otherwise fetch a cached summary if one exists (GET).
    const opts = {};
    if (this.currentUser && !this.topic.has_cached_summary) {
      opts.type = "POST";
      opts.data = { stream: true };
    }

    ajax(`/discourse-ai/summarization/t/${this.topic.id}`, opts)
      .then((data) => {
        if (data?.ai_topic_summary?.summarized_text) {
          this.onUpdate({ done: true, ...data });
        }
      })
      .catch(() => {
        // credit limits, permissions, etc. — fail quietly and leave the
        // fallback "Summarize" button in place
        this.loading = false;
        this.requested = false;
        document.body.classList.remove("bigid-auto-summary-active");
      });
  }

  @bind
  onUpdate(update) {
    const summary = update?.ai_topic_summary?.summarized_text;
    if (summary) {
      this.text = summary;
    }
    if (update?.done) {
      this.loading = false;
    }
  }

  <template>
    {{#if this.show}}
      <section
        class="bigid-auto-summary"
        {{didInsert this.start}}
        {{willDestroy this.teardown}}
      >
        <h3 class="bigid-auto-summary__title">
          {{icon "discourse-sparkles"}}
          {{i18n "summary.buttons.generate"}}
        </h3>

        {{#if this.text}}
          <div class="bigid-auto-summary__body cooked">
            <DCookText @rawText={{this.text}} />
          </div>
        {{else if this.loading}}
          <div class="bigid-auto-summary__loading">
            {{i18n "summary.in_progress"}}
          </div>
        {{/if}}
      </section>
    {{/if}}
  </template>
}
