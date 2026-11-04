"""Builds the static pages from shared partials. Run: python build.py"""
import math
from pathlib import Path

ROOT = Path(__file__).parent
import hashlib
def ver(f):
    return hashlib.md5((ROOT / f).read_bytes()).hexdigest()[:8]

# ---------------------------------------------------------------- icons & shapes
ICON = {
    'wheel': '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle cx="20" cy="20" r="4"/>'
             + ''.join(f'<line x1="{20+4*math.cos(a):.1f}" y1="{20+4*math.sin(a):.1f}" x2="{20+16*math.cos(a):.1f}" y2="{20+16*math.sin(a):.1f}"/>' for a in [i*math.pi/4 for i in range(8)]) + '</svg>',
    'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg>',
    'bag': '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h22l-2.4 12.2a2 2 0 0 1-2 1.6H7.4a2 2 0 0 1-2-1.6Z"/><path d="M9 11 14 4l5 7M9 15v6M14 15v6M19 15v6"/></svg>',
    'cart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h3l2.4 11h11l2.1-8H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg>',
    'gift': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 4s.5 4 4 4Zm0 0s1.5-5 4-4-.5 4-4 4Z"/></svg>',
    'close': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    'ig': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>',
    'yt': '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3Z"/></svg>',
    'fb': '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4A20 20 0 0 0 14.3 4c-2.2 0-3.8 1.4-3.8 3.9v2.6H8v3h2.5V21Z"/></svg>',
}


def marigold():
    petals = ''.join(f'<circle cx="{100+62*math.cos(a):.1f}" cy="{100+62*math.sin(a):.1f}" r="21"/>' for a in [i*2*math.pi/16 for i in range(16)])
    return f'<circle cx="100" cy="100" r="64"/>{petals}'


SHAPES = {
    'lauki': '<g transform="rotate(-22 100 100)"><rect x="93" y="2" width="14" height="30" rx="6"/><circle cx="100" cy="56" r="31"/><rect x="76" y="58" width="48" height="52"/><ellipse cx="100" cy="132" rx="58" ry="60"/></g>',
    'tank': '<path d="M36 76 Q100 18 164 76Z"/><rect x="34" y="70" width="132" height="64" rx="12"/><rect x="52" y="128" width="13" height="66" rx="5"/><rect x="135" y="128" width="13" height="66" rx="5"/><rect x="93.5" y="128" width="13" height="66" rx="5"/><rect x="54" y="158" width="92" height="10" rx="5"/>',
    'chai': '<path d="M46 34H154L137 170Q100 186 63 170Z" stroke="currentColor" stroke-width="14" stroke-linejoin="round"/>',
    'bubble': '<rect x="14" y="40" width="172" height="110" rx="55"/><path d="M50 136 38 186 98 144Z"/>',
    'marigold': marigold(),
    'envelope': '<rect x="22" y="50" width="156" height="104" rx="16"/><path d="M28 60 100 114 172 60" fill="none" stroke="#f0f0f0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
    'specs': '<g transform="rotate(-14 100 100)"><path d="M14 74h172v12c-6 0-8 4-9 9-4 30-22 48-50 44-20-3-26-24-27-40h0c-1 16-7 37-27 40-28 4-46-14-50-44-1-5-3-9-9-9Z"/></g>',
    'stack': '<rect x="40" y="26" width="120" height="44" rx="22"/><rect x="40" y="78" width="120" height="44" rx="22"/><rect x="40" y="130" width="120" height="44" rx="22"/>',
    'capsule': '<rect x="56" y="10" width="88" height="180" rx="44" transform="rotate(-40 100 100)"/>',
}


def shape(name, color):
    return f'<span class="shape" style="color:{color}"><svg viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">{SHAPES[name]}</svg></span>'


def charkha(cls='charkha'):
    cols = ['#f7a3b8', '#f6b93b', '#f3e7c9', '#c98bb9', '#a8c256', '#b81d3a', '#f2d24b', '#f4c7a6', '#9bb14a', '#e86a5a']
    parts = ['<circle cx="200" cy="200" r="22" fill="#f6efe6"/>']
    for i, c in enumerate(cols):
        a = i * 2 * math.pi / len(cols) - math.pi / 2
        x, y = 200 + 150 * math.cos(a), 200 + 150 * math.sin(a)
        parts.append(f'<line x1="200" y1="200" x2="{x:.1f}" y2="{y:.1f}" stroke="#f6efe6" stroke-width="7" stroke-linecap="round"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="34" fill="{c}"/><circle cx="{x:.1f}" cy="{y:.1f}" r="22" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/><circle cx="{x:.1f}" cy="{y:.1f}" r="11" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>')
    parts.append('<circle cx="200" cy="200" r="10" fill="#c98bb9"/>')
    return f'<svg class="{cls}" viewBox="0 0 400 400" aria-hidden="true">{"".join(parts)}</svg>'


LOGO = '<span class="logo" aria-label="Pradhan by Panchayat"><span class="b" aria-hidden="true">PRADHAN</span><span class="s" aria-hidden="true">by Panchayat</span></span>'

CATS = [
    ('kurtas', 'Kurtas', 'lauki', 'var(--peach)', 'c-kurtas'),
    ('nehru-jackets', 'Nehru Jackets', 'tank', 'var(--lime)', 'c-nehru'),
    ('pajamas', 'Pajamas', 'chai', 'var(--pink)', 'c-pajamas'),
    ('shirts', 'Shirts', 'bubble', 'var(--peri)', 'c-shirts'),
    ('jackets', 'Sweaters & Jackets', 'marigold', 'var(--pink)', 'c-jackets'),
    ('gifts', 'Gift Sets', 'envelope', 'var(--peach)', 'c-gifts'),
]


# ---------------------------------------------------------------- partials
def head(title, desc, preload=''):
    return f'''<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#820263">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%23820263'/%3E%3Ctext x='20' y='29' text-anchor='middle' font-family='Arial' font-weight='700' font-size='24' fill='%23f1c1db'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Geist:wght@400;500&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yellowtail&text=by%20Panchayat&display=swap">
{preload}<link rel="stylesheet" href="assets/css/site.css?v={ver('assets/css/site.css')}">
</head>
'''


def header(active, solid):
    nav = []
    for key, label, href in (('home', 'Home', 'index.html'), ('shop', 'Shop', 'shop.html'), ('gift', 'Gift Card', 'gift-card.html'), ('about', 'About', 'about.html')):
        cur = ' aria-current="page"' if key == active else ''
        if key == 'shop':
            menu = ''.join(f'<a href="shop.html?c={c[0]}">{c[1]}</a>' for c in CATS) + '<a href="shop.html">All Products</a>'
            nav.append(f'<div class="dd"><a href="{href}"{cur}>{label}</a><div class="dd-menu">{menu}</div></div>')
        else:
            nav.append(f'<a href="{href}"{cur}>{label}</a>')
    msub = ''.join(f'<a class="sub" href="shop.html?c={c[0]}">{c[1]}</a>' for c in CATS)
    return f'''<a class="sr-only" href="#main">Skip to content</a>
<header class="site-header{' solid' if solid else ' glass'}">
  <a href="index.html" aria-label="Pradhan by Panchayat home">{LOGO}</a>
  <nav class="nav" aria-label="Main">{''.join(nav)}<button class="icon-btn search-btn" data-search aria-label="Search">{ICON['search']}</button></nav>
  <div class="hdr-right">
    <button class="icon-btn cart-btn" data-open-cart aria-label="Open bag">{ICON['bag']}<span data-count>0</span></button>
    <button class="menu-btn" data-menu aria-label="Menu">{ICON['wheel']}</button>
  </div>
</header>
<nav class="mnav" id="mnav" aria-label="Mobile">
  <button class="icon-btn close" data-menu aria-label="Close menu">{ICON['close']}</button>
  <a href="index.html">Home</a><a href="shop.html">Shop</a>{msub}<a href="gift-card.html">Gift Card</a><a href="about.html">About</a><a href="#" data-search>Search</a>
</nav>
<div class="search" id="search"><form action="shop.html" role="search"><input id="search-q" name="q" type="search" placeholder="Search kurtas, jackets, shirts…" aria-label="Search products"><button class="btn navy" type="submit">Search</button><button class="icon-btn" type="button" data-close aria-label="Close search" style="color:#fff">{ICON['close']}</button></form></div>
'''


def footer():
    cats = ''.join(f'<li><a href="shop.html?c={c[0]}">{c[1]}</a></li>' for c in CATS)
    return f'''<footer class="foot">
  <div class="foot-cols">
    <div><h4>Shop</h4><ul>{cats}<li><a href="shop.html">All Products</a></li></ul></div>
    <div class="c2"><h4>Contact Us</h4><ul><li>A TVF brand</li><li>Mumbai, Maharashtra, India</li><li><a href="about.html#enquire">Write to the Panchayat</a></li></ul>
      <div class="social"><a href="#" aria-label="Instagram">{ICON['ig']}</a><a href="#" aria-label="YouTube">{ICON['yt']}</a><a href="#" aria-label="Facebook">{ICON['fb']}</a></div></div>
    <div class="c3"><h4>Customer Care</h4><ul><li><a href="product.html#size">Size Guide</a></li><li><a href="#">Delivery &amp; Returns</a></li><li><a href="gift-card.html">Gift Cards</a></li><li><a href="#">Privacy Policy</a></li></ul></div>
  </div>
  <div class="foot-bottom">{LOGO}<small>© 2026 Pradhan by Panchayat · A TVF brand<br>Preview: sample products and prices</small></div>
</footer>
<div class="scrim" id="scrim" data-close></div>
<aside class="drawer" id="drawer" aria-label="Your bag">
  <header>Your Bag <button class="icon-btn" data-close aria-label="Close bag" style="color:#fff">{ICON['close']}</button></header>
  <div class="items" id="cart-items"></div>
  <footer>
    <div class="gift-opts">
      <label><input type="checkbox" data-gift="wrap"> Free gift wrap in handmade paper</label>
      <label><input type="checkbox" data-gift="hide"> Hide prices on the invoice</label>
      <label><input type="checkbox" data-gift="note"> Add a handwritten note</label>
      <div id="gift-msg-wrap" hidden><textarea data-gift="msg" aria-label="Gift message" placeholder="Papa, Pradhan ji ko bhi jalan hogi…"></textarea></div>
    </div>
    <div class="subtotal"><span>Subtotal</span><span id="cart-sub">₹0</span></div>
    <button class="btn" data-checkout>Checkout</button>
    <p class="note">Free delivery across India. Secure payment with Razorpay.</p>
  </footer>
</aside>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="glow" aria-hidden="true"></div>
<script src="assets/js/data.js?v={ver('assets/js/data.js')}"></script>
<script src="assets/js/site.js?v={ver('assets/js/site.js')}"></script>
<script src="assets/js/pages.js?v={ver('assets/js/pages.js')}"></script>
</body>
</html>
'''


def page(fname, title, desc, active, body, solid=True, preload=''):
    html = head(title, desc, preload) + '<body>\n' + header(active, solid) + body + footer()
    (ROOT / fname).write_text(html, encoding='utf-8')
    print('built', fname, len(html.encode()) // 1024, 'KB')


# ---------------------------------------------------------------- pages
def tiles():
    out = []
    for cid, name, shp, col, im in CATS:
        out.append(f'''<a class="tile" style="--c:{col}" href="shop.html?c={cid}">{shape(shp, col)}<h3>{name.replace(' & ', ' &amp; ')}</h3>
      <img class="t-img" src="assets/img/{im}.webp" alt="" width="640" height="420" loading="lazy"><span class="btn t-btn">Shop Now {ICON['cart']}</span></a>''')
    return '\n    '.join(out)


HOME = f'''<main id="main">
  <section class="hero" id="hero">
    <img class="hero-bg" src="assets/img/hero.webp" srcset="assets/img/hero-sm.webp 800w, assets/img/hero.webp 1600w" sizes="100vw" alt="" width="1600" height="1067" fetchpriority="high">
    <div class="hero-in">
      <div class="arch-wrap">
        <svg class="arch" viewBox="0 0 1000 430" role="img" aria-labelledby="hero-t"><title id="hero-t">Every thread has a village.</title>
          <path id="arc" d="M70 420 A 440 330 0 0 1 930 420" fill="none"/>
          <text text-anchor="middle"><textPath href="#arc" startOffset="50%">Every thread has a village.</textPath></text></svg>
      </div>
      <h1 class="sr-only">Pradhan by Panchayat: every thread has a village</h1>
      <p>Kurtas, Nehru jackets and everyday shirts, handmade by village artisans and straight out of Phulera.</p>
      <a class="pill" href="shop.html">Enter the<br>Panchayat {ICON['wheel']}</a>
    </div>
  </section>

  <div class="marquee" aria-label="Free gift wrap on every Diwali order"><div class="marquee-track" aria-hidden="true">{'<span>Free gift wrap on every Diwali order &nbsp;✦</span>' * 16}</div></div>

  <section id="categories">
    <h2 class="sec-title">What Brings You to Phulera?</h2>
    <div class="tiles">
    {tiles()}
    </div>
    <div class="center"><a class="pill" href="shop.html">Enter the<br>Panchayat {ICON['wheel']}</a></div>
  </section>

  <section class="band" id="philosophy">
    <h2 class="band-title">Why ‘Pradhan’?</h2>
    <div class="band-card">
      <h3>Every village has its pradhan.</h3>
      <p>Every village has its pradhan: the one people trust, who stands up for the community. We took the name because that is the role we want to play for India’s village artisans. We carry their craft to people who will value it, and bring a fair living back home.</p>
      <a class="btn navy" href="about.html">Read Our Story {ICON['wheel'].replace('stroke-width="2.4"', 'stroke-width="3"')}</a>
    </div>
  </section>

  <section id="favourites-sec">
    <h2 class="sec-title">Phulera’s Favourites</h2>
    <div class="grid" id="favourites"></div>
  </section>

  <section class="treat" id="gifting">
    <h2>It’s Gifting Time!</h2>
    {charkha()}
    <a class="btn end" href="gift-card.html">Get a Gift Card {ICON['gift']}</a>
  </section>

  <section id="occasions">
    <h2 class="sec-title">The Panchayat Comes to You</h2>
    <div class="tiles three">
      <a class="tile" href="shop.html?c=nehru-jackets">{shape('specs', 'var(--peach)')}<h3>For the head of the family</h3><span class="t-desc">Kurtas and jackets that thank Papa, Bade Papa and every pradhan at home.</span></a>
      <a class="tile" href="shop.html?c=gifts">{shape('stack', 'var(--pink)')}<h3>For the big moments</h3><span class="t-desc">Weddings, Diwali, griha pravesh and everything worth celebrating.</span></a>
      <a class="tile" href="about.html#enquire">{shape('capsule', 'var(--lime)')}<h3>For the whole office</h3><span class="t-desc">Diwali gifting for your team, wrapped and sent across India.</span></a>
    </div>
    <div class="center"><a class="btn" href="about.html#enquire">Make an Enquiry</a></div>
  </section>
</main>
'''

SHOP = f'''<main id="main">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &nbsp;›&nbsp; <span id="crumb-cur">All Products</span></nav>
  <div class="shop">
    <aside class="side" aria-label="Filters">
      <button class="icon-btn" data-close aria-label="Close filters" style="position:absolute;top:24px;right:16px;display:none" id="side-x">{ICON['close']}</button>
      <h2>Browse by</h2>
      <ul id="cats"></ul>
      <h2>Filter by</h2>
      <details open><summary>Price</summary><div class="range"><input id="price" type="range" min="1000" max="6000" step="100" value="6000" aria-label="Maximum price"><div class="vals"><span>₹1,000</span><span id="price-max">₹6,000</span></div></div></details>
      <details open><summary>Size</summary><div class="chips" id="size-chips"></div></details>
    </aside>
    <section>
      <div class="shop-top"><span id="count"></span><button class="btn ghost mfilter" id="mfilter">Filter</button>
        <label>Sort by: <select id="sort" class="sel"><option value="rec">Recommended</option><option value="lo">Price (low to high)</option><option value="hi">Price (high to low)</option><option value="az">Name A–Z</option></select></label></div>
      <div class="grid" id="shop-grid"></div>
    </section>
  </div>
</main>
<style>@media (max-width:900px){{.side.open #side-x{{display:inline-grid!important}}}}</style>
'''

PRODUCT = '''<main id="main">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &nbsp;›&nbsp; <a id="crumb-cat" href="shop.html">Shop</a> &nbsp;›&nbsp; <span id="crumb-cur"></span></nav>
  <section class="pdp" id="pdp"></section>
  <section><h2 class="sec-title">You Might Also Like</h2><div class="grid" id="more"></div></section>
</main>
'''

GIFT = f'''<main id="main" class="gc">
  <div class="gc-in">
    <div class="gc-card" aria-hidden="true">{charkha()}<span class="t">A little<br>Phulera,<br>gift-wrapped</span>{LOGO}</div>
    <form id="gc-form" novalidate>
      <h1>eGift Card</h1>
      <div class="amt" id="gc-amt">₹2,000</div>
      <p>Not sure of Papa’s size? Send a gift card and a note, and let him choose his own Pradhan look.</p>
      <span class="lbl">Amount</span>
      <div class="chips">{''.join(f'<button class="chip" data-amt="{a}" aria-pressed="false">₹{a:,}</button>' for a in (1000, 2000, 3000, 5000, 6000))}</div>
      <span class="lbl">Quantity</span>
      <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><input id="gc-q" value="1" inputmode="numeric" aria-label="Quantity"><button data-q="1" aria-label="Increase">+</button></div>
      <span class="lbl">Who is the gift card for?</span>
      <div class="two"><button class="chip" data-who="else" aria-pressed="true">For someone else</button><button class="chip" data-who="me" aria-pressed="false">For myself</button></div>
      <div id="gc-recipient">
        <label class="lbl" for="gc-email">Recipient email *</label><input id="gc-email" type="email" autocomplete="off">
        <label class="lbl" for="gc-name">Recipient name</label><input id="gc-name" type="text" autocomplete="off">
        <label class="lbl" for="gc-msg">Message</label><textarea id="gc-msg" placeholder="Happy Diwali, Papa. Ab aap bhi Pradhan ji lagoge."></textarea>
      </div>
      <div class="acts"><button class="btn rose" data-gc="add">Add to Cart</button><button class="btn navy" data-gc="buy">Buy Now</button></div>
    </form>
  </div>
</main>
'''

FLOATS = [('still-pradhan', 'left:6%;top:16%;width:200px;height:200px'), ('still-sachiv', 'right:7%;top:12%;width:230px;height:230px;animation-delay:-2s'),
          ('still-tank', 'left:14%;bottom:8%;width:170px;height:170px;animation-delay:-4s'), ('still-loom', 'right:15%;bottom:10%;width:190px;height:190px;animation-delay:-1s'),
          ('still-ensemble', 'left:42%;top:6%;width:120px;height:120px;animation-delay:-3s'), ('still-office', 'left:46%;bottom:5%;width:140px;height:140px;animation-delay:-5s')]

ABOUT = f'''<main id="main">
  <section class="ab-hero">
    {''.join(f'<span class="float" style="{s}"><img src="assets/img/{n}.webp" alt="" loading="lazy" width="900" height="600"></span>' for n, s in FLOATS)}
    <h1>{LOGO}</h1>
  </section>
  <section class="ab-body">
    <div class="ab-cols">
      <div>
        <h2>Every village has its pradhan</h2>
        <p>Every village has its pradhan: the one people trust, who stands up for the community and carries its voice further than it could travel alone.</p>
        <p>We took the name because that is the role we want to play for India’s village artisans. Weavers in Chanderi, block printers in Kutch, women stitching Kantha in Bengal: their skills have been passed down for generations, yet too few people ever get to wear what they make.</p>
        <p>Pradhan by Panchayat brings their work to a wider market, in clothes designed for comfort, dignity and everyday wear. We work directly with artisan families, pay fairly and on time, and make in small batches. Every piece carries a village in its threads.</p>
      </div>
      <div>
        <h2>Straight out of Phulera</h2>
        <p>Phulera gave us Pradhan ji’s half sweaters, Sachiv ji’s checks, Prahlad Cha’s gamchha and a water tank the whole country now knows. TVF’s Panchayat is a story about ordinary people who look after each other, and we wanted clothes that feel the same way.</p>
        <p>So every collection starts in the village: a character’s everyday wardrobe, re-made by hand by the artisans who keep India’s crafts alive. Simple, well made, and worn with pride.</p>
        <p id="enquire"><strong>Gifting for a wedding or your office this Diwali?</strong> Tell us what you need and the Panchayat will sort it out.</p>
        <form class="enq" onsubmit="event.preventDefault();PBP.toast('Thank you. Enquiries open at launch.')">
          <input class="sel" style="width:100%;margin-bottom:10px" type="text" placeholder="Your name" aria-label="Your name">
          <input class="sel" style="width:100%;margin-bottom:10px" type="email" placeholder="Email" aria-label="Email">
          <button class="btn rose" type="submit">Make an Enquiry</button>
        </form>
      </div>
    </div>
  </section>
  <div class="ab-strip"><img src="assets/img/still-ensemble.webp" alt="The people of Phulera gathered outside" loading="lazy" width="900" height="506"><img src="assets/img/still-loom.webp" alt="An artisan's hands at a handloom" loading="lazy" width="900" height="600"><img src="assets/img/still-tank.webp" alt="The Phulera panchayat office and water tank" loading="lazy" width="900" height="600"></div>
</main>
'''

if __name__ == '__main__':
    page('index.html', 'Pradhan by Panchayat | Handmade clothing from Phulera', 'Kurtas, Nehru jackets and everyday shirts handmade by village artisans. The official clothing line from TVF’s Panchayat.', 'home', HOME, solid=False,
         preload='<link rel="preload" as="image" href="assets/img/hero.webp" imagesrcset="assets/img/hero-sm.webp 800w, assets/img/hero.webp 1600w" imagesizes="100vw">\n')
    page('shop.html', 'Shop | Pradhan by Panchayat', 'Shop handmade kurtas, Nehru jackets, pajamas, shirts and gift sets.', 'shop', SHOP)
    page('product.html', 'Product | Pradhan by Panchayat', 'Handmade by village artisans.', 'shop', PRODUCT)
    page('gift-card.html', 'eGift Card | Pradhan by Panchayat', 'Send a Pradhan by Panchayat eGift Card.', 'gift', GIFT)
    page('about.html', 'About | Pradhan by Panchayat', 'Why we are called Pradhan, and how every thread has a village.', 'about', ABOUT)
