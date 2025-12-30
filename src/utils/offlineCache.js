// src/offlineCache.js
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const CACHE_FILE = 'responses.json';

const OfflineCache = {
  async readCache() {
    try {
      const result = await Filesystem.readFile({
        path: CACHE_FILE,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return JSON.parse(result.data);
    } catch (e) {
      return {};
    }
  },

  async writeCache(data) {
    await Filesystem.writeFile({
      path: CACHE_FILE,
      directory: Directory.Data,
      data: JSON.stringify(data),
      encoding: Encoding.UTF8,
    });
  },
  async fetch(url, options = {}) {
    let cache = await this.readCache();

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response not ok');

      const data = await response.json();

      cache[url] = data;
      await this.writeCache(cache);
      return {data};
    } catch (err) {
      if (cache[url]) {
        return {data:cache[url]};
      }
      return {data: null}
      throw err; // No cached data available
    }
  },
  async clear() {
    await Filesystem.deleteFile({
      path: CACHE_FILE,
      directory: Directory.Data,
    });
  },
};

export default OfflineCache;
