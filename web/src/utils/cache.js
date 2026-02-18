/**
 * Simple in-memory cache with TTL (Time To Live)
 * Used to cache API responses and reduce unnecessary network requests
 */

class Cache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Generate a cache key from parameters
   */
  generateKey(params) {
    return JSON.stringify(params);
  }

  /**
   * Get cached data if it exists and hasn't expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const timestamp = this.timestamps.get(key);
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > this.defaultTTL) {
      this.delete(key);
      return null;
    }

    console.log('Cache HIT:', key);
    return this.cache.get(key);
  }

  /**
   * Set data in cache with current timestamp
   */
  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    console.log('Cache SET:', key);
  }

  /**
   * Delete specific cache entry
   */
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    console.log('Cache DELETE:', key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
    console.log('Cache CLEARED');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache;
