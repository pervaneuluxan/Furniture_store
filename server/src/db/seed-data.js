// Starter content for a fresh database. Image paths point at files the
// frontend already serves from public/assets/images.

const img = (name) => `/assets/images/${name}`;
const lorem =
  'Vestibulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh.';

const slugify = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const day = 24 * 60 * 60 * 1000;
const isoDate = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString().slice(0, 10);
const activeDiscount = (percent) => ({
  discount: percent,
  discount_start_date: isoDate(-30),
  discount_end_date: isoDate(365),
});

export const pages = [
  {
    slug: 'about',
    title: 'About Depot',
    content: 'We choose a small number of pieces each season and show them the way a gallery would: with room around them, so you can see how they are made.',
    featured: img('about_slider1.jpg'),
  },
  { slug: 'cart', title: 'Your cart' },
  { slug: 'wishlist', title: 'Saved pieces', content: 'Pieces you saved to come back to.' },
  { slug: 'checkout', title: 'Checkout' },
  { slug: 'blog', title: 'Journal', content: 'Notes on materials, rooms and the people who make our pieces.' },
  { slug: 'gallery', title: 'Gallery', content: 'Objects, materials and details from around the studio.' },
  { slug: 'shop', title: 'Shop', content: 'Every piece currently in the showroom.' },
  {
    slug: 'contact',
    title: 'Visit the showroom',
    content: 'Come and see the pieces in person, or write to us about an order or a custom piece. We reply within one business day.',
    excerpt: 'Monday to Saturday, 10:00–19:00',
    metas: { map: { lat: 40.3582, lon: 49.8352, zoom: 15 } },
  },
  { slug: 'empty-cart', title: 'Your cart is currently empty.' },
];

export const productCategories = [
  { slug: 'seating', title: 'Seating' },
  { slug: 'tables', title: 'Tables' },
  { slug: 'lighting', title: 'Lighting' },
  { slug: 'tableware', title: 'Tableware' },
  { slug: 'decor', title: 'Decor' },
];

export const blogCategories = [
  { slug: 'interior', title: 'Interior' },
  { slug: 'design', title: 'Design' },
  { slug: 'lifestyle', title: 'Lifestyle' },
  { slug: 'tips', title: 'Tips' },
];

// One entry per photo, in the order of index_product1.jpg … index_product14.jpg.
const productList = [
  ['Rattan Sphere', 'decor', 45, 'Hand-woven rattan', '30 × 30 × 30 cm', 0.6,
    'A loose weave of natural rattan that throws soft shadows on a shelf or a bare floor.'],
  ['Dotted Porcelain Cup', 'tableware', 28, 'Porcelain, gold glaze inside', '8 × 8 × 9 cm', 0.2,
    'Pierced-pattern porcelain with a gold-glazed interior. Hand wash only.'],
  ['Round Café Table', 'tables', 210, 'Lacquered top, beech legs', '80 × 80 × 72 cm', 9,
    'A compact table for two with splayed beech legs and a steel cross brace.'],
  ['Bedside Table', 'tables', 180, 'Painted birch, oak legs', '45 × 35 × 52 cm', 7,
    'One soft-close drawer with a cut-out pull, so nothing sticks out at night.'],
  ['Slatted Pendant Lamp', 'lighting', 240, 'Walnut veneer slats', 'Ø 30 × 28 cm', 1.2,
    'Thin walnut slats spread the light into a warm, even glow over a table.'],
  ['Stoneware Cup and Saucer', 'tableware', 32, 'Glazed stoneware', 'Ø 9 × 6 cm', 0.4,
    'A matte grey glaze with a square saucer pressed from the same clay.'],
  ['Brass Dodecahedron', 'decor', 65, 'Brushed brass', '18 × 18 × 16 cm', 0.5,
    'An open brass frame for an air plant, a candle or nothing at all.'],
  ['Iron Teapot', 'tableware', 85, 'Enamelled cast iron, ash handle', '1.2 l', 1.8,
    'Keeps tea hot for a long time. The ash handle stays cool to the touch.'],
  ['Round Dining Table', 'tables', 760, 'Solid walnut', 'Ø 110 × 75 cm', 32,
    'Seats four comfortably. Finished with hard-wax oil that can be refreshed at home.'],
  ['Black Wall Clock', 'decor', 70, 'Powder-coated steel', 'Ø 30 cm', 0.9,
    'No numbers, just two thin hands and a silent sweep movement.'],
  ['Slatted Pendant Lamp, Large', 'lighting', 320, 'Walnut veneer slats', 'Ø 45 × 40 cm', 1.9,
    'The larger version of our slatted pendant, sized for a dining table or a stairwell.'],
  ['Stag Head Figure', 'decor', 55, 'Matte black ceramic', '12 × 10 × 24 cm', 0.7,
    'A small ceramic stag for a bookshelf or a mantelpiece.'],
  ['Pewter Icosahedron', 'decor', 48, 'Cast pewter', '10 × 10 × 10 cm', 0.9,
    'Twenty faces of cast pewter, heavy enough to use as a paperweight.'],
  ['Velvet Lattice Stool', 'seating', 290, 'Velvet seat, brass-finished steel', 'Ø 40 × 45 cm', 6,
    'A velvet-topped stool on a brass lattice base. Works as a side table too.'],
];

export const products = productList.map(([title, category, price, materials, dimensions, weight, excerpt], i) => ({
  slug: slugify(title),
  title,
  excerpt,
  content: `${excerpt} ${lorem}`,
  featured: img(`index_product${i + 1}.jpg`),
  categories: [category],
  views: (i * 37) % 100,
  metas: {
    price,
    stock: i === 9 ? 0 : 2 + ((i * 3) % 12),
    weight,
    materials,
    dimensions,
    discount: 0,
    discount_start_date: null,
    discount_end_date: null,
    ...(i % 4 === 2 ? activeDiscount(20) : {}),
    images: [],
  },
}));

const blogTitles = [
  ['Designing a calm living room', ['interior', 'design']],
  ['Five ways to style a small balcony', ['tips', 'lifestyle']],
  ['Why solid wood lasts longer', ['design']],
  ['Lighting that changes a room', ['interior', 'tips']],
  ['Mixing textures like a pro', ['design', 'lifestyle']],
  ['A guide to caring for leather', ['tips']],
];

export const blogPosts = blogTitles.map(([title, categories], i) => ({
  slug: slugify(title),
  title,
  excerpt: lorem,
  content: `${lorem} ${lorem} ${lorem}`,
  featured: img(`blog_post${i + 1}.jpg`),
  author: 'Depot Studio',
  author_image: img('post_author.png'),
  categories,
  views: (i * 53) % 100,
  created_at: isoDate(-(i * 9 + 2)),
  metas: { gallery: [img('related_post1.jpg'), img('blog-single-img-1.jpg')] },
}));

export const simplePosts = [
  ...[1, 2, 3].map((n) => ({
    type: 'slide',
    title: ['New season collection', 'Crafted to last', 'Comfort, reimagined'][n - 1],
    excerpt: 'Discover furniture designed for the way you live.',
    featured: img(`slider_main${n}.png`),
  })),
  ...[1, 2, 3, 4].map((n) => ({ type: 'partner', title: `Partner ${n}`, featured: img(`partner${n}.png`) })),
  ...Array.from({ length: 23 }, (_, i) => ({
    type: 'gallery',
    title: `Gallery image ${i + 1}`,
    featured: img(`gallery${i + 1}.jpg`),
  })),
  ...[
    ['Our story', 'Depot started as a small workshop and grew into a studio that designs and builds furniture for homes across the region.'],
    ['Our mission', 'We make honest, durable furniture from responsibly sourced materials, at fair prices.'],
    ['Our craft', 'Every piece is finished by hand and inspected before it leaves the workshop.'],
  ].map(([title, excerpt]) => ({ type: 'about-tab', title, excerpt })),
  ...[1, 2, 3].map((n) => ({
    type: 'testimonial',
    title: ['Aysel Mammadova', 'John Carter', 'Leyla Aliyeva'][n - 1],
    content: lorem,
    featured: img(`testimonials-img-${n}.png`),
    metas: { profession: ['Interior designer', 'Architect', 'Customer'][n - 1] },
  })),
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    type: 'team-member',
    title: ['Kamran Huseynov', 'Nigar Rzayeva', 'Elvin Abbasov', 'Sara Quliyeva', 'Murad Ismayilov', 'Gunel Hasanova'][n - 1],
    excerpt: 'Passionate about functional, beautiful furniture.',
    featured: img(`team_member${n}.jpg`),
    metas: {
      profession: ['Founder', 'Lead designer', 'Craftsman', 'Sales manager', 'Logistics', 'Customer care'][n - 1],
      icon_class: 'fab fa-twitter',
      icon_class2: 'fab fa-instagram',
      icon_class3: 'fab fa-facebook-f',
    },
  })),
  ...[
    ['Address', 'Baku, Neftchilar avenue 34', 'fas fa-map-marker-alt'],
    ['Phone', '+994 12 000 00 00', 'fas fa-phone'],
    ['Email', 'hello@depot.example', 'fas fa-envelope'],
  ].map(([title, content, icon_class]) => ({ type: 'address', title, content, metas: { icon_class } })),
];

export const menus = {
  main: [
    ['Shop', '/shop'],
    ['Gallery', '/gallery'],
    ['Journal', '/blog'],
    ['About', '/about'],
    ['Visit', '/contact'],
  ].map(([title, link]) => ({ title, link })),
  footer: [
    { title: 'Shop', link: '/shop', children: productCategories.map((c) => ({ title: c.title, link: `/shop?category=${c.slug}` })) },
    {
      title: 'Help',
      link: '',
      children: [
        { title: 'Cart', link: '/cart' },
        { title: 'Saved pieces', link: '/wishlist' },
        { title: 'Contact', link: '/contact' },
      ],
    },
    {
      title: 'Company',
      link: '',
      children: [
        { title: 'About', link: '/about' },
        { title: 'Journal', link: '/blog' },
        { title: 'Gallery', link: '/gallery' },
      ],
    },
  ],
};

// Interface text. Content (product names, articles) is stored in one language.
export const translations = {
  en: {
    home_title: 'Home',
    add_to_cart: 'Add to cart',
    added_to_cart: 'Added to your cart',
    save: 'Save',
    saved: 'Saved',
    saved_pieces: 'Saved',
    cart: 'Cart',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    shipping: 'Delivery',
    shipping_free: 'Free',
    total: 'Total',
    quantity: 'Quantity',
    remove: 'Remove',
    sold_out: 'Sold out',
    only_left: 'Only {n} left',
    on_sale: 'On sale',
    materials: 'Materials',
    dimensions: 'Dimensions',
    weight: 'Weight',
    return_to_shop: 'Return to shop',
    view_all: 'See every piece',
    in_showroom: 'In the showroom',
    empty_cart: 'Your cart is empty.',
    empty_saved: 'You haven’t saved any pieces yet.',
    browse_shop: 'Browse the shop',
    place_order: 'Place order',
    placing_order: 'Placing order…',
    send_message: 'Send message',
    sending: 'Sending…',
    page_not_found: 'This page isn’t on display.',
    back_home: 'Go to the homepage',
  },
  az: {
    home_title: 'Ana səhifə',
    add_to_cart: 'Səbətə əlavə et',
    added_to_cart: 'Səbətə əlavə edildi',
    save: 'Yadda saxla',
    saved: 'Yadda saxlanıb',
    saved_pieces: 'Seçilmişlər',
    cart: 'Səbət',
    checkout: 'Sifarişi rəsmiləşdir',
    subtotal: 'Ara cəm',
    shipping: 'Çatdırılma',
    shipping_free: 'Pulsuz',
    total: 'Cəmi',
    quantity: 'Say',
    remove: 'Sil',
    sold_out: 'Satılıb',
    only_left: 'Cəmi {n} ədəd qalıb',
    on_sale: 'Endirimdə',
    materials: 'Materiallar',
    dimensions: 'Ölçülər',
    weight: 'Çəki',
    return_to_shop: 'Mağazaya qayıt',
    view_all: 'Bütün məhsullar',
    in_showroom: 'Salonda',
    empty_cart: 'Səbətiniz boşdur.',
    empty_saved: 'Hələ heç nə yadda saxlamamısınız.',
    browse_shop: 'Mağazaya bax',
    place_order: 'Sifariş ver',
    placing_order: 'Sifariş göndərilir…',
    send_message: 'Mesajı göndər',
    sending: 'Göndərilir…',
    page_not_found: 'Bu səhifə tapılmadı.',
    back_home: 'Ana səhifəyə qayıt',
  },
};
