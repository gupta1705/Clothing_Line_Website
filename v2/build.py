"""v2 (Snitch layout): builds the static pages from shared partials. Run: python build.py"""
import hashlib
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent


def ver(f):
    return hashlib.md5((ROOT / f).read_bytes()).hexdigest()[:8]


def svg(body, sw='1.4'):
    return f'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</svg>'


I = {
    'menu': svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    'search': svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    'bag': svg('<path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    'heart': svg('<path d="M12 20s-7-4.4-9.2-9A4.9 4.9 0 0 1 12 6.2 4.9 4.9 0 0 1 21.2 11C19 15.6 12 20 12 20Z"/>'),
    'user': svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    'close': svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    'home': svg('<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4Z"/>'),
    'new': svg('<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z"/>'),
    'next': svg('<path d="m9 6 6 6-6 6"/>', '1.8'),
    'prev': svg('<path d="m15 6-6 6 6 6"/>', '1.8'),
}

CATS = [('kurtas', 'Kurtas', 'p-cotton-kurta'), ('shirts', 'Shirts', 'p-check-shirt'), ('nehru-jackets', 'Nehru Jackets', 'p-nehru-olive'),
        ('sweaters', 'Half Sweaters', 'p-half-sweater'), ('pajamas', 'Pajamas', 'p-pajama'), ('gifts', 'Gift Sets', 'p-gift-box')]

LOGO = '<span class="logo" aria-label="Pradhan by Panchayat"><span class="w" aria-hidden="true">PRADHAN</span><span class="s" aria-hidden="true">BY PANCHAYAT</span></span>'


def head(title, desc, preload=''):
    return f'''<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#f6efe2">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%233a2618'/%3E%3Ctext x='20' y='28' text-anchor='middle' font-family='Arial' font-weight='700' font-size='22' fill='%23f6efe2'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;700&display=swap">
{preload}<link rel="stylesheet" href="assets/css/site.css?v={ver('assets/css/site.css')}">
</head>
'''


def header(active):
    cats = ''.join(f'<a href="shop.html?c={c}">{n}<span>›</span></a>' for c, n, _ in CATS)
    return f'''<a class="sr-only" href="#main">Skip to content</a>
<header class="hdr">
  <div class="l"><button class="ib" data-menu aria-label="Menu">{I['menu']}</button></div>
  <a href="index.html" aria-label="Pradhan by Panchayat home">{LOGO}</a>
  <div class="icons">
    <button class="ib" data-search aria-label="Search">{I['search']}</button>
    <button class="ib" data-open-cart aria-label="Bag">{I['bag']}<span class="ct" data-count></span></button>
    <button class="ib hide-m" data-wishlist aria-label="Wishlist">{I['heart']}<span class="ct" data-wcount></span></button>
    <button class="ib hide-m" data-soon="Accounts open at launch. Guest checkout needs none" aria-label="Account">{I['user']}</button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Menu">
  <div class="top">{LOGO}<button class="ib" data-close aria-label="Close menu">{I['close']}</button></div>
  <h4>MEN</h4>{cats}<a href="shop.html">Shop All<span>›</span></a>
  <h4>EDITS</h4><a href="shop.html?edit=Phulera%20Everyday">Phulera Drops<span class="tag">NEW</span></a><a href="shop.html?edit=Pradhan%20Office%20Edit">Office Edit<span>›</span></a><a href="shop.html?edit=Festive%20Edit">Festive Edit<span>›</span></a><a href="shop.html?edit=Gifting">Diwali Gifting<span class="tag">FREE WRAP</span></a>
  <h4>WOMEN</h4><a href="#" class="soon" data-soon="Women’s wear is coming after Diwali">Coming after Diwali<span>›</span></a>
  <h4>MORE</h4><a href="about.html">About Pradhan<span>›</span></a><a href="shop.html?wish=1">Wishlist<span>›</span></a>
</nav>
<div class="search" id="search"><form action="shop.html" role="search"><input id="search-q" name="q" type="search" placeholder="Search for kurtas, shirts…" aria-label="Search products"><button class="btn" type="submit">Search</button><button class="ib" type="button" data-close aria-label="Close search">{I['close']}</button></form></div>
'''


def footer(active):
    tags = ' '.join(f'<a href="shop.html?c={c}">{n}</a>' for c, n, _ in CATS)
    mbar = [('home', 'Home', 'index.html', I['home']), ('menu', 'Menu', None, I['menu']), ('new', 'New', 'shop.html?edit=Phulera%20Everyday', I['new']), ('bag', 'Bag', None, I['bag']), ('wish', 'Saved', None, I['heart'])]
    mb = ''
    for k, n, href, ic in mbar:
        on = ' class="on"' if k == active else ''
        if k == 'menu':
            mb += f'<button data-menu{on}>{ic}{n}</button>'
        elif k == 'bag':
            mb += f'<button data-open-cart{on}>{ic}{n}</button>'
        elif k == 'wish':
            mb += f'<button data-wishlist{on}>{ic}{n}</button>'
        else:
            mb += f'<a href="{href}"{on}>{ic}{n}</a>'
    return f'''<footer class="foot">
  <h2><span class="lt">More about shopping</span> at Pradhan by Panchayat</h2>
  <div class="about">
    <p>Every village has its pradhan: the one people trust, who stands up for the community. We took the name because that is the role we want to play for India’s village artisans. We carry their craft to people who will value it, and bring a fair living back home.</p>
    <p>Pradhan by Panchayat is the clothing line from TVF’s Panchayat: kurtas, Nehru jackets, half sweaters, shirts and pajamas inspired by Phulera, and made by hand by weavers, knitters and tailors in villages across India. Every thread has a village.</p>
  </div>
  <h3>Top categories</h3><div class="tags">{tags}</div>
  <h3>Edits</h3><div class="tags"><a href="shop.html?edit=Phulera%20Everyday">Phulera Drops</a> <a href="shop.html?edit=Pradhan%20Office%20Edit">Office Edit</a> <a href="shop.html?edit=Festive%20Edit">Festive Edit</a> <a href="shop.html?edit=Loom%20Fresh">Loom Fresh</a> <a href="shop.html?edit=Gifting">Diwali Gifting</a></div>
  <div class="fcols">
    <div><h3>Shop</h3><ul><li><a href="shop.html">Shop All</a></li><li><a href="shop.html?edit=Gifting">Gift Sets</a></li><li><a href="shop.html?wish=1">Wishlist</a></li></ul></div>
    <div><h3>Help</h3><ul><li><a href="product.html#size-guide">Size Guide</a></li><li><a href="#" data-soon="Delivery details at launch">Delivery</a></li><li><a href="#" data-soon="Size exchange within 15 days">Returns &amp; Exchange</a></li></ul></div>
    <div><h3>Company</h3><ul><li><a href="about.html">About Pradhan</a></li><li><a href="about.html#enquire">Bulk &amp; Office Gifting</a></li><li>A TVF brand</li></ul></div>
    <div><h3>Stay in the loop</h3><form class="news"><input type="email" placeholder="Email address" aria-label="Email address" required><button type="submit">Join</button></form></div>
  </div>
  <div class="legal">{LOGO}<span>© 2026 Pradhan by Panchayat · A TVF brand · Preview: sample products and prices</span></div>
</footer>
<nav class="mbar" aria-label="Quick">{mb}</nav>
<div class="scrim" id="scrim" data-close></div>
<aside class="drawer" id="drawer" aria-label="Your bag">
  <header>Your Bag <button class="ib" data-close aria-label="Close bag">{I['close']}</button></header>
  <div class="items" id="cart-items"></div>
  <footer>
    <div class="gift-opts"><b>Sending a gift?</b>
      <label><input type="checkbox" data-gift="wrap"> Free gift wrap in handmade paper</label>
      <label><input type="checkbox" data-gift="hide"> Hide prices on the invoice</label>
      <label><input type="checkbox" data-gift="note"> Add a handwritten note</label>
      <div id="gift-msg-wrap" hidden><textarea data-gift="msg" aria-label="Gift message" placeholder="Papa, ab aap bhi Pradhan ji lagoge…"></textarea></div>
    </div>
    <div class="subtotal"><span>Subtotal</span><span id="cart-sub">₹0</span></div>
    <button class="btn" data-checkout>Checkout</button>
    <p class="note">Free delivery across India. Secure payment with Razorpay.</p>
  </footer>
</aside>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/data.js?v={ver('assets/js/data.js')}"></script>
<script src="assets/js/site.js?v={ver('assets/js/site.js')}"></script>
<script src="assets/js/pages.js?v={ver('assets/js/pages.js')}"></script>
<script src="../versions.js?v={ver('../versions.js')}"></script>
</body>
</html>
'''


def page(fname, title, desc, active, body, preload=''):
    html = head(title, desc, preload) + '<body>\n' + header(active) + body + footer(active)
    (ROOT / fname).write_text(html, encoding='utf-8')
    print('built', fname, len(html.encode()) // 1024, 'KB')


HERO = [
    ('s-hero-festive', '', '', 'fade'),
    ('s-hero-pradhan', 'The <b>Half</b> <b>Sweater</b> Edit', 'lite', ''),
    ('s-hero-office', 'Every <b>thread</b> has a <b>village.</b>', 'w', 'fade'),
    ('s-hero-sachiv', 'The <b>Phulera</b> Drop', 'lite', ''),
    ('s-hero-loom', 'Made <b>by hand</b>', 'w', 'fade'),
]


def hero():
    out = []
    for k, (im, text, mode, cls) in enumerate(HERO):
        lazy = '' if k < 2 else ' loading="lazy"'
        pri = ' fetchpriority="high"' if k == 0 else ''
        t = f'<span class="t{" w" if mode == "w" else ""}">{text}</span>' if text else ''
        out.append(f'<a class="hs {cls}{" lite" if mode == "lite" else ""}" href="shop.html"><img src="assets/img/{im}.webp" alt="" width="720" height="900"{lazy}{pri}>{t}</a>')
    return ''.join(out)


EDITS = [('p-half-sweater', 'Half Sweater Season', 'Pradhan ji approved', 'shop.html?c=sweaters'),
         ('l-festive', 'The Nehru Jacket Edit', 'For the shaadi season', 'shop.html?c=nehru-jackets'),
         ('p-check-shirt', 'Office Shirts', 'For days at the panchayat', 'shop.html?c=shirts')]
PROMOS = [('p-gift-box', 'Gift sets', 'from ₹1,099', 'shop.html?c=gifts'), ('p-cotton-kurta', 'Kurtas', 'from ₹2,199', 'shop.html?c=kurtas'),
          ('p-vikas-tee', 'Shirts &amp; tees', 'from ₹1,299', 'shop.html?c=shirts'), ('p-nehru-olive', 'Nehru jackets', '₹4,999', 'shop.html?c=nehru-jackets')]

HOME = f'''<main id="main">
  <h1 class="sr-only">Pradhan by Panchayat: handmade menswear from Phulera</h1>
  <section class="hero" aria-label="Featured edits"><div class="hero-track">{hero()}</div><div class="nav"><button class="prev" aria-label="Previous">{I['prev']}</button><button class="next" aria-label="Next">{I['next']}</button></div></section>

  <section class="sec">
    <h2 class="sh"><span class="lt">Shop by</span><b class="bd">Category</b></h2>
    <div class="cats">{''.join(f'<a class="cat" href="shop.html?c={c}"><span>{n}</span><span class="im"><img src="assets/img/{im}.webp" alt="" width="480" height="640" loading="lazy"></span></a>' for c, n, im in CATS)}</div>
    <a class="lnk" href="shop.html">Shop all</a>
  </section>

  <a class="band" href="shop.html?edit=Gifting"><span class="a">Diwali<br>gifting<br>is here</span><img src="assets/img/s-band.webp" alt="Pradhan ji in a check shirt" width="260" height="385" loading="lazy"><span class="b">Free<br>gift wrap</span></a>

  <section class="edits">{''.join(f'<a class="edit" href="{h}"><img src="assets/img/{im}.webp" alt="" width="480" height="640" loading="lazy"><span class="t">{t}</span><span class="s">{s}</span></a>' for im, t, s, h in EDITS)}</section>

  <section class="promos">{''.join(f'<a class="promo" href="{h}"><img src="assets/img/{im}.webp" alt="" width="480" height="640" loading="lazy"><span>{a}<b>{b}</b></span></a>' for im, a, b, h in PROMOS)}</section>

  <section class="sec trend">
    <h2>Trending</h2>
    <div class="tabs" id="trend-tabs" role="tablist" aria-label="Trending categories"></div>
    <div class="grid" id="trend-grid"></div>
  </section>
</main>
'''

STRIP = [('l-festive', 'New in', 'shop.html?edit=Phulera%20Everyday'), ('s-hero-pradhan', 'Office edit', 'shop.html?edit=Pradhan%20Office%20Edit'), ('h-ensemble', 'Festive edit', 'shop.html?edit=Festive%20Edit'),
         ('l-loom', 'Loom fresh', 'shop.html?edit=Loom%20Fresh'), ('g-gift', 'Diwali gifting', 'shop.html?edit=Gifting')]

SHOP = f'''<main id="main">
  <div class="strip">{''.join(f'<a href="{h}"><img src="assets/img/{im}.webp" alt="" width="720" height="400" loading="lazy"><span>{t}</span></a>' for im, t, h in STRIP)}</div>
  <div class="links" id="links"></div>
  <div class="cards"><a href="shop.html?edit=Gifting" class="red"><span>Free gift wrap<br>this Diwali</span></a><a href="about.html"><img src="assets/img/banner.webp" alt="" width="1200" height="800" loading="lazy"><span>Straight out of Phulera</span></a><a href="about.html#enquire"><img src="assets/img/g-office.webp" alt="" width="720" height="405" loading="lazy"><span>Office gifting</span></a></div>
  <section class="sec trend">
    <div class="sortbar"><h2 id="title">Shop All</h2><span id="count" style="color:var(--muted);font-size:14px"></span>
      <label style="margin-left:auto">Sort <select id="sort"><option value="rec">Recommended</option><option value="lo">Price low to high</option><option value="hi">Price high to low</option></select></label></div>
    <div class="grid" id="shop-grid"></div>
  </section>
</main>
'''

PRODUCT = '''<main id="main">
  <section class="pdp" id="pdp"></section>
  <section class="sec trend"><h2>You may also like</h2><div class="grid" id="more"></div></section>
</main>
'''

ABOUT = '''<main id="main">
  <section class="ab">
    <img src="assets/img/banner.webp" alt="The Phulera panchayat office and water tank" width="1200" height="800">
    <div>
      <h1>Every thread <b>has a village.</b></h1>
      <p>Every village has its pradhan: the one people trust, who stands up for the community and carries its voice further than it could travel alone.</p>
      <p>We took the name because that is the role we want to play for India’s village artisans. Weavers in Chanderi, block printers in Kutch, women stitching Kantha in Bengal: their skills have been passed down for generations, yet too few people ever get to wear what they make.</p>
      <p>Pradhan by Panchayat brings their work to a wider market, in clothes designed for comfort, dignity and everyday wear. We work directly with artisan families, pay fairly and on time, and make in small batches. Every piece carries a village in its threads.</p>
      <p id="enquire"><b>Gifting for a wedding or your office this Diwali?</b> Tell us what you need.</p>
      <form class="enq" onsubmit="event.preventDefault();PBP.toast('Thanks. Enquiries open at launch')"><input type="text" placeholder="Your name" aria-label="Your name"><input type="email" placeholder="Email" aria-label="Email"><button class="btn" type="submit">Make an enquiry</button></form>
    </div>
  </section>
</main>
'''

if __name__ == '__main__':
    pre = '<link rel="preload" as="image" href="assets/img/s-hero-festive.webp">\n'
    page('index.html', 'Pradhan by Panchayat | Handmade menswear from Phulera', 'Kurtas, Nehru jackets, half sweaters and shirts, handmade by village artisans. The clothing line from TVF’s Panchayat.', 'home', HOME, pre)
    page('shop.html', 'Shop All | Pradhan by Panchayat', 'Shop handmade kurtas, shirts, Nehru jackets, half sweaters, pajamas and gift sets.', 'new', SHOP)
    page('product.html', 'Product | Pradhan by Panchayat', 'Handmade by village artisans.', '', PRODUCT)
    page('about.html', 'About | Pradhan by Panchayat', 'Why we are called Pradhan, and how every thread has a village.', '', ABOUT)
    _ = quote
