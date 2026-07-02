# BigID Simple Theme

A Discourse theme based on [Sam's simple theme](https://meta.discourse.org/t/sams-personal-minimal-topic-list-design/23552?u=sam), customized with the BigID Design System.

## What it changes

- **BigID branding** — Mulish (bundled as a theme asset), the BigID deep-purple `#44189D` for links and primary actions, a near-monochrome grey ramp, 1px borders, black-alpha shadows, and 4px/8px corner radii. Includes a "BigID" color scheme (select it under Admin → Customize → Colors).
- **BigID component styling** — solid deep-purple primary buttons (bold labels, 120ms functional easing), outlined white secondary buttons, hover-fill text buttons, light-bordered inputs with purple focus, 8px-radius bordered modals/menus/user cards with black-alpha elevation, and grey pill-shaped tag chips. Data tables (topic list, user directory, admin tables, in-post tables) use uppercase micro-label column headers, fine 1px row dividers, and a subtle row hover — matching the BigID data-grid spec.
- **Brand gradient moments** — the design system reserves the signature orange → pink → violet gradient for brand moments rather than product chrome, so it appears in only two restrained places: a 3px accent strip along the top of the header, and the homepage hero banner headline. Everything else stays near-monochrome with solid brand purple for interactive color.
- **Always-open inline composer** — the reply composer renders in the page flow at the end of the content (like a classic forum reply box) instead of floating over the bottom of the viewport, and it stays open the whole time you're viewing a topic: it opens automatically, reopens if closed (e.g. after posting), and the "Reply" button that used to open it is hidden. It only appears on the topic it belongs to (hidden, draft intact, while browsing elsewhere), and the minimize/fullscreen controls are removed. Editing a post, PMs, and new-topic composing are left alone. Desktop only; the mobile composer is unchanged.
- **Inline homepage search** — the hero search box on the homepage pushes the page down to show its results instead of floating them in a panel over the content below. The header search-icon dropdown elsewhere on the site is unchanged.
- **Auto AI summary** — on topics eligible for AI summarization, the summary is fetched and shown inline at the top of the post stream automatically, instead of behind a "Summarize" button. The button is hidden while this is active (and stays available as a fallback if the summary request fails). Requires the discourse-ai plugin with topic summarization enabled; note this triggers a summary generation on first view of each eligible topic.
- **Simplified topic list** — inherited from the original theme: no views/activity/posters columns, a single latest-poster column, and original-post dates on each row.

## Site logos

`branding/` contains BigID logos generated from the design system's brand SVGs (gradient fingerprint-shield mark + neutral wordmark), sized for Discourse's Admin → Customize → Branding slots:

| File | Slot |
| --- | --- |
| `logo.png` (434×160) | Primary logo |
| `logo-dark.png` (434×160) | Primary logo — dark mode |
| `logo-square.png` (512×512) | Square icon / mobile app icon |
| `favicon.png` (128×128) | Favicon |
| `logo-small.png` (120×120) | Small logo (shown when scrolled) |

These are uploaded through the admin UI; they are not referenced by the theme itself.
