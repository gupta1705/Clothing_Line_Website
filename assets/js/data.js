/* Pradhan by Panchayat — catalogue (sample products and prices for the preview) */
window.PBP = window.PBP || {};

PBP.categories = [
  { id: 'kurtas', name: 'Kurtas', img: 'p-cotton-kurta' },
  { id: 'shirts', name: 'Shirts', img: 'p-check-shirt' },
  { id: 'nehru-jackets', name: 'Nehru Jackets', img: 'p-nehru-jacket' },
  { id: 'sweaters', name: 'Half Sweaters', img: 'p-half-sweater' },
  { id: 'pajamas', name: 'Pajamas', img: 'p-pajama' },
  { id: 'gifts', name: 'Gift Sets', img: 'p-gift-box' }
];

/* Colour families for "Colours of Phulera" */
PBP.colours = [
  { id: 'mitti', name: 'Mitti', hex: '#7a4a2a', icon: 'pot', blurb: 'The colour of Phulera’s earth. Warm, steady and made for long days at the panchayat office.' },
  { id: 'neel', name: 'Neel', hex: '#2f4a7a', icon: 'drop', blurb: 'Indigo, hand-dyed the old way. Calm enough for a gram sabha, sharp enough for Sachiv ji.' },
  { id: 'haldi', name: 'Haldi', hex: '#d8a23a', icon: 'sun', blurb: 'The colour of every shubh shuruaat, from Diwali mornings to the first day of a new job.' },
  { id: 'mehendi', name: 'Mehendi', hex: '#5f6b33', icon: 'leaf', blurb: 'Green of the fields around the village, and of every wedding season in between.' },
  { id: 'khadi', name: 'Khadi', hex: '#efe6d2', icon: 'wheel', blurb: 'Undyed, hand-spun and honest. The cloth that started it all.' }
];

PBP.products = [
  { id: 'pradhan-half-sweater', name: 'Pradhan ji Half Sweater', price: 2499, cat: 'sweaters', img: 'p-half-sweater', tag: 'Diwali Special', line: 'Pradhan Office Edit', colour: 'mitti', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Hand-knitted wool blend from a women’s collective in Kullu.', fit: 'Relaxed fit. Layers easily over shirts and kurtas.' },
  { id: 'sachiv-check-shirt', name: 'Sachiv ji Check Shirt', price: 1799, cat: 'shirts', img: 'p-check-shirt', tag: 'Phulera Drop', line: 'Phulera Everyday', colour: 'neel', sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    craft: 'Handloom cotton checks woven in Pochampally, Telangana.', fit: 'Regular fit with a soft collar. Sleeves roll up neatly.' },
  { id: 'prahlad-cotton-kurta', name: 'Prahlad Cha Cotton Kurta', price: 2199, cat: 'kurtas', img: 'p-cotton-kurta', tag: 'Bestseller', line: 'Phulera Everyday', colour: 'haldi', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Fine-stripe cotton with hand-finished seams, Bhagalpur weavers.', fit: 'Straight, easy kurta length. Pairs with pajama or denim.' },
  { id: 'vikas-everyday-tee', name: 'Vikas Everyday Tee', price: 1299, cat: 'shirts', img: 'p-vikas-tee', tag: 'Phulera Drop', line: 'Phulera Everyday', colour: 'mitti', sizes: ['S', 'M', 'L', 'XL'],
    craft: 'Organic cotton jersey with a hand-printed chest band.', fit: 'Relaxed fit, dropped shoulder.' },
  { id: 'pradhan-linen-shirt', name: 'Pradhan ji Linen Shirt', price: 1999, cat: 'shirts', img: 'p-linen-shirt', tag: 'Restocked', line: 'Pradhan Office Edit', colour: 'neel', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Breathable handloom linen with mother-of-pearl buttons.', fit: 'Regular fit with a chest pocket for the reading glasses.' },
  { id: 'sachiv-maroon-half-sweater', name: 'Sachiv ji Maroon Half Sweater', price: 2299, cat: 'sweaters', img: 'p-sachiv-sweater', tag: 'New', line: 'Pradhan Office Edit', colour: 'mitti', sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    craft: 'Hand-knitted wool blend in deep maroon, from a women’s collective in Ludhiana.', fit: 'Regular fit. Made to sit over a check shirt on cold Phulera evenings.' },
  { id: 'sachiv-bike-ride-shirt', name: 'Sachiv ji Bike-Ride Shirt', price: 1899, cat: 'shirts', img: 'p-bike-shirt', tag: 'Limited Release', line: 'Phulera Everyday', colour: 'mitti', sizes: ['S', 'M', 'L', 'XL'],
    craft: 'Garment-dyed cotton in a deep rani-red, made for the ride to Phulera.', fit: 'Slim-regular fit. Soft enough under a backpack.' },
  { id: 'phulera-gamchha-stole', name: 'Phulera Gamchha Stole', price: 1099, cat: 'gifts', img: 'p-gamchha', tag: 'Diwali Special', line: 'Gifting', colour: 'mehendi', sizes: ['Free'],
    craft: 'Hand-woven cotton gamchha with tasselled ends, Varanasi.', fit: 'One size. Wear it on the shoulder, Prahlad Cha style.' },
  { id: 'handloom-khadi-kurta', name: 'Handloom Khadi Kurta', price: 3499, cat: 'kurtas', img: 'p-khadi-kurta', tag: 'Festive Edit', line: 'Loom Fresh', colour: 'khadi', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Hand-spun, hand-woven khadi from artisan families in Bengal.', fit: 'Classic kurta length with side slits.' },
  { id: 'olive-nehru-jacket', name: 'Pradhan ji Shaadi Nehru Jacket', price: 4999, cat: 'nehru-jackets', img: 'p-nehru-jacket', tag: 'Festive Edit', line: 'Festive Edit', colour: 'mitti', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Handloom jacket with a woven border, fully lined, with horn buttons.', fit: 'Tailored fit. Made to sit over a kurta.' },
  { id: 'loom-cotton-pajama', name: 'Loom-Fresh Cotton Pajama', price: 1199, cat: 'pajamas', img: 'p-pajama', tag: 'New', line: 'Loom Fresh', colour: 'khadi', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Soft hand-woven cotton with a drawstring waist.', fit: 'Relaxed straight leg.' },
  { id: 'pradhan-gift-box', name: 'The Pradhan Gift Box', price: 5999, cat: 'gifts', img: 'p-gift-box', tag: 'Diwali Special', line: 'Gifting', colour: 'haldi', sizes: ['M', 'L', 'XL', 'XXL'],
    craft: 'Khadi kurta, Nehru jacket and gamchha, wrapped in handmade paper with a handwritten note.', fit: 'Pick his kurta size. Easy exchange if it doesn’t fit.' }
];

/* Where can you wear it? (brand suitability guide, not reviews) */
PBP.wear = [
  { id: 'office', name: 'Panchayat Office', note: 'Long seated hours, a little dignity' },
  { id: 'shaadi', name: 'Shaadi & Pooja', note: 'Festive, photographed, hugged a lot' },
  { id: 'chaupal', name: 'Chaupal Evenings', note: 'Tea, gossip and a long walk home' },
  { id: 'travel', name: 'Travel', note: 'Train journeys and bike rides to Phulera' }
];

PBP.colourIcon = (k) => {
  const s = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const d = {
    pot: '<path d="M22 14h20M24 14c0 6-12 10-12 24a20 20 0 0 0 40 0c0-14-12-18-12-24"/><path d="M14 36h36"/>',
    drop: '<path d="M32 8C24 22 16 30 16 40a16 16 0 0 0 32 0c0-10-8-18-16-32Z"/><path d="M24 42a8 8 0 0 0 8 8"/>',
    sun: '<circle cx="32" cy="32" r="11"/><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.7 5.7M44.7 44.7l5.7 5.7M13.6 50.4l5.7-5.7M44.7 19.3l5.7-5.7"/>',
    leaf: '<path d="M52 10C26 10 12 22 12 40c0 5 1.6 9 4 12 3-14 12-22 24-27-11 7-18 16-21 29 3 1.4 6.3 2 10 2 16 0 23-17 23-46Z"/>',
    wheel: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="5"/><path d="M32 10v17M32 37v17M10 32h17M37 32h17M16.4 16.4l12 12M35.6 35.6l12 12M16.4 47.6l12-12M35.6 28.4l12-12"/>'
  };
  return s + d[k] + '</svg>';
};

PBP.inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
PBP.byId = (id) => PBP.products.find((p) => p.id === id);
