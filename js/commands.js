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
