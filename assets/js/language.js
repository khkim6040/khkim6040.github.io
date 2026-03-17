(function () {
  var STORAGE_KEY = 'site-lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'ko'];

  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('data-lang', lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    // Toggle UI text elements
    var textEls = document.querySelectorAll('[data-lang-en]');
    for (var i = 0; i < textEls.length; i++) {
      var el = textEls[i];
      var text = el.getAttribute('data-lang-' + lang);
      if (text) el.textContent = text;
    }

    // Toggle lang-specific content blocks
    var contentEls = document.querySelectorAll('[data-content-lang]');
    for (var i = 0; i < contentEls.length; i++) {
      var el = contentEls[i];
      el.style.display = el.getAttribute('data-content-lang') === lang ? '' : 'none';
    }

    // Filter archive items by language
    var archiveEls = document.querySelectorAll('.archive__item-container[data-post-lang]');
    for (var i = 0; i < archiveEls.length; i++) {
      var el = archiveEls[i];
      var postLang = el.getAttribute('data-post-lang');
      var ref = el.getAttribute('data-post-ref');

      // Remove any existing label
      var existingLabel = el.querySelector('.lang-only-label');
      if (existingLabel) existingLabel.remove();

      if (postLang === lang) {
        el.style.display = '';
      } else {
        // Check if a paired translation exists
        var pair = ref ? document.querySelector(
          '.archive__item-container[data-post-ref="' + ref + '"][data-post-lang="' + lang + '"]'
        ) : null;
        if (pair) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
          var label = document.createElement('span');
          label.className = 'lang-only-label';
          label.textContent = postLang === 'ko' ? ' (Korean only)' : ' (English only)';
          var titleEl = el.querySelector('.archive__item-title');
          if (titleEl) titleEl.appendChild(label);
        }
      }
    }

    // Update toggle button
    var btns = document.querySelectorAll('.lang-toggle-btn');
    for (var i = 0; i < btns.length; i++) {
      var enSpan = btns[i].querySelector('.lang-en');
      var koSpan = btns[i].querySelector('.lang-ko');
      if (enSpan) {
        if (lang === 'en') { enSpan.classList.add('active'); } else { enSpan.classList.remove('active'); }
      }
      if (koSpan) {
        if (lang === 'ko') { koSpan.classList.add('active'); } else { koSpan.classList.remove('active'); }
      }
    }
  }

  // Initialize
  var lang = getLang();
  document.documentElement.setAttribute('data-lang', lang);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyLang(lang); });
  } else {
    applyLang(lang);
  }

  window.toggleLanguage = function () {
    var current = getLang();
    var next = current === 'en' ? 'ko' : 'en';
    setLang(next);
  };
})();
