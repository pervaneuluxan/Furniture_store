import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import AppProviders from './context/AppProviders';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ScrollToTop, Toast } from './components/layout/Chrome';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Journal from './pages/Journal';
import JournalPost from './pages/JournalPost';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import './styles/global.css';
import './styles/layout.css';
import './styles/pages.css';

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <a href="#main" className="visually-hidden">
          Skip to content
        </a>
        <Header />

        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:page?" element={<Shop />} />
            <Route path="/shop_item/:item_link" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog/:page?" element={<Journal />} />
            <Route path="/read_blog/:blog_link" element={<JournalPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/galery" element={<Navigate to="/gallery" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <Toast />
      </BrowserRouter>
    </AppProviders>
  );
}
