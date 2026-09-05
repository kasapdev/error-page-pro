# Error Page Builder Pro

[![CI](https://github.com/kasapdev/error-page-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/kasapdev/error-page-pro/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) ![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?logo=javascript&logoColor=black)

Design and export gorgeous, standalone error pages — 404, 403, 500, 503, maintenance, and fully custom — with a live preview and one-click HTML export.

> Stop shipping ugly default error screens. Craft a polished, on-brand 404 or 500 page in seconds, then download a single self-contained HTML file you can drop onto any host. No build step, no dependencies, no network calls.

## Overview

Error Page Builder Pro is a zero-dependency, single-page web app. The left side is a live editor; the right side is a browser-frame preview that re-renders as you type. When you're happy, export a complete standalone HTML file (CSS and JS inlined) named after the error type — ready for GitHub Pages, Netlify, Vercel, nginx, or Apache.

Everything runs locally in your browser. It works equally well opened straight from disk (`file://`) or hosted on GitHub Pages. Your work autosaves to `localStorage`, so a refresh never loses your design.

## Features

- **Six presets** — 404, 403, 500, 503, Maintenance, and Custom, each with sensible default copy.
- **Live browser-frame preview** — debounced `<iframe srcdoc>` re-render with a realistic browser chrome and editable URL hint.
- **Four illustration styles** — animated orbiting SVG glyph, big gradient number, emoji, or a glitch text effect on the error code.
- **Four background styles** — gradient, mesh, solid, and an animated canvas starfield.
- **Full color control** — accent color plus two background colors, with a dark/light page toggle.
- **Buttons & links** — primary call-to-action with label + URL, an optional secondary link, and an optional decorative search box.
- **Standalone export** — one file, all CSS and animations inlined, no external assets or fonts. Downloads named per type (e.g. `404.html`, `maintenance.html`).
- **Copy to clipboard** — grab the full HTML without leaving the page.
- **Load example & reset** — a fleshed-out demo state, plus a confirmed reset to defaults.
- **Deploy tips** — an in-app cheat sheet for GitHub Pages, Netlify, Vercel, nginx, and Apache.
- **Polished UX** — glassmorphism, gradient brand accent, dark/light themes, entrance animations, mobile Edit/Preview toggle, keyboard shortcuts, and accessible, semantic markup.

## Installation

No dependencies and no build step.

```bash
git clone https://github.com/kasapdev/error-page-pro.git
cd error-page-pro
# then simply open index.html in your browser
```

Or just double-click `index.html`. It runs directly from `file://`.

Hosted version: **https://kasapdev.github.io/error-page-pro/**

## Usage

1. Pick an **error type** from the preset selector (or a quick-preset button).
2. Edit the **code**, **title**, **message**, **buttons**, and **footer** in the left editor.
3. Choose an **illustration style** and **background style**, then tune the **accent** and **background colors**.
4. Toggle the optional **secondary link** and **decorative search box** if you want them.
5. Watch the **live preview** update on the right.
6. Click **Export** to download a standalone `*.html` file, or **Copy HTML** to grab it.
7. Drop the file onto your host — see the in-app **Deploy tips** for platform-specific steps.

## Keyboard Shortcuts

| Action | Shortcut |
| --- | --- |
| Export standalone HTML | `Ctrl/Cmd` + `E` |
| Copy HTML to clipboard | `Ctrl/Cmd` + `Shift` + `C` |
| Show keyboard shortcuts | `?` |

## Screenshots

![screenshot](docs/screenshot-1.png)
![screenshot](docs/screenshot-2.png)

_Screenshots coming soon._

## Roadmap

- [ ] Additional preset library (401, 410, 418, rate-limited)
- [ ] Auto-redirect countdown option for maintenance pages
- [ ] Import/export design as a shareable JSON snippet
- [ ] Custom logo upload (inlined as a data URI)
- [ ] One-click bundle export of multiple error pages at once

## License

MIT © Error Page Builder Pro contributors. See [LICENSE](LICENSE) for details.
