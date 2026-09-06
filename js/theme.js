(function () {
  'use strict';

  var THEMES = {
    dracula: {
      bgTitle: '#1e1f29', bgActivity: '#343746', bgSidebar: '#21222c', bgEditor: '#282a36',
      bgStatus: '#191a21', bgRaised: '#2c2e3e', text: '#e1e4e8', textBright: '#efefef',
      textDim: '#8a8a96', accent: '#bd93f9',
    },
    githubDark: {
      bgTitle: '#0d1117', bgActivity: '#161b22', bgSidebar: '#0d1117', bgEditor: '#0d1117',
      bgStatus: '#010409', bgRaised: '#161b22', text: '#c9d1d9', textBright: '#f0f6fc',
      textDim: '#8b949e', accent: '#58a6ff',
    },
    ayuDark: {
      bgTitle: '#0a0e14', bgActivity: '#0d1017', bgSidebar: '#0d1017', bgEditor: '#0b0e14',
      bgStatus: '#060809', bgRaised: '#131721', text: '#b3b1ad', textBright: '#e6e1cf',
      textDim: '#626a73', accent: '#ffb454',
    },
    ayuMirage: {
      bgTitle: '#1f2430', bgActivity: '#232834', bgSidebar: '#1a1f29', bgEditor: '#1f2430',
      bgStatus: '#171b24', bgRaised: '#232834', text: '#cbccc6', textBright: '#f3f4f1',
      textDim: '#707a8c', accent: '#ffcc66',
    },
    nord: {
      bgTitle: '#2e3440', bgActivity: '#3b4252', bgSidebar: '#2e3440', bgEditor: '#2e3440',
      bgStatus: '#242933', bgRaised: '#3b4252', text: '#d8dee9', textBright: '#eceff4',
      textDim: '#7b88a1', accent: '#88c0d0',
    },
    nightOwl: {
      bgTitle: '#011627', bgActivity: '#01111d', bgSidebar: '#011627', bgEditor: '#011627',
      bgStatus: '#010e1a', bgRaised: '#0b2942', text: '#d6deeb', textBright: '#ffffff',
      textDim: '#637777', accent: '#82aaff',
    },
  };

  var VAR_MAP = {
    bgTitle: '--bg-title', bgActivity: '--bg-activity', bgSidebar: '--bg-sidebar',
    bgEditor: '--bg-editor', bgStatus: '--bg-status', bgRaised: '--bg-raised',
    text: '--text', textBright: '--text-bright', textDim: '--text-dim', accent: '--accent',
  };

  var STORAGE_KEY = 'portfolio-theme';
  var root = document.documentElement;

  function applyTheme(name) {
    var theme = THEMES[name];
    if (!theme) return;
    Object.keys(theme).forEach(function (key) {
      root.style.setProperty(VAR_MAP[key], theme[key]);
    });
    root.style.setProperty('--bg-tab-active', theme.bgEditor);
    root.style.setProperty('--bg-tab-inactive', theme.bgSidebar);
    try { localStorage.setItem(STORAGE_KEY, name); } catch (e) { /* private browsing, ignore */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  if (saved && THEMES[saved]) applyTheme(saved);

  document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-theme-choice'));
    });
  });
})();
