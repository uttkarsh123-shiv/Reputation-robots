import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import cache from '../utils/cache';

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [fromCache, setFromCache] = useState(false);

  // Get params from URL
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const priceRange = searchParams.get('priceRange') || '';

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹2,500', value: '0-2500' },
    { label: '₹2,500 - ₹5,000', value: '2500-5000' },
    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { label: 'Above ₹10,000', value: '10000-999999' },
  ];

  // Fetch products whenever URL params change
  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page,
        limit: 12,
        ...(search && { search }),
        ...(category && { category }),
      };

      // Add price range filtering
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        params.minPrice = minPrice;
        params.maxPrice = maxPrice;
      }

      // Generate cache key
      const cacheKey = cache.generateKey(params);

      // Try to get from cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('Using cached data');
        setProducts(cachedData.products);
        setTotalPages(cachedData.totalPages);
        setTotal(cachedData.total);
        setFromCache(true);
        setLoading(false);
        return;
      }

      // If not in cache, fetch from API
      setLoading(true);
      setFromCache(false);
      try {
        console.log('Fetching from API:', params);
        const response = await productsAPI.getAll(params);
        console.log('API Response:', response.data);
        
        const data = {
          products: response.data.products,
          totalPages: response.data.totalPages,
          total: response.data.total,
        };

        // Store in cache
        cache.set(cacheKey, data);

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        toast.error('Failed to load products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, category, priceRange]);

  const handleSearch = useCallback((searchTerm) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handlePriceRangeChange = useCallback((range) => {
    const newParams = new URLSearchParams(searchParams);
    if (range) {
      newParams.set('priceRange', range);
    } else {
      newParams.delete('priceRange');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((newPage) => {
    console.log('Page change requested:', newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  (cat === 'All' && !category) || category === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filter & Sort</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="flex items-center mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="ml-3 text-sm text-gray-700">Price (High to low)</span>
                </label>
                <label className="flex items-center mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="ml-3 text-sm text-gray-700">Price (Low to high)</span>
                </label>
                <label className="flex items-center mb-3 cursor-pointer">
                  <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-gray-300" />
                  <span className="ml-3 text-sm text-gray-900 font-medium">Relevancy</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="ml-3 text-sm text-gray-700">Best seller</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Price Range</h3>
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center mb-3 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={(!priceRange && !range.value) || priceRange === range.value}
                      onChange={() => handlePriceRangeChange(range.value)}
                      className="w-4 h-4 text-black border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>

              {/* Category Filter */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Category</h3>
                {categories.slice(1).map((cat) => (
                  <label key={cat} className="flex items-center mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category === cat}
                      onChange={() => handleCategoryChange(category === cat ? 'All' : cat)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">All Products</h1>
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${total} results`}
                </p>
              </div>
              {fromCache && !loading && (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                  ⚡ Cached
                </span>
              )}
            </div>

            {/* Products */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isFavorite={user?.favorites?.some((fav) => fav._id === product._id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
