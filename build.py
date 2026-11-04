"""Builds the static pages from shared partials. Run: python build.py"""
import hashlib
import math
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent


def ver(f):
    return hashlib.md5((ROOT / f).read_bytes()).hexdigest()[:8]


def svg(body, vb='0 0 24 24', sw='1.7', cls='i'):
    return f'<svg class="{cls}" viewBox="{vb}" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</svg>'


I = {
    'search': svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    'heart': svg('<path d="M12 20s-7-4.4-9.2-9A4.9 4.9 0 0 1 12 6.2 4.9 4.9 0 0 1 21.2 11C19 15.6 12 20 12 20Z"/>'),
    'bag': svg('<path d="M4.5 8.5h15l-1.3 11.2a1.5 1.5 0 0 1-1.5 1.3H7.3a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5"/>'),
    'user': svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    'chev': svg('<path d="m6 9 6 6 6-6"/>'),
    'arrow': svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    'next': svg('<path d="m9 6 6 6-6 6"/>'),
    'prev': svg('<path d="m15 6-6 6 6 6"/>'),
    'menu': svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    'close': svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    'bow': '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 3l6 4.2L14 3v10l-6-4.2L2 13Z"/></svg>',
    'ig': svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".5" fill="currentColor"/>'),
    'yt': svg('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor"/>'),
    'fb': svg('<path d="M14 21v-8h3l.5-3.5H14V7.6c0-1 .3-1.6 1.7-1.6H17.6V3a24 24 0 0 0-2.8-.2C12 2.8 10.5 4.4 10.5 7.2v2.3H7.5V13h3v8"/>'),
    'wa': svg('<path d="M4 20l1.3-4A8.5 8.5 0 1 1 8.3 19Z"/><path d="M9 9.5c.4 2 2.5 4.3 5 5l1.2-1.3-1.8-1-1 .8a5 5 0 0 1-2-2l.8-1-1-1.8Z"/>'),
}


def charkha(size=90):
    spokes = ''.join(f'<path d="M50 50L{50+40*math.cos(a):.1f} {50+40*math.sin(a):.1f}"/>' for a in [k*math.pi/6 for k in range(12)])
    return f'<svg viewBox="0 0 100 100" width="{size}" height="{size}" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="7"/>{spokes}</svg>'


MOTIF = {
    'tank': '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M22 40Q50 12 78 40Z"/><rect x="20" y="38" width="60" height="28" rx="4"/><path d="M30 66v24M70 66v24M50 66v24M30 80h40M32 52h36"/></svg>',
    'lauki': '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2"><g transform="rotate(-25 50 50)"><path d="M50 8v12"/><circle cx="50" cy="32" r="13"/><ellipse cx="50" cy="66" rx="24" ry="26"/></g></svg>',
    'chai': '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M28 28h44l-7 58H35Z"/><path d="M31 46h38M40 18c0-4 4-4 4-8M52 18c0-4 4-4 4-8"/></svg>',
    'charkha': charkha(100).replace('width="100" height="100" ', ''),
}

NAV_CATS = [('kurtas', 'Kurtas', 'p-cotton-kurta'), ('shirts', 'Shirts', 'p-check-shirt'), ('nehru-jackets', 'Nehru Jackets', 'p-nehru-olive'),
            ('sweaters', 'Half Sweaters', 'p-half-sweater'), ('pajamas', 'Pajamas', 'p-pajama'), ('gifts', 'Gift Sets', 'p-gift-box')]

LOGO = '<span class="logo" aria-label="Pradhan by Panchayat"><span class="dv" aria-hidden="true">प्रधान</span><span class="en" aria-hidden="true">by Panchayat</span></span>'


def head(title, desc, preload=''):
    deva = quote('प्रधान')
    return f'''<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#7f1d2d">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%231f2417'/%3E%3Ctext x='20' y='28' text-anchor='middle' font-family='Georgia' font-size='22' fill='%23ccd8b7'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Onest:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&text={deva}&display=swap">
{preload}<link rel="stylesheet" href="assets/css/site.css?v={ver('assets/css/site.css')}">
</head>
'''


def header(active, solid):
    def cur(k):
        return ' aria-current="page"' if k == active else ''
    men = ''.join(f'<a href="collection.html?c={c}"><img src="assets/img/{im}.webp" alt="" width="480" height="640" loading="lazy">{n}</a>' for c, n, im in NAV_CATS)
    women = '<div class="soon"><img src="assets/img/p-manju-saree.webp" alt="" width="480" height="640" loading="lazy" style="aspect-ratio:3/4"><span><b style="color:var(--ink);font-weight:500">Women’s wear is on its way.</b><br>Sarees and dupattas inspired by Manju Devi, coming after Diwali.</span></div>'
    msub = ''.join(f'<a class="sub" href="collection.html?c={c}">{n}</a>' for c, n, _ in NAV_CATS)
    return f'''<a class="sr-only" href="#main">Skip to content</a>
<div class="ann"><a href="collection.html?edit=Gifting">Diwali Gifting | <b>Free gift wrap</b> | Price-free invoice {I['arrow']}</a></div>
<header class="hdr{' solid' if solid else ''}">
  <a href="index.html" aria-label="Pradhan by Panchayat home">{LOGO}</a>
  <nav class="nav" aria-label="Main">
    <div class="dd"><a href="collection.html"{cur('shop')}>Men {I['chev']}</a><div class="dd-menu">{men}</div></div>
    <div class="dd"><a href="#" data-soon="Women’s wear is coming after Diwali">Women {I['chev']}</a><div class="dd-menu" style="width:420px;grid-template-columns:1fr">{women}</div></div>
    <a class="diwali" href="collection.html?edit=Gifting">Diwali Gifting</a>
    <a class="drops" href="collection.html?edit=Phulera%20Everyday">Phulera Drops</a>
    <a href="about.html"{cur('about')}>About Us</a>
  </nav>
  <div class="icons">
    <button class="ib srch" data-search aria-label="Search">{I['search']}</button>
    <button class="ib" data-wishlist aria-label="Wishlist">{I['heart']}<span class="ct" data-wcount></span></button>
    <button class="ib" data-open-cart aria-label="Bag">{I['bag']}<span class="ct" data-count></span></button>
    <button class="ib acct" data-soon="Accounts open at launch. Guest checkout needs none." aria-label="Account">{I['user']}</button>
    <button class="ib burger" data-menu aria-label="Menu">{I['menu']}</button>
  </div>
</header>
<nav class="mnav" id="mnav" aria-label="Mobile">
  <button class="ib x" data-menu aria-label="Close menu">{I['close']}</button>
  <a href="index.html">Home</a><a href="collection.html">Shop Men</a>{msub}
  <a href="collection.html?edit=Gifting" style="color:var(--rust-2)">Diwali Gifting</a><a href="collection.html?edit=Phulera%20Everyday" style="color:var(--green)">Phulera Drops</a>
  <a href="about.html">About Us</a><a href="#" data-search>Search</a>
</nav>
<div class="search" id="search"><form action="collection.html" role="search"><input id="search-q" name="q" type="search" placeholder="Search kurtas, jackets, shirts…" aria-label="Search products"><button class="btn dark" type="submit">Search</button><button class="ib" type="button" data-close aria-label="Close search">{I['close']}</button></form></div>
'''


def footer():
    pol = [('g-office', -8, 0), ('people-sachiv', 5, 14), ('g-textiles', -3, 28), ('people-pradhan', 7, 42), ('g-gift', -6, 56), ('h-loom-sm', 4, 70)]
    polas = ''.join(f'<img src="assets/img/{n}.webp" alt="" loading="lazy" width="600" height="400" style="left:{x}%;transform:rotate({r}deg)">' for n, r, x in pol)
    return f'''<section class="gram" aria-label="Instagram">
  <div class="gram-top">
    <div><h2>We’re on the Gram</h2><p>Let’s celebrate village life, together.</p><a class="pill" href="#" data-soon="Our Instagram goes live at launch">Follow Us</a></div>
    <div class="polas" aria-hidden="true">{polas}</div>
  </div>
  <footer class="foot">
    <div class="foot-grid">
      <div>
        <a href="index.html">{LOGO}</a>
        <p class="lead">Join us so you don’t miss a new drop from Phulera, or a story from the artisans who made it.</p>
        <form class="news"><input type="email" placeholder="Your Email Address" aria-label="Email address" required><button type="submit">Subscribe</button></form>
        <div class="soc"><h4>Socials</h4><div><a href="#" data-soon="Socials go live at launch" aria-label="Instagram">{I['ig']}</a><a href="#" data-soon="Socials go live at launch" aria-label="YouTube">{I['yt']}</a><a href="#" data-soon="Socials go live at launch" aria-label="Facebook">{I['fb']}</a><a href="#" data-soon="Socials go live at launch" aria-label="WhatsApp">{I['wa']}</a></div></div>
      </div>
      <div>
        <div class="fcols">
          <div><h4>Catalogue</h4><ul><li><a href="about.html">About Us</a></li><li><a href="collection.html">Shop All</a></li><li><a href="collection.html?edit=Phulera%20Everyday">Phulera Drops</a></li><li><a href="collection.html?edit=Gifting">Diwali Gifting</a></li></ul></div>
          <div><h4>Get in touch</h4><ul><li><a href="about.html#enquire">Contact Us</a></li><li><a href="about.html#enquire">Bulk &amp; Office Gifting</a></li><li>A TVF brand</li></ul></div>
          <div><h4>Help</h4><ul><li><a href="product.html#size-guide">Size Guide</a></li><li><a href="#" data-soon="Delivery details at launch">Shipping &amp; Delivery</a></li><li><a href="#" data-soon="Size exchange within 15 days">Returns &amp; Exchange</a></li><li><a href="#" data-soon="FAQs at launch">FAQs</a></li></ul></div>
        </div>
        <div class="legal"><span>© 2026 Pradhan by Panchayat · A TVF brand · Preview: sample products and prices</span><span>Privacy Policy &nbsp;|&nbsp; Terms &amp; Conditions</span></div>
      </div>
    </div>
    <div class="roots" aria-hidden="true">{charkha()}<span>Every thread has a village.</span>{charkha()}</div>
  </footer>
</section>
<div class="scrim" id="scrim" data-close></div>
<aside class="drawer" id="drawer" aria-label="Your bag">
  <header>Your Bag <button class="ib" data-close aria-label="Close bag">{I['close']}</button></header>
  <div class="items" id="cart-items"></div>
  <footer>
    <div class="gift-opts">
      <b>Sending this as a gift?</b>
      <label><input type="checkbox" data-gift="wrap"> Free gift wrap in handmade paper</label>
      <label><input type="checkbox" data-gift="hide"> Hide prices on the invoice</label>
      <label><input type="checkbox" data-gift="note"> Add a handwritten note</label>
      <div id="gift-msg-wrap" hidden><textarea data-gift="msg" aria-label="Gift message" placeholder="Papa, ab aap bhi Pradhan ji lagoge…"></textarea></div>
    </div>
    <div class="subtotal"><span>Subtotal</span><span id="cart-sub">₹0</span></div>
    <button class="btn dark" data-checkout>Checkout</button>
    <p class="note">Free delivery across India. Secure payment with Razorpay.</p>
  </footer>
</aside>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/data.js?v={ver('assets/js/data.js')}"></script>
<script src="assets/js/site.js?v={ver('assets/js/site.js')}"></script>
<script src="assets/js/pages.js?v={ver('assets/js/pages.js')}"></script>
</body>
</html>
'''


def page(fname, title, desc, active, body, solid=False, preload=''):
    html = head(title, desc, preload) + '<body>\n' + header(active, solid) + body + footer()
    (ROOT / fname).write_text(html, encoding='utf-8')
    print('built', fname, len(html.encode()) // 1024, 'KB')


def row(id_, title, sub, ids, see, squiggle=False):
    sq = '<svg class="squiggle" viewBox="0 0 230 160" fill="none" stroke="#c9c9c2" stroke-width="1.6" stroke-dasharray="7 7" aria-hidden="true"><path d="M2 150c40-10 60-40 90-30s10 40-20 30-10-70 40-80 60 10 116-60"/></svg>' if squiggle else ''
    return f'''<section class="row" id="{id_}">
    <div class="row-head" style="position:relative"><h2>{title}</h2><p>{sub}</p><a class="pill" href="{see}">See All {I['arrow']}</a>{sq}</div>
    <div class="track-wrap"><button class="arrow prev" aria-label="Previous">{I['prev']}</button><div class="track" data-row="{','.join(ids)}"></div><button class="arrow next" aria-label="Next">{I['next']}</button></div>
    <div class="see-m" hidden><a class="pill" href="{see}">See All {I['arrow']}</a></div>
  </section>'''


SLIDES = [
    ('h-ensemble', 'The', 'Phulera', 'Collection', 'Every thread has a village.', 'Diwali gifting · Free wrap', 'collection.html', 'Shop Now'),
    ('h-office', 'Straight out of', 'Panchayat', 'Office', 'Half sweaters, checks and kurtas', 'The Pradhan Office Edit', 'collection.html?edit=Pradhan%20Office%20Edit', 'Shop the Edit'),
    ('h-loom', 'Handmade by', 'Village', 'Artisans', 'Woven, knitted and stitched by hand', 'Loom Fresh', 'collection.html?edit=Loom%20Fresh', 'Shop Now'),
]


def slides():
    out = []
    for k, (im, a, b, c, d, pill, href, cta) in enumerate(SLIDES):
        src = f'src="assets/img/{im}.webp" srcset="assets/img/{im}-sm.webp 720w, assets/img/{im}.webp 1200w"' if k == 0 else f'data-src="assets/img/{im}.webp" data-srcset="assets/img/{im}-sm.webp 720w, assets/img/{im}.webp 1200w"'
        pri = ' fetchpriority="high"' if k == 0 else ' loading="lazy"'
        out.append(f'''<div class="slide{' on' if k == 0 else ''}"{'' if k == 0 else ' aria-hidden="true"'}>
      <img {src} sizes="100vw" alt="" width="1200" height="675"{pri}>
      <div class="copy"><span class="k1">{a}</span><span class="k2">{b}</span><span class="k1">{c}</span><span class="k3">{d}</span><span class="tagpill">{pill}</span><a class="pill light" href="{href}">{cta}</a></div>
    </div>''')
    return '\n    '.join(out)


QUOTES = [
    ('people-pradhan', '50% 30%', 'pradhan-half-sweater', 'Panchayat meeting or my daughter’s wedding, this half sweater has never once let me down.', 'Pradhan ji', 'Pradhan-pati, Phulera Gram Panchayat'),
    ('people-sachiv', '45% 40%', 'sachiv-bike-ride-shirt', 'I came to Phulera for one year. Now I wouldn’t trade these shirts for any city job.', 'Sachiv ji', 'Panchayat Secretary, Phulera'),
    ('people-prahlad', '28% 30%', 'prahlad-cotton-kurta', 'Cloth is only good when a village’s hands have made it. The rest is just show.', 'Prahlad Cha', 'Up-Pradhan, Phulera'),
]

MASON = [('big', 'h-ensemble'), ('', 'people-sachiv'), ('motif', 'tank'), ('', 'g-gift'), ('', 'g-courtyard'), ('', 'g-textiles'), ('big', 'g-loom'), ('motif pink', 'lauki'),
         ('', 'people-pradhan'), ('motif', 'chai'), ('', 'g-office'), ('motif pink', 'charkha')]


def mason():
    out = []
    for cls, n in MASON:
        if cls.startswith('motif'):
            out.append(f'<div class="{cls}" aria-hidden="true">{MOTIF[n]}</div>')
        else:
            out.append(f'<div class="{cls}"><img src="assets/img/{n}.webp" alt="" loading="lazy" width="600" height="400"></div>')
    return ''.join(out)


GIFT_ART = '''<svg class="art" viewBox="0 0 210 170" fill="none" stroke="#f6e3c8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M70 60h80l10 100H60Z" fill="#f6e3c8" fill-opacity=".95" stroke="none"/><path d="M92 60c0-22 36-22 36 0" stroke="#f6e3c8" stroke-width="3"/>
  <text x="110" y="112" text-anchor="middle" font-family="Tiro Devanagari Hindi, serif" font-size="30" fill="#994418" stroke="none">प्र</text>
  <path d="M98 140c4-10 20-10 24 0Z" fill="#994418" stroke="none"/><path d="M110 128c-3 4 0 7 0 7s3-3 0-7Z" fill="#f3a64a" stroke="none"/>
  <path d="M40 30l4 8M170 26l-4 9M30 70h9M178 72h-9M52 14l2 9M156 12l-2 9"/><circle cx="48" cy="120" r="14" fill="#e8835a" stroke="none"/><path d="M42 126l12-12M43 115h1M53 125h1" stroke="#fff" stroke-width="2"/>
</svg>'''

HOME = f'''<main id="main">
  <h1 class="sr-only">Pradhan by Panchayat: handmade clothing from Phulera</h1>
  <section class="hero" aria-roledescription="carousel" aria-label="Featured collections">
    {slides()}
    <div class="dots"></div>
  </section>

  {row('fresh', '<span class="serif">Phulera</span> <br>Drops', 'New in from the village. Same old warmth.', ['pradhan-half-sweater', 'sachiv-check-shirt', 'prahlad-cotton-kurta', 'vikas-everyday-tee', 'sachiv-bike-ride-shirt', 'pradhan-linen-shirt'], 'collection.html?edit=Phulera%20Everyday')}

  <section class="life" id="lifestyles">
    <span class="ghost" aria-hidden="true">Find Your Role</span>
    <svg class="leafmark" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M50 0C30 20 30 45 50 60 70 45 70 20 50 0ZM0 50c20-20 45-20 60 0-15 20-40 20-60 0Zm100 0c-20-20-45-20-60 0 15 20 40 20 60 0Z"/></svg>
    <h2><span class="serif">Crafted</span> for every role in Phulera.</h2>
    <div class="life-grid">
      <a class="lc" href="collection.html?edit=Pradhan%20Office%20Edit"><img src="assets/img/l-office.webp" alt="The Phulera panchayat office and water tank" width="520" height="800" loading="lazy"><span class="cap">For long days at the panchayat office, and the tea breaks in between.<span class="pill light">Office Wear {I['arrow']}</span></span></a>
      <a class="lc" href="collection.html?edit=Festive%20Edit"><img src="assets/img/l-festive.webp" alt="The people of Phulera gathered together" width="440" height="675" loading="lazy"><span class="cap">For the shaadi, the pooja and every family photo in between.<span class="pill light">Festive Wear {I['arrow']}</span></span></a>
      <a class="lc" href="collection.html?edit=Loom%20Fresh"><img src="assets/img/l-loom.webp" alt="An artisan's hands at a handloom" width="520" height="800" loading="lazy"><span class="cap">For evenings at home, in cloth that’s still warm from the loom.<span class="pill light">Loom Fresh {I['arrow']}</span></span></a>
    </div>
  </section>

  {row('loved', 'Most <br><span class="serif">Loved</span> <br>Designs', 'High chance someone in Phulera already owns one.', ['olive-nehru-jacket', 'handloom-khadi-kurta', 'loom-cotton-pajama', 'phulera-gamchha-stole', 'pradhan-gift-box', 'prahlad-cotton-kurta'], 'collection.html', True)}

  <section class="people" id="people">
    <div class="people-in">
      <div class="pq">
        <h2>People<br>of <b>Phulera</b></h2>
        <div>
          {''.join(f'<div class="quote{" on" if k == 0 else ""}" data-product="{pid}"><blockquote>“{q}”</blockquote><div class="who">{who}</div><div class="role">{role}</div></div>' for k, (_, _, pid, q, who, role) in enumerate(QUOTES))}
          <div class="pdots"></div>
        </div>
      </div>
      <div class="pimg"><div class="fr">
        {''.join(f'<img class="{"on" if k == 0 else ""}" src="assets/img/{im}.webp" alt="" loading="lazy" width="720" height="405" style="object-position:{pos}">' for k, (im, pos, *_r) in enumerate(QUOTES))}
        <a class="pchip" href="#"><img alt="" width="48" height="56"><span><span class="n"></span><br><span class="p"></span></span></a>
      </div></div>
    </div>
  </section>

  <div class="banner"><img src="assets/img/banner.webp" alt="The Phulera panchayat office under the neem tree, with the water tank behind" width="1200" height="800" loading="lazy"><a class="pill solid" href="about.html">About Pradhan</a></div>
  <div class="creed" id="philosophy">
    <p>Every village has its pradhan: the one people trust, who stands up for the community. We took the name because that is the role we want to play for India’s village artisans. We carry their craft to people who will value it, and bring a fair living back home.</p>
    <p><strong>Every thread has a village.</strong></p>
  </div>

  <section class="colours" id="colours">
    <div class="ctabs" role="tablist" aria-label="Colours of Phulera"></div>
    <span class="ghost" aria-hidden="true">Colours of Phulera</span>
    <div class="cpanel">
      <div class="cinfo"><span class="ic"></span><h3></h3><p></p><a class="pill" href="collection.html"><span>Shop</span> {I['arrow']}</a><div class="sw" role="tablist" aria-label="Pick a colour"></div></div>
      <div class="cprods"></div>
    </div>
  </section>

  <div class="marq" aria-label="Handmade by village artisans. Free gift wrap this Diwali. Straight out of Phulera. Easy size exchange."><div class="marq-track" aria-hidden="true">{''.join(f'<span>{t} {I["bow"]}</span>' for t in ['Handmade by village artisans', 'Free gift wrap this Diwali', 'Straight out of Phulera', 'Easy size exchange'] * 4)}</div></div>

  <section class="real">
    <h2>Real Phulera. <span class="serif">Real people.</span></h2>
    <p>Wear it to the chaupal. Tag <b>@pradhanbypanchayat</b> and get featured here.</p>
    <div class="mason" style="grid-auto-flow:dense">{mason()}</div>
  </section>

  <section class="gbanner" id="gifting">
    <div><div class="big">Free <small>Gift Wrap</small></div><p>This Diwali, on every order. With a price-free invoice.</p><a class="pill light" href="collection.html?edit=Gifting">Gift a Pradhan {I['arrow']}</a></div>
    {GIFT_ART}
  </section>
</main>
'''

COLLECTION = f'''<main id="main">
  <section class="chero">
    <div class="crumb"><a href="index.html">Home</a> / <span id="crumb">Shop All</span></div>
    <h1>Our handmade pieces,<em>straight out of Phulera.</em></h1>
    <div class="ctiles" id="ctiles"></div>
  </section>
  <div class="cbar"><div class="l"><span id="count"></span><button class="fbtn" id="fbtn">Filter</button></div>
    <label>Sort by: <select id="sort"><option value="new">What’s new</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></label></div>
  <div class="fpanel" id="fpanel"><div class="grp" id="f-size"></div><div class="grp" id="f-colour"></div><button class="fchip" id="f-clear">Clear all</button></div>
  <div class="cgrid" id="cgrid"></div>
</main>
'''

PRODUCT = f'''<main id="main" style="padding-top:8px">
  <section class="pdp" id="pdp"></section>
  <section class="wear"><div class="eyebrow">Wear-o-meter</div><h2>Where can you wear it?</h2><div class="wgrid" id="wear"></div></section>
  <div class="textures" aria-hidden="true"><div class="marq-track">{''.join(f'<span>{t} {charkha(26)}</span>' for t in ['HAND-SPUN', 'NATURAL FIBRES', 'VILLAGE MADE', 'HAND-SPUN', 'NATURAL FIBRES', 'VILLAGE MADE'] * 2)}</div></div>
  <section class="more"><h2>You may also like</h2><div class="track-wrap"><button class="arrow prev" aria-label="Previous">{I['prev']}</button><div class="track" id="more"></div><button class="arrow next" aria-label="Next">{I['next']}</button></div></section>
</main>
'''

ABOUT = f'''<main id="main">
  <section class="ahero"><img src="assets/img/banner.webp" alt="The Phulera panchayat office and water tank" width="1200" height="800" fetchpriority="high"><h1>Every thread<em>has a village.</em></h1></section>
  <div class="acard">
    <p>Every village has its pradhan: the one people trust, who stands up for the community and carries its voice further than it could travel alone.</p>
    <p><strong>Village craft, everyday dignity.</strong></p>
  </div>
  <section class="story">
    <h2>We didn’t start<br>as a brand</h2>
    <p>We started with a village.</p>
    <div class="tl">
      <div class="ph"><img src="assets/img/h-ensemble.webp" alt="The people of Phulera" loading="lazy" width="1200" height="675"></div>
      <div class="tx"><small>2020</small><h3>Phulera arrives on screen</h3><p>TVF’s Panchayat introduced India to Phulera: a sleepy village office, a water tank, and people who look after each other.</p></div>
      <div class="tx"><small>The wardrobe</small><h3>Viewers kept asking</h3><p>Pradhan ji’s half sweater. Sachiv ji’s checks. Prahlad Cha’s gamchha. Phulera’s clothes became as loved as its people.</p></div>
      <div class="ph"><img src="assets/img/people-pradhan.webp" alt="Pradhan ji and Manju Devi" loading="lazy" width="720" height="405"><img src="assets/img/g-office.webp" alt="Pradhan ji and Manju Devi at the panchayat office" loading="lazy" width="720" height="405"></div>
      <div class="ph"><img src="assets/img/g-loom.webp" alt="An artisan at a handloom" loading="lazy" width="600" height="400"><img src="assets/img/g-textiles.webp" alt="Handloom khadi and a spool of thread" loading="lazy" width="600" height="400"></div>
      <div class="tx"><small>2026</small><h3>Pradhan by Panchayat</h3><p>We took the name because that is the role we want to play for India’s village artisans. Weavers in Chanderi, block printers in Kutch, women stitching Kantha in Bengal: their skills have been passed down for generations, yet too few people ever get to wear what they make.</p></div>
    </div>
  </section>
  <section class="artisans" id="enquire">
    <img src="assets/img/g-loom.webp" alt="An artisan's hands at a handloom" loading="lazy" width="600" height="400">
    <div>
      <h2>Not only skilled,<br>but proud hands behind.</h2>
      <p>Pradhan by Panchayat brings their work to a wider market, in clothes designed for comfort, dignity and everyday wear. We work directly with artisan families, pay fairly and on time, and make in small batches. Every piece carries a village in its threads.</p>
      <p><b>Gifting for a wedding or your office this Diwali?</b> Tell us what you need and the Panchayat will sort it out.</p>
      <form class="enq" onsubmit="event.preventDefault();PBP.toast('Thank you. Enquiries open at launch.')"><input type="text" placeholder="Your name" aria-label="Your name"><input type="email" placeholder="Email" aria-label="Email"><button class="btn" type="submit">Make an Enquiry</button></form>
    </div>
  </section>
</main>
'''

if __name__ == '__main__':
    pre = '<link rel="preload" as="image" href="assets/img/h-ensemble.webp" imagesrcset="assets/img/h-ensemble-sm.webp 720w, assets/img/h-ensemble.webp 1200w" imagesizes="100vw">\n'
    page('index.html', 'Pradhan by Panchayat | Handmade clothing from Phulera', 'Kurtas, Nehru jackets, half sweaters and everyday shirts, handmade by village artisans. The clothing line from TVF’s Panchayat.', 'home', HOME, preload=pre)
    page('collection.html', 'Shop All | Pradhan by Panchayat', 'Shop handmade kurtas, shirts, Nehru jackets, half sweaters, pajamas and gift sets.', 'shop', COLLECTION)
    page('product.html', 'Product | Pradhan by Panchayat', 'Handmade by village artisans.', 'shop', PRODUCT, solid=True)
    page('about.html', 'About Us | Pradhan by Panchayat', 'Why we are called Pradhan, and how every thread has a village.', 'about', ABOUT)
