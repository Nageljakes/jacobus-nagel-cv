/* ============================================================
   Jacobus Nagel — CV behaviour

   Four small jobs, no framework:
   1. figures that recompute from a date so the page never goes stale
   2. reveal-on-scroll, nav state and the mobile menu
   3. YouTube embedded only after a click, so nothing third-party
      loads on first paint
   4. making print/save-as-PDF produce a complete document
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Evergreen figures ───────────────────────────────
     "12 years in automotive" is true for about twelve months and then
     quietly becomes a lie. Anything that counts elapsed time carries the
     date it counts from instead, and the markup keeps a correct static
     value so the page still reads properly with JavaScript off. */
  function yearsSince(stamp) {
    var parts = String(stamp).split('-');
    var start = new Date(Number(parts[0]), Number(parts[1] || 1) - 1, 1);
    var now = new Date();
    var years = now.getFullYear() - start.getFullYear();
    if (now.getMonth() < start.getMonth()) years -= 1;
    return years;
  }

  document.querySelectorAll('[data-years-since]').forEach(function (el) {
    var years = yearsSince(el.getAttribute('data-years-since'));
    if (years > 0) el.textContent = String(years);
  });

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ── 2a. Reveal on scroll ───────────────────────────── */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ── 2b. Nav ────────────────────────────────────────── */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  if (nav) {
    var setStuck = function () { nav.classList.toggle('stuck', window.scrollY > 24); };
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  function closeMenu() {
    if (!links) return;
    links.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !links.classList.contains('open')) return;
      closeMenu();
      toggle.focus();
    });
  }

  /* ── 3. Click-to-play video ──────────────────────────
     The grid ships as thumbnails; the iframe is only created once
     someone actually wants to watch, which keeps YouTube's player off
     the critical path entirely. */
  document.querySelectorAll('.vid-frame a[data-video-id]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + link.dataset.videoId + '?autoplay=1&rel=0';
      iframe.title = link.getAttribute('aria-label') || 'YouTube video player';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      link.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* ── 4. Print / save as PDF ──────────────────────────
     A CV gets attached to applications as often as it gets browsed, so
     the printed sheet has to be complete: collapsed sections are opened
     first, and reopened afterwards so the screen version is unchanged. */
  var collapsed = [];

  function expandForPrint() {
    collapsed = [];
    document.querySelectorAll('details:not([open])').forEach(function (d) {
      collapsed.push(d);
      d.open = true;
    });
  }

  function restoreAfterPrint() {
    collapsed.forEach(function (d) { d.open = false; });
    collapsed = [];
  }

  window.addEventListener('beforeprint', expandForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);

  var printBtn = document.getElementById('print-cv');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      closeMenu();
      window.print();
    });
  }
})();
