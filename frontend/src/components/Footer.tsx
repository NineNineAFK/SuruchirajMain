// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center md:space-x-20 space-y-10 md:space-y-0">
          {/* Thank You Note + Social Media */}
          <div className="flex flex-col items-center text-center max-w-xs px-4">
            <span className="text-[13px] sm:text-sm font-medium font-body leading-relaxed">
              Thanks for scrolling! Do visit <span className="font-bold">Suruchiraj Spices</span> again for a taste of happiness.
            </span>

            <div className="mt-4 flex space-x-6 text-white text-base sm:text-xl font-body">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-yellow-400 transition"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-yellow-400 transition"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-yellow-400 transition"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Company + Links Sections in one row (even on mobile) */}
          <div className="flex flex-row space-x-12 sm:space-x-12 items-start justify-center">
            {/* Company Section */}
            <div className="max-w-xs text-start font-body mb-6 sm:mb-0">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Company</h3>
              <ul className="text-sm sm:text-sm space-y-1">
                <li><a href="#" className="hover:text-red-400">Home</a></li>
                <li><a href="/about-us" className="hover:text-red-400">About Us</a></li>
                <li><a href="/sub-products" className="hover:text-red-400">Products</a></li>
                <li><a href="/sub-products" className="hover:text-red-400">International Cuisine</a></li>
                <li><a href="/contact-us" className="hover:text-red-400">Contact Us</a></li>
              </ul>
            </div>

            {/* Links Section */}
            <div className="max-w-xs text-start font-body">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Links</h3>
              <ul className="text-sm sm:text-sm space-y-1">
                <li><a href="/terms-and-conditions" className="hover:text-red-400">Terms & Conditions</a></li>
                <li><a href="/privacy-policy" className="hover:text-red-400">Privacy Policy</a></li>
                <li><a href="/shipping-policy" className="hover:text-red-400">Shipping Policy</a></li>
                <li><a href="/cancellation-policy" className="hover:text-red-400">Cancellation Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center text-[11px] sm:text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Suruchiraj Spices. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
