import { withPluginApi } from "discourse/lib/plugin-api";

// Discourse renders the composer as a fixed panel floating over the bottom
// of the viewport. This moves #reply-control into #main-outlet so it sits
// in the page flow, directly after the content; desktop.scss handles the
// visual treatment via the body class added here.
export default {
  name: "bigid-inline-composer",

  initialize(owner) {
    const site = owner.lookup("service:site");

    if (site.mobileView) {
      // the mobile composer is full-screen; leave it alone
      return;
    }

    withPluginApi((api) => {
      const relocateComposer = () => {
        const composer = document.getElementById("reply-control");
        const mainOutlet = document.getElementById("main-outlet");

        if (composer && mainOutlet && composer.parentElement !== mainOutlet) {
          mainOutlet.appendChild(composer);
          document.body.classList.add("bigid-inline-composer");
        }
      };

      api.onAppEvent("page:changed", relocateComposer);

      api.onAppEvent("composer:opened", () => {
        relocateComposer();

        // wait out the composer's 0.2s height transition, then bring the
        // now in-flow editor into view
        setTimeout(() => {
          document
            .getElementById("reply-control")
            ?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 250);
      });
    });
  },
};
