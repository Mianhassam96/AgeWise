'use strict';
/* WaqtX V2 — Service Worker Registration */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
      /* Check for updates on each load */
      reg.update();
    }).catch(function(err) {
      console.warn('WaqtX SW registration failed:', err);
    });
  });
}
