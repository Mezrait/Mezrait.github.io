# Recon Session Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Recon Session" cybersecurity portfolio: a single static page whose real content is always-present semantic HTML, enhanced (when JS runs) by an interactive fake terminal that presents the same content as a recon/scan session.

**Architecture:** Static-content-first, progressive enhancement. `index.html` contains a terminal widget (hidden entirely under a `no-js` class when JavaScript doesn't run) followed by ordinary semantic sections (`#about`, `#projects`, `#certs`, `#contact`) that are the single source of truth for all content. Two pure/DOM-reading JS modules (`commands.js`, `content.js`) are unit-tested in isolation; a third module (`terminal.js`) wires them into the interactive UI and is verified manually (no unit-test framework — see Global Constraints).

**Tech Stack:** Plain HTML5, CSS3, vanilla JavaScript (no framework, no bundler, no npm dependency shipped to production). Node.js is used only as a local test runner for the pure-function module.

**Spec:** `docs/superpowers/specs/2026-09-06-cybersecurity-portfolio-recon-session-design.md`

## Global Constraints

- Zero build step. Every file ships as-is; no bundler, no transpiler, no npm dependency in production.
- Node.js is a *dev-only* test runner for `js/commands.js` (Task 3) — never referenced by `index.html`.
- Content lives only in `index.html`'s static sections (data attributes + text content). No separate data/JSON file duplicates it (spec §3, §7).
- All user-typed or otherwise dynamic text is rendered via `textContent`/DOM APIs — never `innerHTML` — so there is no HTML-injection surface to reason about (spec §4 adversarial-input requirement).
- `prefers-reduced-motion: reduce` must disable the boot typing animation; content appears instantly instead (spec §5).
- Body/secondary text colors must meet WCAG AA contrast against the terminal's near-black background (spec §5).
- All interactive controls are real `<button>`/`<input>`/`<a>` elements with visible `:focus-visible` styles (spec §5).
- Below ~600px width, the corner-nav buttons — not typing — are the assumed primary interaction path (spec §6).

---

### Task 1: Static HTML skeleton (accessible baseline + terminal widget markup)

**Files:**
- Create: `index.html`

**Interfaces:**
- Produces: the DOM contract that `content.js` (Task 4) reads — `#about [data-field="name"|"role"|"bio"]`, `#about ul[data-field="skills"] li`, `#projects article[data-project-id][data-project-name][data-project-status] [data-field="description"|"stack"], a[data-field="link"]`, `#certs li[data-cert][data-cert-date][data-cert-status]`, `#contact a[data-contact="email"|"linkedin"|"github"|"resume"]`.
- Produces: the terminal widget DOM that `terminal.js` (Task 5) wires up — `#terminal`, `#terminalOutput`, `#terminalForm`, `#terminalInput`, `.terminal__nav [data-cmd]`.
- Consumes: `css/style.css` (Task 2), `js/commands.js` / `js/content.js` / `js/terminal.js` (Tasks 3-5) via `<script src>` at the end of `<body>`.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your Name — Cybersecurity Engineer</title>
<meta name="description" content="Portfolio of Your Name, a cybersecurity engineer — bio, projects, certifications, and contact info.">
<meta property="og:title" content="Your Name — Cybersecurity Engineer">
<meta property="og:description" content="Portfolio of Your Name, a cybersecurity engineer — bio, projects, certifications, and contact info.">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <section class="terminal" id="terminal" aria-label="Interactive recon terminal (optional -- full content is also available below)">
    <div class="terminal__titlebar">
      <div class="terminal__dots" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="terminal__title" aria-hidden="true">guest@target — recon session</div>
      <nav class="terminal__nav" aria-label="Quick sections">
        <button type="button" data-cmd="whoami">About</button>
        <button type="button" data-cmd="ls projects/">Projects</button>
        <button type="button" data-cmd="cat certs.log">Certs</button>
        <button type="button" data-cmd="contact">Contact</button>
      </nav>
    </div>
    <div class="terminal__output" id="terminalOutput" role="log" aria-live="polite"></div>
    <form class="terminal__inputline" id="terminalForm">
      <label class="terminal__prompt" for="terminalInput">guest@target:~$</label>
      <input id="terminalInput" class="terminal__input" type="text" autocomplete="off" spellcheck="false" placeholder="type a command… try 'help'" disabled>
    </form>
  </section>

  <main id="main-content">
    <section id="about">
      <h1 data-field="name">Your Name</h1>
      <p data-field="role">Cybersecurity Engineer</p>
      <p data-field="bio">Blue team by day, breaks things by night. Focused on detection engineering, incident response, and making SOC alerts less noisy.</p>
      <h2>Skills</h2>
      <ul data-field="skills">
        <li>SIEM (Splunk/Sentinel)</li>
        <li>Python</li>
        <li>Network forensics</li>
        <li>Threat hunting</li>
        <li>AWS security</li>
        <li>Linux internals</li>
      </ul>
    </section>

    <section id="projects">
      <h2>Projects</h2>

      <article id="project-beacon-hunter" data-project-id="beacon-hunter" data-project-name="beacon-hunter/" data-project-status="active">
        <h3>beacon-hunter/</h3>
        <p data-field="description">Detects C2 beaconing patterns in netflow logs.</p>
        <p data-field="stack">Python, Zeek</p>
        <a data-field="link" href="#">repo</a>
      </article>

      <article id="project-phish-triage" data-project-id="phish-triage" data-project-name="phish-triage/" data-project-status="active">
        <h3>phish-triage/</h3>
        <p data-field="description">Slack bot that auto-triages reported phishing emails against threat intel feeds.</p>
        <p data-field="stack">Node.js, VirusTotal API</p>
        <a data-field="link" href="#">repo</a>
      </article>

      <article id="project-ctf-writeups" data-project-id="ctf-writeups" data-project-name="ctf-writeups/" data-project-status="active">
        <h3>ctf-writeups/</h3>
        <p data-field="description">HackTheBox and TryHackMe writeups covering web, pwn, and forensics challenges.</p>
        <p data-field="stack">Markdown</p>
        <a data-field="link" href="#">repo</a>
      </article>

      <article id="project-iam-audit" data-project-id="iam-audit" data-project-name="iam-audit/" data-project-status="active">
        <h3>iam-audit/</h3>
        <p data-field="description">Script suite that flags over-privileged AWS IAM roles.</p>
        <p data-field="stack">Python, boto3</p>
        <a data-field="link" href="#">repo</a>
      </article>
    </section>

    <section id="certs">
      <h2>Certifications</h2>
      <ul>
        <li data-cert="CompTIA Security+" data-cert-date="2025-11" data-cert-status="ACTIVE">CompTIA Security+ — active (2025-11)</li>
        <li data-cert="CEH Practical" data-cert-date="2025-06" data-cert-status="ACTIVE">CEH Practical — active (2025-06)</li>
        <li data-cert="TryHackMe" data-cert-date="2024-09" data-cert-status="VERIFIED">TryHackMe — Top 2% global (2024-09)</li>
        <li data-cert="HackTheBox" data-cert-date="2024-02" data-cert-status="VERIFIED">HackTheBox — Pro Hacker rank (2024-02)</li>
      </ul>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <ul>
        <li><a data-contact="resume" href="assets/resume.pdf">Download resume (PDF)</a></li>
        <li><a data-contact="email" href="mailto:you@example.com">you@example.com</a></li>
        <li><a data-contact="linkedin" href="https://www.linkedin.com/in/yourname/">LinkedIn</a></li>
        <li><a data-contact="github" href="https://github.com/yourhandle">GitHub</a></li>
      </ul>
    </section>
  </main>

  <script src="js/commands.js"></script>
  <script src="js/content.js"></script>
  <script src="js/terminal.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify (manual)**

Open `index.html` directly in a browser (double-click, `file://` URL is fine). Confirm: About/Projects/Certs/Contact are all visible as plain readable content, the terminal box at the top is empty (its JS hasn't been built yet — expected at this point), and the browser console shows 404s for `js/commands.js` etc. (expected — those files don't exist until later tasks).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add static, accessible HTML skeleton with terminal widget markup"
```

---

### Task 2: Stylesheet (base theme, static content, terminal chrome, responsive, a11y)

**Files:**
- Create: `css/style.css`

**Interfaces:**
- Consumes: class names and ids from `index.html` (Task 1) — `.no-js`, `.skip-link`, `.terminal`, `.terminal__titlebar`, `.terminal__dots`, `.terminal__title`, `.terminal__nav`, `.terminal__output`, `.terminal__inputline`, `.terminal__prompt`, `.terminal__input`, `#main-content`.
- Produces: `.terminal__line`, `.terminal__line--accent|dim|warn|err|echo` modifier classes that `terminal.js` (Task 5) applies when rendering command output.

- [ ] **Step 1: Write `css/style.css`**

```css
/* ===== reset & base ===== */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: #f5f5f0;
  color: #1a1a1a;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, Consolas, monospace;
  line-height: 1.6;
}
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

a { color: #0a7d4b; }
a:hover { color: #0a7d4b; text-decoration: underline; }

:focus-visible {
  outline: 2px solid #0a7d4b;
  outline-offset: 2px;
}

/* ===== skip link ===== */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: #0a7d4b;
  color: #fff;
  padding: 0.75rem 1.25rem;
  z-index: 100;
}
.skip-link:focus {
  left: 0.5rem;
  top: 0.5rem;
}

/* ===== static content ===== */
#main-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}
#main-content section { margin-bottom: 2.5rem; }
#main-content h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
#main-content h2 { font-size: 1.2rem; border-bottom: 1px solid #d1d1c7; padding-bottom: 0.35rem; margin-bottom: 1rem; }
#main-content article { margin-bottom: 1.5rem; }
#main-content article h3 { margin-bottom: 0.25rem; }
#main-content ul { padding-left: 1.25rem; }
#about ul[data-field="skills"] { list-style: none; padding-left: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
#about ul[data-field="skills"] li {
  background: #e6e6db;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.85rem;
}
#contact ul { list-style: none; padding-left: 0; }
#contact li { margin-bottom: 0.4rem; }

/* ===== no-js: hide the terminal entirely, static content is the whole page ===== */
.no-js .terminal { display: none; }

/* ===== terminal chrome ===== */
.terminal {
  max-width: 780px;
  margin: 2rem auto 1rem;
  background: #0b0e0d;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1d2b22;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}
.terminal__titlebar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #101513;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid #1d2b22;
  flex-wrap: wrap;
}
.terminal__dots { display: flex; gap: 6px; flex-shrink: 0; }
.terminal__dots span { width: 10px; height: 10px; border-radius: 50%; background: #2a332e; display: block; }
.terminal__title {
  color: #6f8579;
  font-size: 0.72rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.terminal__nav { display: flex; gap: 0.4rem; flex-shrink: 0; }
.terminal__nav button {
  background: transparent;
  border: 1px solid #24352a;
  color: #6fbf95;
  font-family: inherit;
  font-size: 0.7rem;
  padding: 0.25rem 0.55rem;
  border-radius: 5px;
  cursor: pointer;
}
.terminal__nav button:hover { background: #132018; border-color: #39ffa055; color: #39ffa0; }

.terminal__output {
  height: 340px;
  overflow-y: auto;
  padding: 1rem 1.1rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #d6f7e4;
  background: radial-gradient(ellipse at top, rgba(57, 255, 160, 0.05), transparent 60%), #0b0e0d;
}
.terminal__line { white-space: pre-wrap; word-break: break-word; margin-bottom: 2px; }
.terminal__line--dim { color: #9db3a8; }
.terminal__line--accent { color: #39ffa0; }
.terminal__line--warn { color: #ffb84d; }
.terminal__line--err { color: #ff7b72; }
.terminal__line--echo { color: #8fe0b3; }

.terminal__inputline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-top: 1px solid #1d2b22;
  padding: 0.55rem 1.1rem;
  background: #0b0e0d;
}
.terminal__prompt { color: #6f8579; font-size: 0.8rem; flex-shrink: 0; }
.terminal__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #39ffa0;
  font-family: inherit;
  font-size: 0.85rem;
  caret-color: #39ffa0;
}
.terminal__input::placeholder { color: #35473d; }
.terminal__input:focus-visible { outline: none; }

/* ===== responsive: corner nav is the primary interface below ~600px ===== */
@media (max-width: 600px) {
  .terminal__title { display: none; }
  .terminal__nav { flex-wrap: wrap; }
}
```

- [ ] **Step 2: Verify (manual)**

Reload `index.html`. Confirm the terminal box now has visible dark chrome (titlebar, dots, nav buttons, empty output area, input line), the static sections below are readable with a clear visual hierarchy, and the skip-link becomes visible when you press Tab once from the top of the page. Resize the window to ~375px wide and confirm the terminal's title text disappears rather than overflowing.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add base + terminal stylesheet with responsive and focus-visible rules"
```

---

### Task 3: `commands.js` — pure command parser (test-first)

**Files:**
- Create: `tests/test-commands.js`
- Create: `js/commands.js`

**Interfaces:**
- Produces: `ReconCommands.parseCommand(raw: string) -> {name: string, arg: string|null}`, `ReconCommands.buildHash(projectId: string) -> string`, `ReconCommands.parseHash(hash: string) -> string|null`. Consumed by `terminal.js` (Task 5).
- `parseCommand` command names: `'help' | 'whoami' | 'ls-projects' | 'cd' | 'certs' | 'contact' | 'clear' | 'sudo' | 'nmap' | 'noop' | 'unknown'`. Only `'cd'` and `'unknown'` carry a non-null `arg`.

- [ ] **Step 1: Write the failing test — `tests/test-commands.js`**

```js
var assert = require('assert');
var ReconCommands = require('../js/commands.js');

var failures = 0;

function run(name, fn) {
  try {
    fn();
    console.log('PASS - ' + name);
  } catch (err) {
    failures++;
    console.error('FAIL - ' + name);
    console.error(err);
  }
}

run('parseCommand resolves whoami', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('whoami'), { name: 'whoami', arg: null });
});

run('parseCommand resolves the "about" alias to whoami', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('about'), { name: 'whoami', arg: null });
});

run('parseCommand resolves ls projects/ and its variants', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('ls projects/'), { name: 'ls-projects', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('ls projects'), { name: 'ls-projects', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('projects'), { name: 'ls-projects', arg: null });
});

run('parseCommand extracts the project id from cd, trimming a trailing slash', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('cd beacon-hunter'), { name: 'cd', arg: 'beacon-hunter' });
  assert.deepStrictEqual(ReconCommands.parseCommand('cd beacon-hunter/'), { name: 'cd', arg: 'beacon-hunter' });
});

run('parseCommand resolves certs aliases', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('cat certs.log'), { name: 'certs', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('certs'), { name: 'certs', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('certifications'), { name: 'certs', arg: null });
});

run('parseCommand resolves contact and any mail-prefixed input', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('contact'), { name: 'contact', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('mail --to you'), { name: 'contact', arg: null });
});

run('parseCommand recognizes clear, sudo, and nmap', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('clear'), { name: 'clear', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('sudo rm -rf /'), { name: 'sudo', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('nmap self'), { name: 'nmap', arg: null });
});

run('parseCommand flags unknown commands, preserving the raw text', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('drop table users'), { name: 'unknown', arg: 'drop table users' });
});

run('parseCommand treats <script> input as an ordinary unknown command (no special handling needed — never rendered via innerHTML)', function () {
  var result = ReconCommands.parseCommand('<script>alert(1)</script>');
  assert.strictEqual(result.name, 'unknown');
  assert.strictEqual(result.arg, '<script>alert(1)</script>');
});

run('parseCommand ignores empty/whitespace-only input', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('   '), { name: 'noop', arg: null });
});

run('buildHash and parseHash round-trip a project id', function () {
  var hash = ReconCommands.buildHash('beacon-hunter');
  assert.strictEqual(hash, '#projects/beacon-hunter');
  assert.strictEqual(ReconCommands.parseHash(hash), 'beacon-hunter');
});

run('parseHash returns null for a hash that is not a project link', function () {
  assert.strictEqual(ReconCommands.parseHash('#about'), null);
  assert.strictEqual(ReconCommands.parseHash(''), null);
});

if (failures > 0) {
  console.error(failures + ' test(s) failed');
  process.exitCode = 1;
} else {
  console.log('ALL TESTS PASSED');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-commands.js`
Expected: `Error: Cannot find module '../js/commands.js'` (the module doesn't exist yet).

- [ ] **Step 3: Write minimal implementation — `js/commands.js`**

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.ReconCommands = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var ALIASES = {
    about: 'whoami',
    projects: 'ls projects/',
    certs: 'cat certs.log',
    certifications: 'cat certs.log',
  };

  function parseCommand(raw) {
    var trimmed = String(raw).trim();
    var lower = trimmed.toLowerCase();

    if (lower === '') {
      return { name: 'noop', arg: null };
    }

    if (Object.prototype.hasOwnProperty.call(ALIASES, lower)) {
      lower = ALIASES[lower];
      trimmed = lower;
    }

    if (lower === 'help') return { name: 'help', arg: null };
    if (lower === 'whoami') return { name: 'whoami', arg: null };
    if (lower === 'ls' || lower === 'ls projects/' || lower === 'ls projects') {
      return { name: 'ls-projects', arg: null };
    }
    if (lower.indexOf('cd ') === 0) {
      return { name: 'cd', arg: trimmed.slice(3).trim().replace(/\/$/, '') };
    }
    if (lower === 'cat certs.log') return { name: 'certs', arg: null };
    if (lower === 'contact' || lower.indexOf('mail') === 0) return { name: 'contact', arg: null };
    if (lower === 'clear') return { name: 'clear', arg: null };
    if (lower.indexOf('sudo') === 0) return { name: 'sudo', arg: null };
    if (lower.indexOf('nmap') === 0) return { name: 'nmap', arg: null };

    return { name: 'unknown', arg: trimmed };
  }

  function buildHash(projectId) {
    return '#projects/' + encodeURIComponent(projectId);
  }

  function parseHash(hash) {
    var match = /^#projects\/([^/]+)$/.exec(hash || '');
    if (!match) return null;
    return decodeURIComponent(match[1]);
  }

  return {
    parseCommand: parseCommand,
    buildHash: buildHash,
    parseHash: parseHash,
  };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-commands.js`
Expected: every line prints `PASS - ...` and the final line is `ALL TESTS PASSED` with exit code 0.

- [ ] **Step 5: Commit**

```bash
git add tests/test-commands.js js/commands.js
git commit -m "feat: add command parser with alias resolution and tests"
```

---

### Task 4: `content.js` — DOM content reader (test-first, browser fixture)

**Files:**
- Create: `tests/test-content.html`
- Create: `js/content.js`

**Interfaces:**
- Consumes: the DOM contract produced by `index.html` (Task 1).
- Produces: `ReconContent.getAbout(doc) -> {name, role, bio, skills: string[]}`, `ReconContent.getProjects(doc) -> Array<{id, name, description, stack, status, link}>`, `ReconContent.getCerts(doc) -> Array<{name, date, status}>`, `ReconContent.getContact(doc) -> {email, linkedin, github, resume}`. Consumed by `terminal.js` (Task 5). Each function accepts any `Document` (real or fixture), which is what makes this testable without a headless-DOM dependency.

- [ ] **Step 1: Write the failing test — `tests/test-content.html`**

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>content.js tests</title></head>
<body>
<div id="results"></div>

<template id="fixture">
  <section id="about">
    <p data-field="name">Test Name</p>
    <p data-field="role">Cybersecurity Engineer</p>
    <p data-field="bio">Test bio paragraph.</p>
    <ul data-field="skills"><li>Python</li><li>SIEM</li></ul>
  </section>
  <section id="projects">
    <article data-project-id="alpha" data-project-name="alpha/" data-project-status="active">
      <p data-field="description">Alpha project description.</p>
      <p data-field="stack">Python, Zeek</p>
      <a data-field="link" href="https://example.com/alpha">repo</a>
    </article>
  </section>
  <section id="certs">
    <ul>
      <li data-cert="Security+" data-cert-date="2025-11" data-cert-status="ACTIVE"></li>
    </ul>
  </section>
  <section id="contact">
    <a data-contact="email" href="mailto:you@example.com">email</a>
    <a data-contact="linkedin" href="https://linkedin.com/in/you">linkedin</a>
    <a data-contact="github" href="https://github.com/you">github</a>
    <a data-contact="resume" href="assets/resume.pdf">resume</a>
  </section>
</template>

<script src="../js/content.js"></script>
<script>
(function () {
  var resultsEl = document.getElementById('results');
  var fixtureDoc = document.implementation.createHTMLDocument('fixture');
  fixtureDoc.body.innerHTML = document.getElementById('fixture').innerHTML;

  var failures = 0;

  function check(name, actual, expected) {
    var pass = JSON.stringify(actual) === JSON.stringify(expected);
    if (!pass) failures++;
    var line = document.createElement('div');
    line.textContent = (pass ? 'PASS' : 'FAIL') + ' - ' + name +
      (pass ? '' : ' | got: ' + JSON.stringify(actual) + ' expected: ' + JSON.stringify(expected));
    line.style.color = pass ? 'green' : 'red';
    resultsEl.appendChild(line);
  }

  check('getAbout reads name/role/bio/skills', ReconContent.getAbout(fixtureDoc), {
    name: 'Test Name',
    role: 'Cybersecurity Engineer',
    bio: 'Test bio paragraph.',
    skills: ['Python', 'SIEM'],
  });

  check('getProjects reads one project with all fields', ReconContent.getProjects(fixtureDoc), [{
    id: 'alpha',
    name: 'alpha/',
    description: 'Alpha project description.',
    stack: 'Python, Zeek',
    status: 'active',
    link: 'https://example.com/alpha',
  }]);

  check('getCerts reads cert entries', ReconContent.getCerts(fixtureDoc), [{
    name: 'Security+',
    date: '2025-11',
    status: 'ACTIVE',
  }]);

  check('getContact reads all contact links', ReconContent.getContact(fixtureDoc), {
    email: 'mailto:you@example.com',
    linkedin: 'https://linkedin.com/in/you',
    github: 'https://github.com/you',
    resume: 'assets/resume.pdf',
  });

  var summary = document.createElement('div');
  summary.style.fontWeight = 'bold';
  summary.textContent = failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED';
  resultsEl.insertBefore(summary, resultsEl.firstChild);
})();
</script>
</body>
</html>
```

- [ ] **Step 2: Run test to verify it fails**

Open `tests/test-content.html` directly in a browser. Expected: a console error (`ReconContent is not defined`) and no PASS/FAIL lines rendered, since `js/content.js` doesn't exist yet.

- [ ] **Step 3: Write minimal implementation — `js/content.js`**

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.ReconContent = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function textOf(el) {
    return el ? el.textContent.trim() : '';
  }

  function getAbout(doc) {
    var section = doc.querySelector('#about');
    if (!section) return null;
    var skills = Array.prototype.map.call(
      section.querySelectorAll('[data-field="skills"] li'),
      function (li) { return li.textContent.trim(); }
    );
    return {
      name: textOf(section.querySelector('[data-field="name"]')),
      role: textOf(section.querySelector('[data-field="role"]')),
      bio: textOf(section.querySelector('[data-field="bio"]')),
      skills: skills,
    };
  }

  function getProjects(doc) {
    var articles = doc.querySelectorAll('#projects article[data-project-id]');
    return Array.prototype.map.call(articles, function (article) {
      var linkEl = article.querySelector('[data-field="link"]');
      return {
        id: article.getAttribute('data-project-id'),
        name: article.getAttribute('data-project-name') || article.getAttribute('data-project-id'),
        description: textOf(article.querySelector('[data-field="description"]')),
        stack: textOf(article.querySelector('[data-field="stack"]')),
        status: article.getAttribute('data-project-status') || 'active',
        link: linkEl ? linkEl.getAttribute('href') : null,
      };
    });
  }

  function getCerts(doc) {
    var items = doc.querySelectorAll('#certs li[data-cert]');
    return Array.prototype.map.call(items, function (li) {
      return {
        name: li.getAttribute('data-cert'),
        date: li.getAttribute('data-cert-date') || '',
        status: li.getAttribute('data-cert-status') || '',
      };
    });
  }

  function getContact(doc) {
    var section = doc.querySelector('#contact');
    if (!section) return null;
    function href(selector) {
      var el = section.querySelector(selector);
      return el ? el.getAttribute('href') : null;
    }
    return {
      email: href('[data-contact="email"]'),
      linkedin: href('[data-contact="linkedin"]'),
      github: href('[data-contact="github"]'),
      resume: href('[data-contact="resume"]'),
    };
  }

  return {
    getAbout: getAbout,
    getProjects: getProjects,
    getCerts: getCerts,
    getContact: getContact,
  };
});
```

- [ ] **Step 4: Run test to verify it passes**

Reload `tests/test-content.html` in the browser. Expected: `ALL TESTS PASSED` at the top, and every check below it reads `PASS`.

- [ ] **Step 5: Commit**

```bash
git add tests/test-content.html js/content.js
git commit -m "feat: add DOM content reader with fixture-based tests"
```

---

### Task 5: `terminal.js` — interactive layer (boot sequence, command rendering, hash routing)

**Files:**
- Create: `js/terminal.js`

**Interfaces:**
- Consumes: `ReconCommands.parseCommand/buildHash/parseHash` (Task 3), `ReconContent.getAbout/getProjects/getCerts/getContact` (Task 4), and the DOM ids/classes from `index.html` (Task 1).
- No exports — this module only wires the above into the page; nothing downstream depends on it.

- [ ] **Step 1: Write `js/terminal.js`**

```js
(function () {
  'use strict';

  var terminalEl = document.getElementById('terminal');
  var outputEl = document.getElementById('terminalOutput');
  var formEl = document.getElementById('terminalForm');
  var inputEl = document.getElementById('terminalInput');
  var navButtons = terminalEl.querySelectorAll('.terminal__nav [data-cmd]');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skipRequested = false;

  var ABOUT = ReconContent.getAbout(document);
  var PROJECTS = ReconContent.getProjects(document);
  var CERTS = ReconContent.getCerts(document);
  var CONTACT = ReconContent.getContact(document);

  function addLine(text, modifier) {
    var line = document.createElement('div');
    line.className = 'terminal__line' + (modifier ? ' terminal__line--' + modifier : '');
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
    return line;
  }

  function addBlank() {
    addLine(' ');
  }

  function addDecorativeLine(text, modifier) {
    var line = addLine(text, modifier);
    line.setAttribute('aria-hidden', 'true');
    return line;
  }

  function typeDecorativeLine(text, modifier, speed) {
    if (reduceMotion || skipRequested) {
      addDecorativeLine(text, modifier);
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      var line = document.createElement('div');
      line.className = 'terminal__line' + (modifier ? ' terminal__line--' + modifier : '');
      line.setAttribute('aria-hidden', 'true');
      outputEl.appendChild(line);
      var i = 0;
      var iv = setInterval(function () {
        if (skipRequested) {
          clearInterval(iv);
          line.textContent = text;
          outputEl.scrollTop = outputEl.scrollHeight;
          resolve();
          return;
        }
        line.textContent = text.slice(0, i + 1);
        outputEl.scrollTop = outputEl.scrollHeight;
        i++;
        if (i >= text.length) {
          clearInterval(iv);
          resolve();
        }
      }, speed || 12);
    });
  }

  function wait(ms) {
    if (reduceMotion || skipRequested) return Promise.resolve();
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function requestSkip() {
    skipRequested = true;
  }

  function renderHelp() {
    addLine('available commands:', 'dim');
    addLine('  whoami            about / bio / skills');
    addLine('  ls projects/      list projects & writeups');
    addLine('  cd <project>      open a project writeup');
    addLine('  cat certs.log     list certifications');
    addLine('  contact           resume + how to reach me');
    addLine('  clear             clear the screen');
  }

  function renderWhoami() {
    if (!ABOUT) { addLine('whoami: profile unavailable', 'err'); return; }
    addLine(ABOUT.name + '  -  ' + ABOUT.role, 'accent');
    addBlank();
    addLine(ABOUT.bio);
    addBlank();
    addLine('skills: ' + ABOUT.skills.join(' * '));
  }

  function renderProjectsList() {
    addLine('total ' + PROJECTS.length, 'dim');
    PROJECTS.forEach(function (p) {
      addLine(p.name + '  ' + p.description, 'accent');
    });
    addBlank();
    if (PROJECTS[0]) {
      addLine('(try: cd ' + PROJECTS[0].id + ')', 'dim');
    }
  }

  function renderProjectDetail(id) {
    var project = PROJECTS.filter(function (p) { return p.id === id; })[0];
    if (!project) {
      addLine('cd: no such project: ' + id, 'err');
      return;
    }
    addLine(project.name, 'accent');
    addBlank();
    addLine(project.description);
    addLine('stack: ' + project.stack + '  status: ' + project.status, 'dim');
    if (project.link && project.link !== '#') {
      addLine('link: ' + project.link, 'dim');
    }
    window.history.replaceState(null, '', ReconCommands.buildHash(project.id));
  }

  function renderCerts() {
    addLine('cat: certs.log', 'dim');
    addBlank();
    CERTS.forEach(function (c) {
      addLine('[' + c.date + '] ' + c.name + ' ................ ' + c.status);
    });
  }

  function renderContact() {
    if (!CONTACT) { addLine('contact: unavailable', 'err'); return; }
    addLine('resume ..................... ' + (CONTACT.resume || 'unavailable'), 'accent');
    addLine('email ...................... ' + (CONTACT.email || ''));
    addLine('linkedin ................... ' + (CONTACT.linkedin || ''));
    addLine('github ..................... ' + (CONTACT.github || ''));
  }

  function renderSudo() {
    addLine('guest is not in the sudoers file. this incident will be reported.', 'warn');
  }

  function renderNmap() {
    addLine('scanning 127.0.0.1 (yourself)...', 'dim');
    addLine('you already know your own attack surface. nice try.', 'warn');
  }

  function renderUnknown(raw) {
    addLine("command not found: " + raw + "  (type 'help')", 'err');
  }

  function runCommand(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;
    addLine('guest@target:~$ ' + trimmed, 'echo');
    var parsed = ReconCommands.parseCommand(trimmed);
    switch (parsed.name) {
      case 'help': return renderHelp();
      case 'whoami': return renderWhoami();
      case 'ls-projects': return renderProjectsList();
      case 'cd': return renderProjectDetail(parsed.arg);
      case 'certs': return renderCerts();
      case 'contact': return renderContact();
      case 'clear': outputEl.innerHTML = ''; return;
      case 'sudo': return renderSudo();
      case 'nmap': return renderNmap();
      case 'noop': return;
      default: return renderUnknown(parsed.arg);
    }
  }

  async function bootSequence() {
    terminalEl.addEventListener('click', requestSkip, { once: true });
    terminalEl.addEventListener('keydown', requestSkip, { once: true });

    await typeDecorativeLine('$ recon --target you.dev', 'accent', 18);
    addBlank();
    await typeDecorativeLine('Starting scan...', 'dim', 10);
    addDecorativeLine('PORT      STATE   SERVICE', 'dim');
    addDecorativeLine('22/tcp    open    whoami      -> about / bio / skills');
    addDecorativeLine('443/tcp   open    projects    -> writeups, tools, labs');
    addDecorativeLine('8443/tcp  open    certs       -> certifications');
    addDecorativeLine('25/tcp    open    contact     -> resume + contact');
    addBlank();
    await typeDecorativeLine("scan complete - 4 services discovered. type 'help' or use the buttons above.", 'dim', 8);
    addBlank();

    inputEl.disabled = false;

    var initialProjectId = ReconCommands.parseHash(window.location.hash);
    if (initialProjectId) {
      runCommand('cd ' + initialProjectId);
      terminalEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = inputEl.value;
    inputEl.value = '';
    runCommand(value);
  });

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (inputEl.disabled) return;
      runCommand(btn.getAttribute('data-cmd'));
    });
  });

  bootSequence();
})();
```

- [ ] **Step 2: Verify (manual)**

Reload `index.html`. Confirm: the boot sequence types out the scan and finishes with the input enabled; clicking anywhere in the terminal mid-boot instantly completes it; the corner-nav buttons and typed commands (`whoami`, `ls projects/`, `cd beacon-hunter`, `cat certs.log`, `contact`, `help`, `clear`, `sudo`, `nmap`, an unrecognized command, and `<script>alert(1)</script>`) all produce the expected output with no script executing and no broken layout; after `cd beacon-hunter` the URL bar shows `#projects/beacon-hunter`; reloading with that hash already in the URL jumps straight to that project. Then, in your OS/browser accessibility settings, enable "reduce motion" and reload — confirm the boot sequence appears instantly with no per-character animation.

- [ ] **Step 3: Commit**

```bash
git add js/terminal.js
git commit -m "feat: wire terminal boot sequence, command rendering, and hash routing"
```

---

### Task 6: Resume asset + contact wiring

**Files:**
- Create: `assets/resume.pdf`

**Interfaces:**
- Consumes: nothing. Produces the file that `index.html`'s `[data-contact="resume"]` link (Task 1) already points at.

- [ ] **Step 1: Create a minimal valid placeholder `assets/resume.pdf`**

A real resume isn't available yet, so ship a minimal, valid, non-empty PDF as a placeholder (so the download link works end-to-end) rather than a broken link or a fake binary:

```
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 89 >>
stream
BT
/F1 18 Tf
72 720 Td
(Replace this file with your real resume.pdf) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF
```

- [ ] **Step 2: Verify (manual)**

Click "Download resume (PDF)" in the Contact section of the running page. Confirm it downloads/opens and shows the placeholder text — this confirms the link path is correct end-to-end. Replace this file with a real resume before the site goes live (tracked in the spec's open questions).

- [ ] **Step 3: Commit**

```bash
git add assets/resume.pdf
git commit -m "chore: add placeholder resume.pdf so the contact download link is wired end-to-end"
```

---

### Task 7: README + full manual verification pass

**Files:**
- Create: `README.md`

**Interfaces:** None — documentation only.

- [ ] **Step 1: Write `README.md`**

```markdown
# Portfolio — Recon Session

A cybersecurity-engineer portfolio: a fake recon/terminal session layered as
progressive enhancement over always-present static content (see
`docs/superpowers/specs/2026-09-06-cybersecurity-portfolio-recon-session-design.md`
for the full design).

## Structure

- `index.html` — the whole page: skip link, terminal widget, and the static
  `#about` / `#projects` / `#certs` / `#contact` sections that hold all real
  content.
- `css/style.css` — theme, static-content layout, terminal chrome, responsive
  and focus-visible rules.
- `js/commands.js` — pure command parser (no DOM). Unit-tested with Node.
- `js/content.js` — reads the static sections into structured data. Tested
  against a browser fixture (no DOM library needed).
- `js/terminal.js` — wires the two modules above into the interactive boot
  sequence, command prompt, and corner-nav buttons.
- `assets/resume.pdf` — **placeholder**, replace with a real resume.

## Editing content

Everything the terminal displays is read live from `index.html` at runtime —
there is no separate data file. To add a project, copy an existing
`<article data-project-id="...">` block in the `#projects` section and edit
its text; the terminal picks it up automatically. Same pattern for
certifications (`<li data-cert="...">` in `#certs`) and contact links
(`<a data-contact="...">` in `#contact`).

## Running locally

No build step. Open `index.html` directly in a browser, or serve the folder
with any static file server.

## Tests

- `node tests/test-commands.js` — command-parser unit tests (Node, no
  dependencies).
- `tests/test-content.html` — open directly in a browser; the page itself
  reports PASS/FAIL for each check.

## Deployment

Static files only — deploy the whole folder to GitHub Pages, Netlify, or any
static host with no code changes.
```

- [ ] **Step 2: Run the full verification checklist from the spec**

Run through spec §8 end to end and note results:
- `node tests/test-commands.js` → all PASS.
- Open `tests/test-content.html` → all PASS.
- Keyboard-only pass: Tab through the whole page, confirm every stop (skip link, nav buttons, command input, all static links) shows a visible focus ring.
- JS-disabled load: disable JavaScript in the browser, reload `index.html`, confirm the terminal is entirely absent and About/Projects/Certs/Contact render as a normal, readable page.
- Reduced-motion: enable "reduce motion" in OS/browser settings, reload, confirm the boot sequence renders instantly.
- Mobile viewport (~375px): confirm the corner-nav buttons are comfortably tappable and the terminal title text is hidden rather than overflowing.
- Adversarial input: type `<script>alert(1)</script>` and `'; DROP TABLE--` into the command prompt, confirm both are echoed as inert text and never executed or parsed as HTML.
- Screen reader spot check (VoiceOver/NVDA): confirm About/Projects/Certs/Contact read normally as a document, and that running a command in the terminal announces the result without the boot animation being read character-by-character.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with project structure, editing, and verification notes"
```
