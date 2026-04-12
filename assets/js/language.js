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
    document.documentElement.setAttribute('lang', lang);
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

    // Update CV links based on language
    var cvLinks = document.querySelectorAll('[data-cv-link]');
    for (var i = 0; i < cvLinks.length; i++) {
      var el = cvLinks[i];
      var href = el.getAttribute('data-cv-' + lang) || el.getAttribute('data-cv-en');
      if (href) el.setAttribute('href', href);
    }

    // Update dropdown: active state + trigger flag
    var FLAG_MAP = { en: 'fi-us', ko: 'fi-kr', ja: 'fi-jp' };
    var menuBtns = document.querySelectorAll('.lang-dropdown__menu [data-lang]');
    for (var i = 0; i < menuBtns.length; i++) {
      var el = menuBtns[i];
      if (el.getAttribute('data-lang') === lang) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
    var trigger = document.querySelector('.lang-dropdown__current-flag');
    if (trigger && FLAG_MAP[lang]) {
      trigger.className = 'lang-dropdown__current-flag fi fis ' + FLAG_MAP[lang];
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

  window.setLanguage = function (l) {
    setLang(l);
  };

  // Dropdown open/close
  function initDropdown() {
    var dropdown = document.querySelector('.lang-dropdown');
    var trigger = document.querySelector('.lang-dropdown__trigger');
    if (!dropdown || !trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Select language from menu
    var menuBtns = dropdown.querySelectorAll('.lang-dropdown__menu [data-lang]');
    for (var i = 0; i < menuBtns.length; i++) {
      menuBtns[i].addEventListener('click', function (e) {
        e.stopPropagation();
        setLang(this.getAttribute('data-lang'));
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Coming-soon: toggle tooltip on click, dismiss on outside click
    var comingSoonWraps = dropdown.querySelectorAll('.lang-coming-soon-wrap');
    for (var i = 0; i < comingSoonWraps.length; i++) {
      comingSoonWraps[i].addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = this.classList.contains('show-tooltip');
        // Close all other tooltips first
        for (var j = 0; j < comingSoonWraps.length; j++) {
          comingSoonWraps[j].classList.remove('show-tooltip');
        }
        if (!wasOpen) {
          this.classList.add('show-tooltip');
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      // Also dismiss any open coming-soon tooltips
      for (var i = 0; i < comingSoonWraps.length; i++) {
        comingSoonWraps[i].classList.remove('show-tooltip');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdown);
  } else {
    initDropdown();
  }
})();
