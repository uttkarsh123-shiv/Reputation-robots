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

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];

  // Fetch products whenever URL params change
  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page,
        limit: 12,
        ...(search && { search }),
        ...(category && { category }),
      };

      // Generate cache key
      const cacheKey = cache.generateKey(params);

      // Try to get from cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('📦 Using cached data');
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
        console.log('🌐 Fetching from API:', params);
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
  }, [page, search, category]);

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

  const handlePageChange = useCallback((newPage) => {
    console.log('Page change requested:', newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-center mb-6 text-gray-900">
            Discover products
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            A curated marketplace for quality products
          </p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  (cat === 'All' && !category) || category === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-6 py-12">
        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            {loading ? (
              'Loading...'
            ) : (
              <>
                {total} {total === 1 ? 'product' : 'products'}
                {search && ` matching "${search}"`}
                {category && ` in ${category}`}
                {' '}- Page {page} of {totalPages}
              </>
            )}
          </p>
          {fromCache && !loading && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              ⚡ Cached
            </span>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 mb-2">No products found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorite={user?.favorites?.some((fav) => fav._id === product._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
