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
