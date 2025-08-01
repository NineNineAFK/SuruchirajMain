import React, { useState, useEffect, useRef  } from 'react';
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLoginModal } from '../context/LoginModalContext';
//import clsx from 'clsx';
import CartDrawer from './CartDrawer';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authStateAtom, userInfoAtom, searchTermAtom } from '../state/state'; //  ✅ import searchTermAtom
import ThemeToggle from '../components/ThemeToggle';

const AuthButton = () => {
  const isLoggedIn = useRecoilValue(authStateAtom);
  const userData = useRecoilValue(userInfoAtom);
  const setAuthState = useSetRecoilState(authStateAtom);
  const setUserData = useSetRecoilState(userInfoAtom);
  const openLoginModal = useLoginModal().openModal;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setAuthState(null);
    setUserData({ name: null, email: null, photo: null });
    window.location.href = `${import.meta.env.VITE_domainName}/auth/logout`;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return isLoggedIn ? (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-2 text-white hover:text-red-400 transition"
      >
        {userData?.photo ? (
          <img
            src={userData.photo}
            alt="avatar"
            className="w-8 h-8 ml-1 sm:ml-0 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">{userData?.name?.[0]}</span>
          </div>
        )}
        <span className="text-sm hidden md:inline">
          {userData?.name?.split(' ')[0]}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute -right-8 md:right-0 mt-2 w-[60vw] md:w-60 bg-white text-black rounded-md shadow-md z-50 divide-y divide-gray-200 font-body">
          <div className="flex items-center p-4">
            <img
              src={userData.photo || '/user.png'}
              alt="profile"
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <div>
              <div className="font-semibold text-sm">{userData.name}</div>
              <div className="text-xs text-gray-500 truncate">{userData.email}</div>
            </div>
          </div>
          <div className="p-2 space-y-2">
            <Link
              to="/user/dashboard/profile"
              onClick={() => setDropdownOpen(false)}
              className="block text-sm hover:text-red-500"
            >
              👤 Profile
            </Link>
            <Link
              to="/user/dashboard/orders"
              onClick={() => setDropdownOpen(false)}
              className="block text-sm hover:text-red-500"
            >
              📦 My Orders
            </Link>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="block w-full text-sm text-red-600 hover:text-red-800 text-left"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={openLoginModal}
      className="flex items-center space-x-1 text-white hover:text-red-500 transition"
    >
      <FiUser className="text-xl" />
      <span className="text-sm hidden md:inline">Sign In</span>
    </button>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  //const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { cart } = useCart();
  const searchQuery = useRecoilValue(searchTermAtom); // ✅ get searchTerm from Recoil
  const setSearchQuery = useSetRecoilState(searchTermAtom); // ✅ set searchTerm from input
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const trendingMasalas = [
    'Chhole Masala',
    'Dal Fry Masala',
    'Paneer Butter Masala',
    'Pav Bhaji Masala',
    'Tikka Masala',
    'Tandoori Masala',
    'Curry Masala',
    'C. K. P. Masala',
    'Goda Masala',
    'Sol Kadhi Masala',
    'Masale Bhat',
    'Nagpuri Saoji Masala',
    'Kolhapuri Misal Masala',
    'Batata Vada Masala',
    'Samosa Masala',
    'Chicken Chettinad Masala',
    'Peri-Peri Spice Mix',
    'Falafal Spice Mix',
    'Mexican Spice Mix',
    'Garlic Bread Spice Mix',
    'Manchurian Spice Mix'

  ];
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/sub-products' },
    { name: 'Contact Us', href: 'contact-us' },
    { name: 'About Us', href: 'about-us' },
    //{ name: 'Admin Users', href: '/admin/users' },
  ];


  //useEffect(() => {
    //const handleScroll = () => setScrolled(window.scrollY > 10);
    //window.addEventListener('scroll', handleScroll);
    //return () => window.removeEventListener('scroll', handleScroll);
  //}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % trendingMasalas.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#4D6A3F] dark:bg-black transition-all duration-300">
        <div className="container mx-auto px-3 py-2 flex items-center justify-between font-roboto font-semibold">
        {/* Mobile */}
        <div className="flex w-full items-center justify-between lg:hidden px-2 md:px-0 py-1">
          {/* Logo - far left */}
          <Link to="/" className="block">
            <img src="/newlogo.PNG" alt="Suruchiraj Logo" className="h-12 md:h-14 w-auto" />
          </Link>

          {/* Right-side icons */}
          <div className="flex items-center space-x-3.5 md:space-x-4 text-yellow-400 ml-auto">
            <ThemeToggle />
            <AuthButton />
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Hamburger menu - now at the very right */}
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FiX className="text-2xl text-yellow-400" />
              ) : (
                <FiMenu className="text-2xl text-yellow-400" />
              )}
            </button>
          </div>
        </div>


          {/* Desktop */}
          <div className="hidden lg:flex items-center justify-between w-full gap-4 md:gap-10 lg:gap-16 xl:gap-24 px-2 md:px-2 lg:px-4">
            {/* Left: Logo only */}
            <Link to="/" className="flex-shrink-0">
              <img src="/newlogo.PNG" alt="Suruchiraj Logo" className="h-14 w-auto" />
            </Link>

            {/* Right: Everything else */}
            <div className="flex items-center justify-between flex-1">
              {/* Nav links + search bar */}
              <div className="flex items-center gap-6 flex-grow justify-center">
                <nav className="flex space-x-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-white hover:text-red-500 transition duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="relative w-[24vw] max-w-md min-w-[175px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/sub-products')}
                    placeholder={`Search for "${trendingMasalas[placeholderIndex]}"`}
                    className="w-full px-4 pr-1 py-2 rounded-full border font-normal border-gray-500 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  />
                  <img
                    src="search.png"
                    alt="search"
                    onClick={() => navigate('/sub-products')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 cursor-pointer"
                  />
                </div>
              </div>

              {/* Auth + Wishlist + Cart */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <AuthButton />
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center space-x-1 text-white hover:text-red-500 transition"
                >
                  <FiShoppingCart className="text-xl" />
                  <span className="text-sm">My Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
        {isOpen && (
          <div className="lg:hidden px-4 pb-4 dark:bg-black bg-[#4D6A3F] text-white">
            <nav className="flex flex-col space-y-2 mb-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="hover:text-red-500 transition duration-200">{link.name}</Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile search */}
      <div className="lg:hidden bg-[#4D6A3F] dark:bg-black px-4 pt-3 pb-4">
        <div className="relative flex items-center">
          <div className="absolute left-3">
            <img src="search.png" alt="search" className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // ✅ update atom
            onKeyDown={(e) => e.key === 'Enter' && navigate('/sub-products')} 
            placeholder={`Search for "${trendingMasalas[placeholderIndex]}"`}
            className="w-full pl-10 pr-10 py-2 rounded-full text-sm text-gray-800 bg-white focus:outline-none"
          />
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
