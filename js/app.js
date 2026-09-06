(function () {
  'use strict';

  var targets = document.querySelectorAll('[data-target]');
  var panes = document.querySelectorAll('.pane');

  function activate(name, updateHash) {
    var found = false;
    panes.forEach(function (pane) {
      var isMatch = pane.getAttribute('data-pane') === name;
      pane.classList.toggle('is-active', isMatch);
      if (isMatch) found = true;
    });
    if (!found) return;

    targets.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-target') === name);
    });

    if (updateHash) {
      window.history.pushState(null, '', '#panel-' + name);
    }
  }

  targets.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      activate(el.getAttribute('data-target'), true);
    });
  });

  window.addEventListener('popstate', function () {
    var match = /^#panel-(.+)$/.exec(window.location.hash);
    if (match) activate(match[1], false);
  });

  var initialMatch = /^#panel-(.+)$/.exec(window.location.hash);
  if (initialMatch) {
    activate(initialMatch[1], false);
  }
})();
