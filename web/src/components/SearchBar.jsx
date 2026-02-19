import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [search, setSearch] = useState(initialValue);

  // Update local state when initialValue changes (from URL)
  useEffect(() => {
    setSearch(initialValue);
  }, [initialValue]);

  // Debounced search - triggers automatically after 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100 transition-all text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;
