/* Replaces the Squarespace runtime: mobile menu, accordions, carousels, images. */
(function () {
  var d = document, body = d.body;

  // Mobile menu
  d.querySelectorAll('.header-burger-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = body.classList.toggle('header--menu-open');
      d.querySelectorAll('.header-burger-btn').forEach(function (b) { b.classList.toggle('burger--active', open); });
      d.querySelectorAll('.header-menu').forEach(function (m) { m.setAttribute('aria-hidden', String(!open)); });
    });
  });
  d.querySelectorAll('.header-menu a').forEach(function (a) {
    a.addEventListener('click', function () { body.classList.remove('header--menu-open'); });
  });
  // Folder sub-menus in the mobile menu
  d.querySelectorAll('.header-menu-nav-folder[data-folder]').forEach(function () {});
  d.querySelectorAll('[data-folder-id]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var f = d.querySelector('[data-folder="' + a.getAttribute('data-folder-id') + '"]');
      if (!f) return; e.preventDefault();
      f.classList.add('header-menu-nav-folder--active');
      a.closest('.header-menu-nav-folder').classList.add('header-menu-nav-folder--open');
    });
  });
  d.querySelectorAll('[data-action="back"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      d.querySelectorAll('.header-menu-nav-folder--active').forEach(function (f) { f.classList.remove('header-menu-nav-folder--active'); });
      d.querySelectorAll('.header-menu-nav-folder--open').forEach(function (f) { f.classList.remove('header-menu-nav-folder--open'); });
    });
  });

  // Accordions
  d.querySelectorAll('.accordion-items-container').forEach(function (list) {
    var multi = list.getAttribute('data-should-allow-multiple-open-items') === 'true';
    var items = list.querySelectorAll('.accordion-item');
    function set(item, open) {
      var btn = item.querySelector('.accordion-item__click-target');
      var dd = item.querySelector('.accordion-item__dropdown');
      item.setAttribute('data-is-open', String(open));
      if (btn) btn.setAttribute('aria-expanded', String(open));
      if (dd) dd.classList.toggle('accordion-item__dropdown--open', open);
    }
    items.forEach(function (item, i) {
      if (i === 0 && list.getAttribute('data-is-expanded-first-item') === 'true') set(item, true);
      var btn = item.querySelector('.accordion-item__click-target');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = item.getAttribute('data-is-open') !== 'true';
        if (open && !multi) items.forEach(function (o) { if (o !== item) set(o, false); });
        set(item, open);
      });
    });
  });

  // Carousels: slides scroll sideways; arrows move one slide.
  d.querySelectorAll('.user-items-list-carousel').forEach(function (c) {
    var track = c.querySelector('.user-items-list-carousel__slides');
    if (!track) return;
    c.style.setProperty('--static-cols', c.getAttribute('data-max-columns') || '3');
    function step(dir) {
      var slide = track.querySelector('.user-items-list-carousel__slide');
      var w = slide ? slide.getBoundingClientRect().width + 20 : track.clientWidth;
      var max = track.scrollWidth - track.clientWidth;
      var next = track.scrollLeft + dir * w;
      if (next > max + 5) next = 0; else if (next < -5) next = max;
      track.scrollTo({ left: next, behavior: 'smooth' });
    }
    c.querySelectorAll('[class*="arrow-button--left"]').forEach(function (b) { b.addEventListener('click', function () { step(-1); }); });
    c.querySelectorAll('[class*="arrow-button--right"]').forEach(function (b) { b.addEventListener('click', function () { step(1); }); });
  });

  // Squarespace hides some blocks until its script runs; show them.
  body.classList.add('static-ready');
})();
