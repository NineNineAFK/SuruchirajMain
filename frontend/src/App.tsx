import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; // ✅ NEW: Recoil wrapper
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyChooseUs from './components/WhyChooseUs';
import TopCategories from './components/TopCategories';
import TrendingMasalas from './components/TrendingMasalas';
import InternationalCuisine from './components/InternationalCuisine';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SearchResults from './pages/SearchResults';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import { CartProvider } from './context/CartContext';
import { userInfoAtom } from './state/state';
import { useRecoilValue } from 'recoil';

// CONTEXT
import { LoginModalProvider } from './context/LoginModalContext';
import { WishlistProvider } from './context/WishlistContext';

// Category Pages
import Veg from './pages/categories/Veg';
import NonVeg from './pages/categories/NonVeg';
import Snacks from './pages/categories/Snacks';
import Soups from './pages/categories/Soups';
import Biryani from './pages/categories/Biryani';
import SouthIndian from './pages/categories/SouthIndian';
import Maharashtrian from './pages/categories/Maharashtrian';
import Beverages from './pages/categories/Beverages';
import Pickle from './pages/categories/Pickle'; 

// Cuisine Pages
import American from './pages/cuisines/American';
import Thai from './pages/cuisines/Thai';
import Mexican from './pages/cuisines/Mexican';
import Italian from './pages/cuisines/Italian';
import Chinese from './pages/cuisines/Chinese';
import Other from './pages/cuisines/Other';

// Sub Products Page
import SubProducts from './pages/SubProducts';

// User Pages
import Profile from './pages/user/Profile';
import Orders from './pages/user/Orders';

import AdminDashboard from './components/AdminDashboard';
import ProductsPage from './pages/ProductsPage';
import WishlistPage from './pages/WishlistPage';

// Policy Pages
import AboutUs from './pages/policy/AboutUs';
import CancellationPolicy from './pages/policy/CancellationPolicy';
import PrivacyPolicy from './pages/policy/PrivacyPolicy';
import ShippingPolicy from './pages/policy/ShippingPolicy';
import TermsAndConditions from './pages/policy/TermsAndConditions';
import ContactUs from './pages/policy/ContactUs';

// Helper to conditionally render Navbar
const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  // Hide Navbar on admin dashboard route
  if (location.pathname.startsWith('/admin')) return null;
  return <Navbar />;
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Light theme: white background */}
      <div className="block dark:hidden bg-scroll bg-cover bg-center text-black"
      style={{ backgroundImage: "url('/lightbg6.png')" }}>
        <div className="relative md:hidden z-0">
          <img
            src="/bgicons/4.png"
            alt="icon 1"
            className="absolute top-[15rem] left-3 w-16 h-16 opacity-60 rotate-[30deg]"
          />
          <img
            src="/bgicons/2.png"
            alt="icon 2"
            className="absolute top-[17rem] right-2 w-12 h-12 opacity-40"
          />
          <img
            src="/bgicons/5.png"
            alt="icon 3"
            className="absolute top-[80rem] -left-10 w-24 h-24 opacity-60 rotate-180"
          />
          <img
            src="/bgicons/1.png"
            alt="icon 3"
            className="absolute top-[75rem] right-1 w-24 h-24 opacity-60"
          />
          <img
            src="/bgicons/6.png"
            alt="icon 3"
            className="absolute top-[73rem] -left-12 w-24 h-24 opacity-60 rotate-[30deg]"
          />
          <img
            src="/bgicons/9.png"
            alt="icon 3"
            className="absolute top-[99rem] -left-7 w-24 h-24 opacity-60 rotate-[30deg]"
          />
          <img
            src="/bgicons/2.png"
            alt="icon 4"
            className="absolute top-[56rem] -left-8 w-16 h-16 opacity-40"
          />
          <img
            src="/bgicons/7.png"
            alt="icon 4"
            className="absolute top-[55rem] right-1 w-16 h-16 opacity-40"
          />
          <img
            src="/bgicons/8.png"
            alt="icon 4"
            className="absolute top-[95rem] right-1 w-36 h-36 opacity-70"
          />
          <img
            src="/bgicons/4.png"
            alt="icon 4"
            className="absolute top-[99rem] right-1 w-12 h-12 opacity-60 -rotate-12"
          />
        </div>
        <HeroSection />

        <section className="py-5">
          <WhyChooseUs />
        </section>

        <section className="py-5">
          <TopCategories />
        </section>

        <section className="py-5">
          <TrendingMasalas />
        </section>

        <section className="py-5">
          <InternationalCuisine />
        </section>

        <section className="py-5">
          <Testimonials />
        </section>
      </div>

      {/* Dark theme: background image */}
      <div
        className="hidden dark:block bg-scroll bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/pink-blue.png')" }}
      >
        <div className="bg-black bg-opacity-50">
          <HeroSection />

          <section className="py-5">
            <WhyChooseUs />
          </section>

          <section className="py-5">
            <TopCategories />
          </section>

          <section className="py-5">
            <TrendingMasalas />
          </section>

          <section className="py-5">
            <InternationalCuisine />
          </section>

          <section className="py-5">
            <Testimonials />
          </section>
        </div>
      </div>

      {/* ✅ WhatsApp Floating Button */}
      <a
        href="https://wa.me/918390369630"
        className="fixed bottom-10 right-10 z-50 bg-white p-0 rounded-full shadow-lg hover:scale-110 transition-transform"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/whatsapp-icon.svg"
          alt="WhatsApp"
          className="w-10 h-10"
        />
      </a>
    </div>
  );
};


const App: React.FC = () => {
  const user = useRecoilValue(userInfoAtom);
  return (
    <RecoilRoot> {/* ✅ Recoil context added */}
      <Router>
        <LoginModalProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 font-sans">
                <ConditionalNavbar />
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                <LoginModal />

                <Routes>
                  <Route path="/" element={<HomePage />} />

                  {/* Top Category Pages */}
                  <Route path="/categories/Veg" element={<Veg />} />
                  <Route path="/categories/NonVeg" element={<NonVeg />} />
                  <Route path="/categories/Snacks" element={<Snacks />} />
                  <Route path="/categories/Soups" element={<Soups />} />
                  <Route path="/categories/biryani" element={<Biryani />} />
                  <Route path="/categories/SouthIndian" element={<SouthIndian />} />
                  <Route path="/categories/Maharashtrian" element={<Maharashtrian />} />
                  <Route path="/categories/Beverages" element={<Beverages />} />
                  <Route path="/categories/pickle" element={<Pickle />} />

                  {/* International Cuisine Pages */}
                  <Route path="/cuisines/american" element={<American />} />
                  <Route path="/cuisines/thai" element={<Thai />} />
                  <Route path="/cuisines/mexican" element={<Mexican />} />
                  <Route path="/cuisines/italian" element={<Italian />} />
                  <Route path="/cuisines/chinese" element={<Chinese />} />
                  <Route path="/cuisines/other" element={<Other />} />

                  {/* Sub Products Page */}
                  <Route path="/sub-products" element={<SubProducts />} />

                  {/* Search Results Page */}
                  <Route path="/search" element={<SearchResults />} />

                  {/* Product Detail Page */}
                  <Route path="/product/:id" element={<ProductDetailPage />} />

                  {/* Checkout Page */}
                  <Route path="/checkout" element={<CheckoutPage />} />

                  {/* Payment Pages */}
                  <Route path="/payment/status" element={<PaymentStatusPage />} />

                  {/* User Profile Page */}
                  <Route path="/user/dashboard/profile" element={<Profile />} />
                  <Route path="/user/dashboard/orders" element={<Orders />} />

                  {/* Admin Dashboard Route */}
                  <Route path="/admin" element={<AdminDashboard />} />
          
                  {/* Products Page Route */}
                  <Route path="/products" element={<ProductsPage />} />
                  
                  {/* Wishlist Page Route */}
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Policy Pages */}
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  
                  {/* Fallback Route */}
                </Routes>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </LoginModalProvider>
      </Router>
    </RecoilRoot>
  );
};

export default App;
