# Recon Session — Cybersecurity Portfolio Design

**Date:** 2026-09-06
**Status:** Approved for planning

## 1. Overview

A single-page personal portfolio for a cybersecurity engineer. The reference inspiration (yonasatinafu.com) turns a software developer's portfolio into a VS Code editor — the site *becomes* the professional's native tool. This design does the equivalent for security: the site presents itself as a live recon/scan session against the visitor's own target (you), with an interactive fake terminal on top of a real, always-present static page.

Core content, in order of priority: **About/bio + skills, Projects/writeups, Certifications, Resume + Contact.**

## 2. Goals / Non-goals

**Goals:**
- Distinctive, memorable, on-brand for a security engineer — not a generic dev-portfolio clone.
- Works for every visitor: a recruiter skimming for 5 seconds, someone who wants to play with the terminal, a screen reader user, a link-preview bot, a no-JS browser.
- Zero build step, deployable as static files (GitHub Pages, Netlify, or equivalent — no code changes needed to switch).
- Easy for the owner to update content (add a project, a cert) without touching interaction logic.

**Non-goals:**
- No backend, no CMS, no real authentication/login simulation.
- No blog engine or comment system (a future add-on, not part of this scope).
- Not a literal clone of the reference site's file-explorer/IDE chrome.

## 3. Architecture: static content first, terminal as enhancement

This is the central technical decision, driven by the accessibility/SEO/resilience review: **the real content lives in the page as plain semantic HTML at all times.** The terminal is a progressive-enhancement layer that reads and re-presents that same content — it never holds content the static page doesn't also have.

Page structure (top to bottom in the DOM):

1. **Skip link** (`Skip to content`), standard accessible pattern, jumps past the terminal widget to the static sections.
2. **Terminal widget** — only initializes if JS runs. An inline, blocking `<script>` at the top of `<body>` sets `document.documentElement.classList` to `js` (vs. default `no-js`); CSS hides the terminal widget entirely under `no-js`, so a no-JS visitor never sees an empty shell — they land directly on the static content below.
3. **Static semantic sections**, always in the DOM, always crawlable/readable:
   - `<section id="about">` — bio + skills list
   - `<section id="projects">` — one `<article data-project-id="...">` per project, with structured fields (name, description, stack, status, link)
   - `<section id="certs">` — list of certifications with date/status
   - `<section id="contact">` — email, LinkedIn, GitHub, résumé link

**Single source of truth:** the terminal's command handlers (`whoami`, `ls projects/`, `cat certs.log`, etc.) read from these static DOM sections at runtime (via `data-*` attributes and text content) rather than duplicating content in a separate JS data file. This means updating a project means editing one `<article>` in `index.html` — nothing else needs to change, and the terminal and the static view can never drift out of sync.

**Resume:** both an HTML rendering (the About/Projects/Certs sections already double as this, for ATS copy-paste and accessibility) and a downloadable `resume.pdf` linked from Contact.

## 4. Interaction model

- **Boot sequence:** on load (JS path only), a short typed animation runs a fake `recon --target you.dev` scan, revealing 4 "open ports" mapped to the four sections. Skippable — any keypress or click fast-forwards to the end state.
- **Command prompt:** visitor can type commands (`whoami`, `ls projects/`, `cd <project>`, `cat certs.log`, `contact`, `help`, `clear`). Common plain-English aliases (`about`, `projects`, `certs`) resolve to the same handlers as their Unix-flavored equivalents, so non-technical visitors aren't punished for not knowing the syntax.
- **Corner nav buttons** (About / Projects / Certs / Contact) are always visible next to the terminal's title bar and trigger the identical output as the matching command. This is the primary interface on mobile/touch (see §6) and the fallback for anyone who doesn't want to type.
- **Deep linking:** the URL hash (`#projects/beacon-hunter`) reflects the current terminal "location" so a link can be shared straight to one project. On load, an existing hash is honored (skips the boot animation, jumps straight there).
- **Adversarial input:** all user-typed input is HTML-escaped before being echoed back — verified safe against script/markup injection attempts, which this specific audience is expected to try. This guarantee must be preserved through implementation and covered by a manual test (see §8).
- Two in-theme easter eggs (`sudo`, `nmap`) reward exploration without being load-bearing.

## 5. Accessibility requirements

- Static sections (§3) are the accessible baseline — a screen reader user gets normal heading/section navigation regardless of the terminal.
- Terminal output area uses `aria-live="polite"` scoped to command *results* only (not the character-by-character typing animation, which is `aria-hidden` and purely decorative).
- `prefers-reduced-motion: reduce` disables the typing animation and cursor blink — content appears instantly instead.
- Contrast: body/secondary text colors must meet WCAG AA against the terminal background (the mockup's dim gray was borderline — needs a lighter value in implementation).
- Visible focus states required on the command input and all nav/corner buttons.
- All interactive controls are real `<button>`/`<input>` elements (already true in the mockup) — no click handlers on non-interactive elements.

## 6. Responsive / mobile behavior

- Below ~600px, the corner-nav buttons are treated as the primary interface; the typing prompt remains present but the UI does not assume typing is the main path (virtual keyboards cover most of a small terminal viewport).
- Title bar row (dots/title/nav buttons) must reflow or drop the title text first on narrow widths rather than overflowing.
- Terminal output area remains an independently scrolling region so page-level reflow (browser zoom, text resize) doesn't break layout (WCAG 1.4.10).

## 7. Content data model

Each project article carries: `id`, `name`, `one-line description`, `stack`, `status` (active/archived), optional external link (repo/writeup). Certifications carry: `name`, `date`, `status` (active/verified/in-progress). This structure lives directly in the static HTML as data attributes + text content, per §3 — no separate data file.

## 8. Testing / verification approach

Manual verification (no backend, so this is a static-site checklist, not automated test suite):
- Keyboard-only pass: tab through nav buttons and command input, confirm visible focus, confirm Enter submits.
- Screen reader spot check (VoiceOver or NVDA): confirm About/Projects/Certs/Contact are readable as normal content, confirm terminal doesn't spam announcements.
- `prefers-reduced-motion` toggle: confirm boot animation and cursor collapse to static.
- JS-disabled load: confirm static sections render fully and terminal widget doesn't leave an empty shell.
- Mobile viewport + touch: confirm nav buttons are comfortably tappable and virtual keyboard doesn't break layout.
- Adversarial input test: attempt `<script>`/markup injection in the command prompt, confirm it's escaped and inert.
- Lighthouse pass (accessibility + SEO categories) as a baseline sanity check.
- Link-preview check: paste the deployed URL into a Slack/LinkedIn-style unfurl (or use a metatag debugger) and confirm OpenGraph title/description/image render.

## 9. Deployment

Plain static files (`index.html`, `css/`, `js/`, `assets/`) — deployable to GitHub Pages with no code changes; Netlify/Vercel work identically if preferred later.

## 10. Open questions (resolve during content writing, not blocking implementation)

- **Tone lean:** the recon/`sudo`/`nmap` framing reads red-team-coded; confirm whether copy (jokes, framing) should shift toward blue-team/SOC flavor depending on the user's actual specialization, when real bio copy is written.
- All project names, cert entries, and bio text in the current mockup are placeholders and will be replaced with the user's real information during implementation.
