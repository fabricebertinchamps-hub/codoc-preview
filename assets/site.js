(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Close' : 'Menu';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Menu';
      btn.focus();
    }
  });
})();

(function () {
  var dialogs = document.querySelectorAll('dialog.case-dialog');
  if (!dialogs.length || typeof HTMLDialogElement !== 'function') return;
  var lastTrigger = null;

  function open(id, trigger) {
    var d = document.getElementById(id);
    if (!d || d.tagName !== 'DIALOG') return false;
    document.querySelectorAll('dialog.case-dialog[open]').forEach(function (o) { o.close(); });
    if (trigger) lastTrigger = trigger;
    d.showModal();
    document.body.classList.add('dlg-open');
    var body = d.querySelector('.dlg');
    if (body) body.scrollTop = 0;
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    return true;
  }

  document.querySelectorAll('[data-case]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      if (open(a.getAttribute('data-case'), a)) ev.preventDefault();
    });
  });

  dialogs.forEach(function (d) {
    d.querySelector('.dlg-close').addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (ev) { if (ev.target === d) d.close(); });
    d.querySelectorAll('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () { open(b.getAttribute('data-go')); });
    });
    d.addEventListener('close', function () {
      if (document.querySelector('dialog.case-dialog[open]')) return;
      document.body.classList.remove('dlg-open');
      try { history.replaceState(null, '', location.pathname); } catch (e) {}
      if (lastTrigger) {
        var id = d.id;
        var t = document.querySelector('[data-case="' + id + '"]') || lastTrigger;
        t.focus();
      }
    });
  });

  var hash = location.hash.slice(1);
  if (hash) open(hash);
})();

(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.case, .svc, .person, .quote, .creds > div, .timeline li, .media-list li, .contact-card, .section-head, .pills li');
  var vh = window.innerHeight;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) {
    if (el.getBoundingClientRect().top < vh) return;
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--d', Math.min(sibs % 3, 2) * 0.08 + 's');
    el.classList.add('rv');
    io.observe(el);
  });
})();
