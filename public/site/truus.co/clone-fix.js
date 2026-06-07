/* === CLONE JITTER FIX (injected for offline/local viewing) ===
   Loads synchronously AFTER the Lenis/GSAP libraries but BEFORE the site's
   deferred custom JS, so it can intercept the Lenis constructor.

   Root cause of the jitter: 99 images load lazily as you scroll, so the page
   height keeps changing under Lenis (smooth scroll) and GSAP ScrollTrigger,
   which cache their measurements -> content jumps/jitters.

   Fix: eager-load images and re-measure (ScrollTrigger.refresh + lenis.resize)
   once they settle. We deliberately do NOT touch gsap.ticker.lagSmoothing(0):
   that is the GSAP-recommended setting for Lenis sync. */
(function () {
  if (window.Lenis && !window.__lenisPatched) {
    var _Lenis = window.Lenis;
    window.Lenis = function (opts) {
      var inst = new _Lenis(opts);
      window.lenis = inst; // expose the instance (was hidden in a closure)
      return inst;
    };
    window.Lenis.prototype = _Lenis.prototype;
    window.__lenisPatched = true;
  }

  function refresh() {
    try { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); } catch (e) {}
    try { if (window.lenis && window.lenis.resize) window.lenis.resize(); } catch (e) {}
  }

  function stabilize() {
    var imgs = Array.prototype.slice.call(document.images);
    imgs.forEach(function (img) { if (img.loading === 'lazy') img.loading = 'eager'; });

    var pending = imgs.filter(function (i) { return !i.complete; }).length;
    if (!pending) refresh();
    imgs.forEach(function (i) {
      if (i.complete) return;
      var done = function () { if (--pending <= 0) refresh(); };
      i.addEventListener('load', done, { once: true });
      i.addEventListener('error', done, { once: true });
    });

    window.addEventListener('load', refresh);
    setTimeout(refresh, 1200);
    setTimeout(refresh, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stabilize);
  } else {
    stabilize();
  }

  /* === STOP ALL VIDEOS (bulletproof) ===
     Two problems were found:
       A) The site's Vimeo SDK creates streaming background players (2 videos).
       B) wget rewrote the players' originally-EMPTY iframe src="" to "index.html",
          so every player iframe (and every carousel-cloned copy) recursively
          loads the WHOLE homepage inside itself -> huge slowdown + nested videos.

     Chasing iframes after creation proved unreliable (leaked in Safari), so we
     attack the source:
       1) Stub Vimeo.Player so the SDK never builds a player. (Runs after
          player.js but before the site's deferred custom JS.)
       2) Block <video>/HTMLMediaElement playback globally.
       3) Blank any recursive "index.html" iframe and remove any Vimeo/YouTube
          iframe, including inside same-origin nested iframes, as a safety net. */

  // 1) Neutralize the Vimeo SDK at the source.
  function NoopVimeoPlayer() {
    return {
      play: function () { return Promise.resolve(); },
      pause: function () { return Promise.resolve(); },
      setVolume: function () { return Promise.resolve(); },
      setMuted: function () { return Promise.resolve(); },
      on: function () {}, off: function () {}, ready: function () { return Promise.resolve(); },
      destroy: function () { return Promise.resolve(); }, unload: function () { return Promise.resolve(); }
    };
  }
  try {
    window.Vimeo = window.Vimeo || {};
    window.Vimeo.Player = NoopVimeoPlayer;
  } catch (e) {}

  // 2) Block native media playback entirely.
  try {
    var _play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      try { this.pause(); } catch (e) {}
      return Promise.resolve();
    };
    void _play;
  } catch (e) {}

  function pageHref() { return location.href.split('#')[0].split('?')[0]; }

  function killVideos(root) {
    var scope = root && root.querySelectorAll ? root : document;
    try {
      scope.querySelectorAll('[data-vimeo-player-init],[data-vimeo-hover],[data-thumbnail-video]').forEach(function (el) {
        el.removeAttribute('data-vimeo-player-init');
        el.removeAttribute('data-vimeo-hover');
        el.removeAttribute('data-thumbnail-video');
      });
      scope.querySelectorAll('iframe').forEach(function (f) {
        var src = f.src || '';
        if (/player\.vimeo\.com|youtube\.com|youtube-nocookie\.com/.test(src)) {
          f.removeAttribute('src');
          f.remove();
          return;
        }
        // Recursive wget artifact: iframe pointing back at this page.
        if (src && src.split('#')[0].split('?')[0] === pageHref()) {
          f.src = 'about:blank';
          return;
        }
        // Same-origin nested iframe: recurse in and clean it too.
        try { if (f.contentDocument) killVideos(f.contentDocument); } catch (e) {}
      });
      scope.querySelectorAll('video').forEach(function (v) {
        try { v.pause(); } catch (e) {}
        v.autoplay = false;
        v.removeAttribute('autoplay');
        v.removeAttribute('loop');
        v.removeAttribute('src');
        while (v.firstChild) v.removeChild(v.firstChild);
        try { v.load(); } catch (e) {}
      });
    } catch (e) {}
  }

  // Watch for anything injected at runtime and kill it immediately.
  try {
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; added && j < added.length; j++) {
          if (added[j].nodeType === 1) killVideos(added[j].parentNode || added[j]);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  // Also sweep at the usual lifecycle points.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { killVideos(); });
  } else {
    killVideos();
  }
  window.addEventListener('load', function () { killVideos(); });
  setTimeout(function () { killVideos(); }, 500);
  setTimeout(function () { killVideos(); }, 2000);
})();
