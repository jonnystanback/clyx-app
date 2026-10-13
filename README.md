# clyx-app

Clickable prototype of the Clyx app: a social layer for real experiences.
Responsive across desktop and mobile. No build step.

    python3 -m http.server 8040

Then open http://localhost:8040.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Shell: glass pill header with desktop nav and a mobile hamburger menu, the refraction SVG filters, and the `#view` mount. |
| `styles.css` | All styling. Brand tokens at the top of the file; mobile overrides under `@media (max-width: 760px)`. |
| `data.js` | Mock people, communities, events, friend activity. Edit this to change content. `TODAY` pins the demo date. |
| `home.js` | Landing page (`#/`): hero, partner strip, poster marquee, reviews, stacked feature cards, phone section, footer. Copy and photos are in `HOME`, `POSTERS` and `PARTNERS` at the top. |
| `profile.js` | Your profile (`#/profile`) and its live editor sheet. Defaults, prompts, interests, cover themes and vouches are at the top. |
| `app.js` | Hash router, views, and interactions. |
| `assets/` | Wordmark and favicon (copied from `~/clyx`), and Alte Haas Grotesk in `assets/fonts/`. Geist Mono loads from Google Fonts. |

## Screens

- `#/`: marketing landing page with its own header links (App, About, Reviews, Create an Event). Every CTA leads into the app.
- `#/explore`: date strip, category chips, search, vibes. Trending, friends going, communities, and recommendations.
- `#/event/:id`: event detail with ticket/RSVP, the presenting community, and who's going (friends first).
- `#/my-events`: Upcoming, Saved, and Past.
- `#/friends`: friend activity feed, "See who clyx with you" (people met at past events), friend list.
- `#/community/:id`: community page with leader, members, and upcoming events.
- `#/profile`: a personal page you can theme and fill in: cover theme and text, photo, bio, "Open to plans" status, prompts, interests, song on repeat, socials, badges, people you've clicked with, memories, communities and vouches. "Edit profile" opens a sheet that updates the page live; privacy settings control who sees upcoming plans. "Reset demo data" is at the bottom of the editor.

RSVPs, saves, joins and friend adds persist in `localStorage`.

Photos are Unsplash placeholders; swap the URLs in `data.js` for real photography.

## Glass header

Every page has a floating glass pill header. On phones (760px and below) the pill holds
the logo and a hamburger that opens a glass menu panel.

- Chrome and Edge get real refraction. `glassMap()` in `app.js` draws a displacement map
  sized to the pill (and to the menu), and the `#liquid-glass` / `#liquid-glass-menu` SVG
  filters in `index.html` apply it through `backdrop-filter`. Raise `scale` on those filters
  to bend more.
- Safari and Firefox can't run SVG filters in `backdrop-filter`, so they get frosted glass.
- Text flips to white while the pill is over dark imagery. The selectors that count as dark
  are the `DARK` list in `app.js`.
