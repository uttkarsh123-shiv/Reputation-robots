class Cache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000;
  }

  generateKey(params) {
    return JSON.stringify(params);
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const timestamp = this.timestamps.get(key);
    const now = Date.now();

    if (now - timestamp > this.defaultTTL) {
      this.delete(key);
      return null;
    }

    console.log('Cache HIT:', key);
    return this.cache.get(key);
  }

  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    console.log('Cache SET:', key);
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    console.log('Cache DELETE:', key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
    console.log('Cache CLEARED');
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

const cache = new Cache();

export default cache;
