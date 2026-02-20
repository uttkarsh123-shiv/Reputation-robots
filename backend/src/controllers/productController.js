const Product = require('../models/Product');
const { cache, generateKey } = require('../utils/cache');

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

    const cacheKey = generateKey('products', {
      page,
      limit,
      search,
      category,
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
    });

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) query.price.$gte = minPrice;
      if (maxPrice !== null) query.price.$lte = maxPrice;
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    const response = {
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products,
    };

    cache.set(cacheKey, response);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cachedProduct = cache.get(cacheKey);
    
    if (cachedProduct) {
      return res.status(200).json(cachedProduct);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const response = {
      success: true,
      product,
    };

    cache.set(cacheKey, response);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only - optional for this assignment)
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, image, category, stock } = req.body;

    // Validation
    if (!title || !description || !price || !image || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields',
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      image,
      category,
      stock,
    });

    cache.flushAll();

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only - optional)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    cache.flushAll();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only - optional)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    await product.deleteOne();

    cache.flushAll();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
