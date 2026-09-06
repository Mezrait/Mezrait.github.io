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
