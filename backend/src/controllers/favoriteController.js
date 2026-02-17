const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Add product to favorites
// @route   POST /api/favorites/:productId
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Get user
    const user = await User.findById(req.user.id);

    // Check if already in favorites
    if (user.favorites.includes(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Product already in favorites',
      });
    }

    // Add to favorites
    user.favorites.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Get user
    const user = await User.findById(req.user.id);

    // Check if in favorites
    if (!user.favorites.includes(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Product not in favorites',
      });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};
