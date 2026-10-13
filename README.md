# clyx-app

Clickable prototype of the Clyx app: a social layer for real experiences.
Responsive across desktop and mobile. No build step.

    python3 -m http.server 8040

Then open http://localhost:8040.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Shell: top nav (desktop), bottom tab bar (mobile), `#view` mount. |
| `styles.css` | All styling. Brand tokens at the top of the file; mobile overrides under `@media (max-width: 760px)`. |
| `data.js` | Mock people, communities, events, friend activity. Edit this to change content. `TODAY` pins the demo date. |
| `home.js` | Landing page (`#/`): hero, partner strip, poster marquee, reviews, stacked feature cards, phone section, footer. Copy and photos are in `HOME`, `POSTERS` and `PARTNERS` at the top. |
| `app.js` | Hash router, views, and interactions. |
| `assets/` | Wordmark and favicon (copied from `~/clyx`), and Alte Haas Grotesk in `assets/fonts/`. Geist Mono loads from Google Fonts. |

## Screens

- `#/`: marketing landing page with its own header (App, About, Reviews, Create an Event). The app's tab bar is hidden here, and every CTA leads into the app.
- `#/explore`: date strip, category chips, search, vibes. Trending, friends going, communities, and recommendations.
- `#/event/:id`: event detail with ticket/RSVP, the presenting community, and who's going (friends first).
- `#/my-events`: Upcoming, Saved, and Past.
- `#/friends`: friend activity feed, "See who clyx with you" (people met at past events), friend list.
- `#/community/:id`: community page with leader, members, and upcoming events.
- `#/profile`: your communities and memories, plus a "Reset demo data" button.

RSVPs, saves, joins and friend adds persist in `localStorage`.

Photos are Unsplash placeholders; swap the URLs in `data.js` for real photography.
