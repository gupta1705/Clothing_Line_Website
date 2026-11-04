/* Pradhan by Panchayat: design versions.
   Add a new entry here when a version is added; the picker page and the
   switcher on every version read from this list. Newest last. */
window.PBP_VERSIONS = [
  {
    id: 'v1',
    name: 'KSHM layout',
    date: '4 Nov 2026',
    note: 'Shop-first layout modelled on shopkshm.com: floating header, hero slider, product carousels, People of Phulera, Colours of Phulera.',
    thumb: 'versions/v1.webp'
  },
  {
    id: 'v2',
    name: 'Snitch layout',
    date: '4 Nov 2026',
    note: 'Minimal black-and-white menswear store modelled on snitch.com: two-up hero, shop by category, edit tiles, Trending grid with quick add.',
    thumb: 'versions/v2.webp'
  }
];

/* Floating version switcher, shown on every page inside a version folder. */
(function () {
  const list = window.PBP_VERSIONS;
  const m = location.pathname.match(/\/(v\d+)\//);
  if (!m || !document.body) return;
  const cur = m[1];
  const css = `
.pbp-vs{position:fixed;left:14px;bottom:14px;z-index:75;font:500 14px/1.2 system-ui,'Segoe UI',Arial,sans-serif}
.pbp-vs>button{display:flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:9px 14px;background:#111;color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.2);cursor:pointer}
.pbp-vs>button b{background:#fff;color:#111;border-radius:999px;padding:2px 8px;font-size:12px}
.pbp-vs ul{position:absolute;left:0;bottom:calc(100% + 8px);margin:0;padding:6px;list-style:none;background:#fff;color:#111;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.18);min-width:230px;display:none}
.pbp-vs.open ul{display:block}
.pbp-vs li a{display:block;padding:9px 12px;border-radius:8px;color:inherit;text-decoration:none}
.pbp-vs li a:hover,.pbp-vs li a[aria-current]{background:#f1f1ee}
.pbp-vs li small{display:block;color:#777;font-weight:400;margin-top:2px}
.pbp-vs li.all a{border-top:1px solid #eee;border-radius:0 0 8px 8px;margin-top:4px}
@media (max-width:900px){.pbp-vs{bottom:88px;left:10px}.pbp-vs>button{padding:7px 11px;font-size:12px}}
@media print{.pbp-vs{display:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const el = document.createElement('div');
  el.className = 'pbp-vs';
  const rel = '../';
  el.innerHTML = `<button type="button" aria-expanded="false" aria-haspopup="true">Version <b>${cur}</b></button>
    <ul>${list.map((v) => `<li><a href="${rel}${v.id}/"${v.id === cur ? ' aria-current="page"' : ''}>${v.id} · ${v.name}<small>${v.date}</small></a></li>`).join('')}
    <li class="all"><a href="${rel}">All versions</a></li></ul>`;
  document.body.appendChild(el);
  const btn = el.querySelector('button');
  btn.addEventListener('click', () => { const o = el.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  document.addEventListener('click', (e) => { if (!el.contains(e.target)) { el.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { el.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
})();
