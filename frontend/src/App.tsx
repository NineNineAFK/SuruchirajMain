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
            alt="rosemary"
            className="absolute top-[15rem] left-3 w-20 h-20 opacity-70 rotate-[30deg]"
          />
          <img
            src="/bgicons/8.png"
            alt="elaichi"
            className="absolute top-[14rem] right-6 w-16 h-16 opacity-60"
          />
          <img
            src="/bgicons/2.png"
            alt="black pepper"
            className="absolute top-[17rem] right-2 w-12 h-12 opacity-60"
          />
          <img
            src="/bgicons/5.png"
            alt="sticks"
            className="absolute top-[39rem] left-1 w-12 h-12 opacity-70 rotate-180"
          />
          <img
            src="/bgicons/1.png"
            alt="flower"
            className="absolute top-[38rem] right-1 w-16 h-16 opacity-60"
          />
          <img
            src="/bgicons/7.png"
            alt="chilli"
            className="absolute top-[58rem] right-1 w-20 h-20 opacity-60"
          />
          <img
            src="/bgicons/2.png"
            alt="black pepper"
            className="absolute top-[59rem] left-1 w-16 h-16 opacity-60 rotate-180"
          />
          <img
            src="/bgicons/6.png"
            alt="clove"
            className="absolute top-[55rem] left-20 w-28 h-28 opacity-60 rotate-[30deg]"
          />
          <img
            src="/bgicons/4.png"
            alt="rosemary"
            className="absolute top-[57.5rem] right-30 w-20 h-20 opacity-70 rotate-[65deg]"
          />
          <img
            src="/bgicons/9.png"
            alt="chillies"
            className="absolute top-[80rem] left-1 w-20 h-20 opacity-70 rotate-[30deg]"
          />
          <img
            src="/bgicons/5.png"
            alt="sticks"
            className="absolute top-[82rem] right-1 w-16 h-16 opacity-70"
          />
          <img
            src="/bgicons/8.png"
            alt="elaichi"
            className="absolute top-[96rem] -left-3 w-20 h-20 opacity-70 rotate-80"
          />
          <img
            src="/bgicons/2.png"
            alt="black pepper"
            className="absolute top-[97rem] left-40 w-12 h-12 opacity-55 rotate-180"
          />
          <img
            src="/bgicons/4.png"
            alt="rosemary"
            className="absolute top-[96rem] right-5 w-20 h-20 opacity-70 -rotate-[50deg]"
          />
        </div>
        <HeroSection />

        <section className="md:py-16 py-8">
          <WhyChooseUs />
        </section>

        <section className="md:py-16 py-8">
          <TopCategories />
        </section>

        <section className="md:py-16 py-8">
          <TrendingMasalas />
        </section>

        <section className="md:py-16 py-8">
          <InternationalCuisine />
        </section>

        <section className="md:pt-16 md:pb-4 pt-8">
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

          <section className="md:py-16 py-8">
            <WhyChooseUs />
          </section>

          <section className="md:py-16 py-8">
            <TopCategories />
          </section>

          <section className="md:py-16 py-8">
            <TrendingMasalas />
          </section>

          <section className="md:py-16 py-8">
            <InternationalCuisine />
          </section>

          <section className="md:pt-16 md:pb-4 py-8">
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
                  <Route path="/api/payment/redirect" element={<PaymentStatusPage />} />

                  {/* User Profile Page */}
                  <Route path="/user/dashboard/profile" element={<Profile />} />
                  <Route path="/user/dashboard/orders" element={<Orders />} />

                  {/* Admin Dashboard Route */}
                  <Route path="/admins" element={<AdminDashboard />} />
          
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
