import { withPluginApi } from "discourse/lib/plugin-api";

// Discourse renders the composer as a fixed panel floating over the bottom
// of the viewport and keeps it there while navigating around the site. This
// moves #reply-control into #main-outlet so it sits in the page flow, and
// hides it on any page other than the one it is replying to; desktop.scss
// handles the visual treatment via the body classes added here.
export default {
  name: "bigid-inline-composer",

  initialize(owner) {
    const site = owner.lookup("service:site");

    if (site.mobileView) {
      // the mobile composer is full-screen; leave it alone
      return;
    }

    withPluginApi((api) => {
      const router = owner.lookup("service:router");
      const composerService = owner.lookup("service:composer");
      let openedURL = null;

      const relocateComposer = () => {
        const composer = document.getElementById("reply-control");
        const mainOutlet = document.getElementById("main-outlet");

        if (composer && mainOutlet && composer.parentElement !== mainOutlet) {
          mainOutlet.appendChild(composer);
          document.body.classList.add("bigid-inline-composer");
        }
      };

      // the composer belongs to the page it was opened on: the topic being
      // replied to, or for new topics/messages the page where composing began
      const syncVisibility = () => {
        let onItsPage = true;
        const model = composerService.model;

        if (model) {
          const replyTopicId = model.topic?.id;

          if (replyTopicId) {
            const onTopicRoute = router.currentRouteName?.startsWith("topic.");
            const currentTopicId = onTopicRoute
              ? owner.lookup("controller:topic")?.model?.id
              : null;
            onItsPage = replyTopicId === currentTopicId;
          } else {
            onItsPage = !openedURL || router.currentURL === openedURL;
          }
        }

        document.body.classList.toggle("bigid-composer-offpage", !onItsPage);
      };

      api.onAppEvent("page:changed", () => {
        relocateComposer();
        syncVisibility();
      });

      api.onAppEvent("composer:opened", () => {
        relocateComposer();
        openedURL = router.currentURL;
        syncVisibility();

        // wait out the composer's 0.2s height transition, then bring the
        // now in-flow editor into view
        setTimeout(() => {
          document
            .getElementById("reply-control")
            ?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 250);
      });

      api.onAppEvent("composer:closed", () => {
        openedURL = null;
        document.body.classList.remove("bigid-composer-offpage");
      });
    });
  },
};
