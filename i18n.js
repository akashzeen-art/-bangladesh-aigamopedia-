(function () {
  const pathname = window.location.pathname;

  let appBasePath = '';
  const meta = document.querySelector('meta[name="app-base-path"]');
  if (meta && meta.getAttribute('content')) {
    appBasePath = meta.getAttribute('content').replace(/\/$/, '');
  } else {
    const localeMatch = pathname.match(/^(.*)\/(?:bn)(\/|$)/);
    if (localeMatch) {
      appBasePath = localeMatch[1] || '';
    } else if (pathname !== '/' && pathname !== '') {
      appBasePath = pathname.replace(/\/$/, '').replace(/\/[^/]*$/, '');
    }
  }

  const pathAfterBase = appBasePath ? pathname.slice(appBasePath.length) || '/' : pathname;
  const isEn = pathAfterBase === '/en' || pathAfterBase.startsWith('/en/') ||
               pathname === '/en' || pathname.startsWith('/en/');
  const isBn = !isEn;
  const locale = isEn ? 'en' : 'bn';
  const localePrefix = isEn ? appBasePath + '/en' : appBasePath;

  window.getLocale = function () { return locale; };
  window.isRTL = function () { return false; };
  window.getBasePath = function () { return appBasePath; };
  window.getLocalePrefix = function () { return localePrefix; };
  window.isBn = function () { return isBn; };

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
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = window.t(key);
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

  function fixInternalLinks() { }
  function fixFormLinks() { }

  function setLangButtonHref() {
    var pageFile = pathname.split('/').pop() || '';
    if (!pageFile.includes('.')) pageFile = 'index.html';
    var targetHref = isEn ? ('./' + pageFile) : ('./en/' + pageFile);
    document.querySelectorAll('.langBtn').forEach(function (btn) {
      btn.setAttribute('href', targetHref);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setDocumentDirection();
      applyI18n();
      fixInternalLinks();
      fixFormLinks();
      setLangButtonHref();
      if (typeof window.onI18nReady === 'function') window.onI18nReady();
    });
  } else {
    setDocumentDirection();
    applyI18n();
    fixInternalLinks();
    fixFormLinks();
    setLangButtonHref();
    if (typeof window.onI18nReady === 'function') window.onI18nReady();
  }
})();
