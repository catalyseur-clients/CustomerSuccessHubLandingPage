(function () {
  'use strict';

  var PIXEL_ID = '1122925967237425';
  var STORAGE_KEY = 'cc_consent';

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function store(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadPixel() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function removeBanner() {
    var el = document.getElementById('cc-banner');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function accept() {
    store('granted');
    removeBanner();
    loadPixel();
  }

  function refuse() {
    store('denied');
    removeBanner();
  }

  function buildBanner() {
    if (document.getElementById('cc-banner')) return;

    if (!document.getElementById('cc-banner-style')) {
      var style = document.createElement('style');
      style.id = 'cc-banner-style';
      style.textContent = [
        '#cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#141827;color:#e8edf5;border-top:1px solid rgba(255,255,255,0.08);padding:20px 24px;box-shadow:0 -8px 30px rgba(0,0,0,0.45);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;font-size:0.9rem;line-height:1.5;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between}',
        '#cc-banner p{margin:0;max-width:760px;color:#8892a8}',
        '#cc-banner a{color:#22c9a8}',
        '#cc-banner .cc-actions{display:flex;gap:10px;flex-wrap:wrap}',
        '#cc-banner button{cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:600;border-radius:8px;padding:11px 20px;border:1px solid transparent;transition:0.2s}',
        '#cc-banner .cc-accept{background:#22c9a8;color:#0d0f1a}',
        '#cc-banner .cc-accept:hover{background:#2edbb8}',
        '#cc-banner .cc-refuse{background:transparent;color:#e8edf5;border-color:rgba(255,255,255,0.18)}',
        '#cc-banner .cc-refuse:hover{border-color:rgba(255,255,255,0.35)}'
      ].join('');
      document.head.appendChild(style);
    }

    var banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentement cookies');
    banner.innerHTML =
      '<p>Ce site utilise des cookies de mesure (Meta Pixel) pour évaluer les campagnes publicitaires. ' +
      "Vous pouvez les refuser. <a href=\"/cgv.html\">En savoir plus</a></p>" +
      '<div class="cc-actions">' +
      '<button type="button" class="cc-refuse" id="cc-refuse">Refuser</button>' +
      '<button type="button" class="cc-accept" id="cc-accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);
    document.getElementById('cc-accept').addEventListener('click', accept);
    document.getElementById('cc-refuse').addEventListener('click', refuse);
  }

  window.ccOpen = buildBanner;

  loadPixel();

  var choice = getStored();
  if (!choice) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }
})();
