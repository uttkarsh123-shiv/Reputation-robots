import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...(search && { search }),
        ...(category && category !== 'All' && { category }),
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Welcome to Marketplace
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-primary-100 text-lg mb-8"
          >
            Discover amazing products at great prices
          </motion.p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  (cat === 'All' && !category) || category === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing {products.length} of {total} products
                {search && ` for "${search}"`}
                {category && ` in ${category}`}
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400 mb-4">😕</p>
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorite={user?.favorites?.some((fav) => fav._id === product._id)}
                onFavoriteChange={fetchProducts}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
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
