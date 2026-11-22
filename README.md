# Chopsticks Hub

Companion website for the **Chopsticks** Google Chat bot. (Made for a custom webhook.)

## Features
- **Scroll-driven home page** - a dive from the surface to the abyss. Text and cards animate with
  [ScrollCraft](https://scroll-craft.bilalstudio.io/), the water, fish, bubbles and chopsticks are Three.js.
- **Top navigation bar** on every page (mobile menu + quick light/dark switch)
- Login system (accounts are created manually by a developer) with player profile
- Leaderboard (live from the bot, searchable, expandable player stats, live top 3 on the home page)
- Fish Library (rarity filters, profiles) - **overviews are written in `data/fish.js`**
- Card Library, Shop, Commands (search, filters, copy-usage button)
- Release notes
- Settings: theme, 3D background on/off, reduce motion, reset

## Project layout
| File | Purpose |
| --- | --- |
| `style.css` | Design system (fonts: Orbitron + Montserrat) |
| `common.js` | Shared helpers + navigation bar |
| `ocean.js` | Three.js scene (scroll dive on home, calm water elsewhere) |
| `home.js` | Home page: ScrollCraft effects, events list, live top 3 |
| `data/*.js` | Game data: fish (+ overviews/images), cards, shop, commands |
| `fish.js`, `cards.js`, `shop.js`, `commands.js`, `leaderboard.js` | Page rendering |

## Editing content
- Fish names/values/overviews/images: `data/fish.js`
- Events on the home page: `EVENTS` list at the top of `home.js`
- Announcements ticker: `notifications.js`
- Release notes: `releases.html`

## Notes
- Needs an internet connection for fonts and the CDN libraries (Three.js, ScrollCraft). If a CDN is blocked, pages still work without the 3D/scroll effects.
- Open through a web server (GitHub Pages works) rather than `file://`.
