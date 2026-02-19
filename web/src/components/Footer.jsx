const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Micro Marketplace
            </h3>
            <p className="text-sm text-gray-600">
              A curated marketplace for quality products
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {currentYear} Micro Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
