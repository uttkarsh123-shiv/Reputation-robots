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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          ...(search && { search }),
          ...(category && { category }),
        };

        if (priceRange) {
          const [minPrice, maxPrice] = priceRange.split('-').map(Number);
          params.minPrice = minPrice;
          params.maxPrice = maxPrice;
        }

        const cacheKey = cache.generateKey(params);
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
          setProducts(cachedData.products);
          setTotalPages(cachedData.totalPages);
          setTotal(cachedData.total);
          setLoading(false);
          return;
        }

        const response = await productsAPI.getAll(params);
        const data = {
          products: response.data.products,
          totalPages: response.data.totalPages,
          total: response.data.total,
        };

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

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceRangeChange = (range) => {
    const newParams = new URLSearchParams(searchParams);
    if (range) {
      newParams.set('priceRange', range);
    } else {
      newParams.delete('priceRange');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white h-[50vh] md:h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 border-4 border-white transform rotate-45"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                Weekend Sale
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Everything you need<br />in one place!
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Discover amazing deals on electronics, fashion, home essentials, and more.
              </p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                        (cat === 'All' && !category) || category === cat
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={(!priceRange && !range.value) || priceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {category || 'Home'}
                </h2>
                <p className="text-sm text-gray-500">
                  {loading ? 'Loading...' : `${total} products available`}
                </p>
              </div>
              <div className="flex-shrink-0 w-80">
                <SearchBar onSearch={handleSearch} initialValue={search} />
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
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

                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
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
