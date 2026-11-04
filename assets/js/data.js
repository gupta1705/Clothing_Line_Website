/* Pradhan by Panchayat — catalogue (sample products and prices for the preview) */
window.PBP = window.PBP || {};

PBP.categories = [
  { id: 'kurtas', name: 'Kurtas', shape: 'lauki', color: 'var(--peach)', img: 'c-kurtas', blurb: 'Hand-woven cotton and khadi, cut for long days at the panchayat office.' },
  { id: 'nehru-jackets', name: 'Nehru Jackets', shape: 'tank', color: 'var(--lime)', img: 'c-nehru', blurb: 'Handloom jackets that make any kurta look like it means business.' },
  { id: 'pajamas', name: 'Pajamas', shape: 'chai', color: 'var(--pink)', img: 'c-pajamas', blurb: 'Soft, loom-fresh cotton for evenings on the charpai.' },
  { id: 'shirts', name: 'Shirts', shape: 'bubble', color: 'var(--peri)', img: 'c-shirts', blurb: 'Everyday checks and linens, Sachiv ji approved.' },
  { id: 'jackets', name: 'Sweaters & Jackets', shape: 'marigold', color: 'var(--pink)', img: 'c-jackets', blurb: 'Half sweaters and winter layers with Pradhan ji energy.' },
  { id: 'gifts', name: 'Gift Sets', shape: 'envelope', color: 'var(--peach)', img: 'c-gifts', blurb: 'Wrapped, tied and sent with a handwritten note.' }
];

PBP.products = [
  { id: 'pradhan-half-sweater', name: 'Pradhan ji Half Sweater', price: 2499, cat: 'jackets', img: 'p-half-sweater', by: 'Inspired by Pradhan ji', craft: 'Hand-knitted wool blend, made by a women’s collective in Kullu.', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 'sachiv-check-shirt', name: 'Sachiv ji Check Shirt', price: 1799, cat: 'shirts', img: 'p-check-shirt', by: 'Inspired by Sachiv ji', craft: 'Handloom cotton checks woven in Pochampally, Telangana.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'prahlad-cotton-kurta', name: 'Prahlad Cha Cotton Kurta', price: 2199, cat: 'kurtas', img: 'p-cheeka-kurta', by: 'Inspired by Prahlad Cha', craft: 'Fine-stripe cotton, hand-finished seams, Bhagalpur weavers.', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 'vikas-everyday-tee', name: 'Vikas Everyday Tee', price: 1299, cat: 'shirts', img: 'p-vikas-polo', by: 'Inspired by Vikas', craft: 'Organic cotton jersey with a hand-printed chest band.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'pradhan-linen-shirt', name: 'Pradhan ji Linen Shirt', price: 1999, cat: 'shirts', img: 'p-linen-shirt', by: 'Inspired by Pradhan ji', craft: 'Breathable handloom linen, mother-of-pearl buttons.', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 'sachiv-bike-ride-shirt', name: 'Sachiv ji Bike-Ride Shirt', price: 1899, cat: 'shirts', img: 'p-bike-shirt', by: 'Inspired by Sachiv ji', craft: 'Garment-dyed cotton in rani pink, made to ride to Phulera.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'phulera-gamchha-stole', name: 'Phulera Gamchha Stole', price: 1099, cat: 'gifts', img: 'p-gamchha', by: 'Inspired by Prahlad Cha', craft: 'Hand-woven cotton gamchha with tasselled ends, Varanasi.', sizes: ['Free'] },
  { id: 'handloom-khadi-kurta', name: 'Handloom Khadi Kurta', price: 3499, cat: 'kurtas', img: 'p-khadi-kurta', by: 'Woven in Phulera spirit', craft: 'Hand-spun, hand-woven khadi from artisan families in Bengal.', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 'olive-nehru-jacket', name: 'Olive Handloom Nehru Jacket', price: 4999, cat: 'nehru-jackets', img: 'p-nehru-olive', by: 'For the Pradhan of the family', craft: 'Slub handloom in olive, fully lined, horn buttons.', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 'loom-cotton-pajama', name: 'Loom-Fresh Cotton Pajama', price: 1199, cat: 'pajamas', img: 'p-pajama', by: 'For evenings on the charpai', craft: 'Soft hand-woven cotton with a drawstring waist.', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 'pradhan-gift-box', name: 'The Pradhan Gift Box', price: 5999, cat: 'gifts', img: 'p-gift-box', by: 'Kurta, jacket and a handwritten note', craft: 'Khadi kurta, Nehru jacket and gamchha, wrapped in handmade paper.', sizes: ['M', 'L', 'XL', 'XXL'] }
];

PBP.inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
PBP.byId = (id) => PBP.products.find((p) => p.id === id);
