import { next } from "@ember/runloop";
import { withPluginApi } from "discourse/lib/plugin-api";

// Classic-forum behavior: keep a reply composer open at all times while
// viewing a topic, and reopen it if it closes (e.g. after posting or
// cancelling), so the reply box is always present. The "Reply" button that
// normally opens it is hidden via CSS (see desktop.scss). Works alongside
// inline-composer.js, which renders the open composer inline in the page.
// Desktop only — the mobile composer is full-screen and left untouched.
export default {
  name: "bigid-always-open-composer",

  initialize(owner) {
    const site = owner.lookup("service:site");

    if (site.mobileView) {
      return;
    }

    withPluginApi((api) => {
      const composer = owner.lookup("service:composer");
      const router = owner.lookup("service:router");

      const currentTopic = () => {
        if (!router.currentRouteName?.startsWith("topic.")) {
          return null;
        }
        return owner.lookup("controller:topic")?.model;
      };

      const openReplyFor = (topic) => {
        // don't force a composer where the user can't actually post
        // (closed/archived topics, insufficient trust level, etc.)
        if (!topic?.details?.can_create_post) {
          return;
        }
        composer.open({
          action: "reply",
          draftKey: topic.draft_key,
          draftSequence: topic.draft_sequence,
          topic,
        });
      };

      const ensureReplyOpen = () => {
        const topic = currentTopic();
        if (!topic) {
          return;
        }

        const model = composer.model;

        // nothing open — open a fresh reply for this topic
        if (!model || model.composeState === "closed") {
          openReplyFor(topic);
          return;
        }

        // A reply for a *different* topic is open. Retarget it to this topic
        // only when it's empty, so an in-progress draft is never discarded.
        // If it holds a draft (or is an edit/PM/new-topic), leave it alone —
        // inline-composer.js hides it while it's off its own page.
        const isEmptyReplyForOtherTopic =
          model.action === "reply" &&
          model.topic?.id !== topic.id &&
          !model.reply?.trim();

        if (isEmptyReplyForOtherTopic) {
          composer.close();
          next(() => openReplyFor(topic));
        }
      };

      api.onPageChange(() => ensureReplyOpen());

      // Reopen once the composer closes so the reply box is always present.
      // Deferred a tick so a submit/close fully settles (model reset) first.
      api.onAppEvent("composer:closed", () => {
        next(() => ensureReplyOpen());
      });
    });
  },
};
