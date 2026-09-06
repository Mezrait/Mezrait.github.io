(function () {
  'use strict';

  var el = document.getElementById('typewriter');
  if (!el) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var fullText = el.textContent;
  el.textContent = '';

  var i = 0;
  function tick() {
    i++;
    el.textContent = fullText.slice(0, i);
    if (i < fullText.length) {
      setTimeout(tick, 40);
    }
  }
  tick();
})();
