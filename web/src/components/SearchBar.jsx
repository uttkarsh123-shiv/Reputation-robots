import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [search, setSearch] = useState(initialValue);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-12 pr-4"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
          🔍
        </span>
        {search && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
