// Starter content for a fresh database. Image paths point at files the
// frontend already serves from public/assets/images.

const img = (name) => `/assets/images/${name}`;
const lorem =
  'Vestibulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh.';

const day = 24 * 60 * 60 * 1000;
const isoDate = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString().slice(0, 10);
const activeDiscount = (percent) => ({
  discount: percent,
  discount_start_date: isoDate(-30),
  discount_end_date: isoDate(365),
});

export const pages = [
  { slug: 'about', title: 'About Us', featured: img('about_slider1.jpg') },
  { slug: 'cart', title: 'Cart', featured: img('about_slider2.jpg') },
  { slug: 'wishlist', title: 'Wishlist', featured: img('about_slider2.jpg') },
  { slug: 'checkout', title: 'Checkout', featured: img('about_slider1.jpg') },
  { slug: 'blog', title: 'Blog', content: 'Ideas, trends and stories from our design studio.' },
  { slug: 'gallery', title: 'Gallery', content: 'A look at the spaces our furniture lives in.' },
  { slug: 'shop', title: 'Shop' },
  {
    slug: 'contact',
    title: 'Get in touch',
    content: 'Questions about an order, a product or a custom piece? Write to us and we will reply within one business day.',
    excerpt: 'Our team is available Monday to Saturday, 10:00–19:00.',
    metas: { map: { lat: 40.3582, lon: 49.8352, zoom: 15 } },
  },
  { slug: 'empty-cart', title: 'Your cart is currently empty.' },
];

export const productCategories = [
  { slug: 'chairs', title: 'Chairs' },
  { slug: 'tables', title: 'Tables' },
  { slug: 'sofas', title: 'Sofas' },
  { slug: 'lighting', title: 'Lighting' },
  { slug: 'decor', title: 'Decor' },
];

export const blogCategories = [
  { slug: 'interior', title: 'Interior' },
  { slug: 'design', title: 'Design' },
  { slug: 'lifestyle', title: 'Lifestyle' },
  { slug: 'tips', title: 'Tips' },
];

const productNames = [
  ['Oak Lounge Chair', 'chairs', 320],
  ['Nordic Dining Table', 'tables', 890],
  ['Velvet Three-Seater', 'sofas', 1450],
  ['Brass Floor Lamp', 'lighting', 210],
  ['Ceramic Vase Set', 'decor', 75],
  ['Walnut Side Table', 'tables', 260],
  ['Rattan Armchair', 'chairs', 390],
  ['Linen Corner Sofa', 'sofas', 1990],
  ['Pendant Globe Light', 'lighting', 180],
  ['Woven Wall Hanging', 'decor', 95],
  ['Bar Stool Duo', 'chairs', 240],
  ['Marble Coffee Table', 'tables', 640],
  ['Modular Daybed', 'sofas', 1180],
  ['Desk Task Lamp', 'lighting', 120],
];

export const products = productNames.map(([title, category, price], i) => ({
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title,
  excerpt: lorem,
  content: `${lorem} ${lorem}`,
  featured: img(`index_product${i + 1}.jpg`),
  categories: [category],
  views: (i * 37) % 100,
  metas: {
    price,
    stock: 5 + ((i * 3) % 12),
    weight: 4 + i,
    discount: 0,
    discount_start_date: null,
    discount_end_date: null,
    ...(i % 3 === 0 ? activeDiscount(20) : {}),
    images: [
      img('singleProduct1.jpg'),
      img('singleProduct2.jpg'),
      img('singleProduct3.jpg'),
      img('singleProduct4.jpg'),
    ],
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
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
    ['Home', '/'],
    ['About', '/about'],
    ['Shop', '/shop'],
    ['Blog', '/blog'],
    ['Gallery', '/galery'],
    ['Contact', '/contact'],
  ].map(([title, link]) => ({ title, link })),
  footer: [
    { title: 'Shop', link: '/shop', children: productCategories.map((c) => ({ title: c.title, link: '/shop' })) },
    {
      title: 'Help',
      link: '',
      children: [
        { title: 'Cart', link: '/cart' },
        { title: 'Wishlist', link: '/wishlist' },
        { title: 'Contact', link: '/contact' },
      ],
    },
    {
      title: 'Company',
      link: '',
      children: [
        { title: 'About', link: '/about' },
        { title: 'Blog', link: '/blog' },
        { title: 'Gallery', link: '/galery' },
      ],
    },
  ],
};

export const translations = {
  az: { home_title: 'Ana səhifə', add_to_cart: 'Səbətə əlavə et', return_to_shop: 'Mağazaya qayıt' },
  en: { home_title: 'Home', add_to_cart: 'Add to cart', return_to_shop: 'Return to shop' },
};
