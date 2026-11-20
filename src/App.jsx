import { BrowserRouter, Route, Routes } from 'react-router';
import { AppProvider } from './utils/CartContext';

// general components
import Header from './components/template/Header';
import Footer from './components/template/Footer';

// home page
import Index from './components/home/Index';

// pages
import About from './components/pages/About';
import Shop from './components/pages/Shop';
import Blog from './components/pages/Blog';
import Galery from './components/pages/Galery';
import Contact from './components/pages/Contact';
import Cart from './components/pages/Cart';
import Wishlist from './components/pages/Wishlist';
import Checkout from './components/pages/Checkout';

// posts
import SingleBlog from './components/posts/SingleBlog';
import SingleProduct from './components/posts/SingleProduct';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />

        <main className="full_width">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop/:page?" element={<Shop />} />
            <Route path="/shop_item/:item_link" element={<SingleProduct />} />
            <Route path="/blog/:page?" element={<Blog />} />
            <Route path="/read_blog/:blog_link" element={<SingleBlog />} />
            <Route path="/galery" element={<Galery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}
