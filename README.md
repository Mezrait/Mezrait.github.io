# Portfolio

A cybersecurity-engineer portfolio presented as a code editor (VS Code style):
an activity bar, a file explorer, tabs, and a status bar, where each "file"
is actually a section of the site — inspired by yonasatinafu.com's editor-style
portfolio.

## Structure

- `index.html` — the whole app: title bar, activity bar, file explorer, tab
  bar, and one `<section class="pane">` per "file" (home.jsx, about.html,
  contact.yml, projects.py, papers.json, github.md, resume.pdf).
- `css/style.css` — the editor theme (dark, VS Code-inspired), layout, and
  responsive rules.
- `js/app.js` — makes clicking a file/tab show its pane instead of following
  the link. **Progressive enhancement**: without JavaScript, every pane
  simply stacks into one normal scrolling page — the site is never blank or
  broken if a script fails to load.
- `assets/resume.pdf` — **placeholder**, replace with a real resume.

## Editing content

Each "file" is a `<section class="pane" data-pane="...">` in `index.html` —
edit its content directly:

- `home.jsx` → `#panel-home` — name, tagline, skill tags (colored border per
  skill, matching the reference), avatar initials.
- `about.html` → `#panel-about` — bulleted facts (education/interests/role),
  "Relevant Experience" and "Additional Experience" numbered lists.
- `contact.yml` → `#panel-contact` — the one page styled as literal
  line-numbered code (matching the reference exactly): plain-white keys,
  purple linked values.
- `projects.py` → `#panel-projects` — project cards with a thumbnail,
  description, and tag pills (copy an existing `<article class="project-card">`
  to add one).
- `papers.json` → `#panel-publications` — "Publications": CTF writeups,
  security research, or talks. Not every security engineer has these —
  delete the section (and its sidebar/tab entries) if it doesn't apply to you.
- `github.md` → `#panel-github` — a GitHub-profile-style card + repo grid.
- `resume.pdf` → `#panel-resume` — download button + inline PDF preview.

Only `contact.yml` is rendered as literal code — every other "file" is its
own designed layout, matching how the reference site actually presents each
one (verified against its live computed styles, not guessed from a
screenshot).

The sidebar file list and the tab bar are two separate copies of the same
navigation (matching the real editor's layout) — if you rename a section,
update both `data-target` links.

## Running locally

No build step, no dependencies. Open `index.html` directly in a browser, or
serve the folder with any static file server.

## Deployment

Static files only — deploy the whole folder to GitHub Pages, Netlify, or any
static host with no code changes.

## Before this goes live

Replace every placeholder — name, tagline, avatar initials ("YN"), bio,
skills, project names/descriptions, GitHub username/repos, certifications,
email, LinkedIn, GitHub, and `assets/resume.pdf` — with your real
information.
