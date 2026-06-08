(function () {
  const pathname = window.location.pathname;

  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const locale = isEn ? 'en' : 'bn';

  window.getLocale = function () { return locale; };
  window.isRTL = function () { return false; };
  window.isBn = function () { return !isEn; };

  const strings = isEn ? (window.I18N_EN || {}) : (window.I18N_BN || {});
  window.t = function (key) {
    const val = strings[key];
    return val !== undefined ? val : key;
  };

  function setDocumentDirection() {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
  }

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const val = window.t(key);
      if (el.getAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      if (!el.getAttribute('data-i18n')) {
        el.innerHTML = window.t(el.getAttribute('data-i18n-html'));
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = window.t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = window.t(el.getAttribute('data-i18n-title'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.alt = window.t(el.getAttribute('data-i18n-alt'));
    });
  }

  function setLangButtonHref() {
    var pageFile = pathname.split('/').pop() || '';
    if (!pageFile.includes('.')) pageFile = 'index.html';
    // En page -> go back to Bangla (parent folder)
    // Bn page -> go to /en/ version
    var targetHref = isEn ? ('../' + pageFile) : ('./en/' + pageFile);
    document.querySelectorAll('.langBtn').forEach(function (btn) {
      btn.setAttribute('href', targetHref);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setDocumentDirection();
      applyI18n();
      setLangButtonHref();
      if (typeof window.onI18nReady === 'function') window.onI18nReady();
    });
  } else {
    setDocumentDirection();
    applyI18n();
    setLangButtonHref();
    if (typeof window.onI18nReady === 'function') window.onI18nReady();
  }
})();
