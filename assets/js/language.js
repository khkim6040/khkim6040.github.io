(function () {
  var STORAGE_KEY = 'site-lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'ko', 'ja'];

  var LANG_LABELS = {
    en: { ko: 'Korean only', ja: 'Japanese only' },
    ko: { en: 'English only', ko: '한국어만', ja: '日本語のみ' },
    ja: { en: '英語のみ', ko: '韓国語のみ', ja: '日本語のみ' }
  };

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

    // Toggle lang-specific content blocks (fallback to 'en' if no block for current lang)
    var contentEls = document.querySelectorAll('[data-content-lang]');
    for (var i = 0; i < contentEls.length; i++) {
      var el = contentEls[i];
      var contentLang = el.getAttribute('data-content-lang');
      var parent = el.parentNode;
      var hasLangBlock = parent.querySelector('[data-content-lang="' + lang + '"]');
      var showLang = hasLangBlock ? lang : 'en';
      el.style.display = contentLang === showLang ? 'block' : 'none';
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
          var labels = LANG_LABELS[lang] || LANG_LABELS.en;
          label.textContent = ' (' + (labels[postLang] || postLang) + ')';
          var titleEl = el.querySelector('.archive__item-title');
          if (titleEl) titleEl.appendChild(label);
        }
      }
    }

    // Update toggle button
    var btns = document.querySelectorAll('.lang-toggle-btn');
    for (var i = 0; i < btns.length; i++) {
      var spans = btns[i].querySelectorAll('span[class^="lang-"]');
      for (var j = 0; j < spans.length; j++) {
        var spanLang = spans[j].className.replace('lang-', '').replace(' active', '');
        if (spanLang === lang) {
          spans[j].classList.add('active');
        } else {
          spans[j].classList.remove('active');
        }
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

  window.setLanguage = function (lang) {
    setLang(lang);
  };
})();
