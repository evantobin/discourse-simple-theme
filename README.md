# BigID Simple Theme

A Discourse theme based on [Sam's simple theme](https://meta.discourse.org/t/sams-personal-minimal-topic-list-design/23552?u=sam), customized with the BigID Design System.

## What it changes

- **BigID branding** — Mulish (bundled as a theme asset), the BigID deep-purple `#44189D` for links and primary actions, a near-monochrome grey ramp, 1px borders, black-alpha shadows, and 4px/8px corner radii. Includes a "BigID" color scheme (select it under Admin → Customize → Colors).
- **BigID component styling** — outlined white secondary buttons, hover-fill text buttons, light-bordered inputs with purple focus, 8px-radius bordered modals/menus/user cards with black-alpha elevation, and pill-shaped tag chips.
- **Inline composer** — the reply composer renders in the page flow at the end of the content (like a classic forum reply box) instead of floating over the bottom of the viewport. It only appears on the page it was opened on (hidden while browsing elsewhere, draft intact), and the minimize/fullscreen controls are removed. Desktop only; the mobile composer is unchanged.
- **Inline homepage search** — the hero search box on the homepage pushes the page down to show its results instead of floating them in a panel over the content below. The header search-icon dropdown elsewhere on the site is unchanged.
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
