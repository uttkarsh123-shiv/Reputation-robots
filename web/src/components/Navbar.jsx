import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-serif font-bold text-gray-900"
            >
              Marketplace
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Favorites
                </Link>
                
                <div className="flex items-center space-x-6">
                  <span className="text-gray-600 text-sm">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="btn-primary"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={switchToLogin}
      />
    </motion.nav>
  );
};

export default Navbar;
