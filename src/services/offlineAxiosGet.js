// src/services/offlineAxios.js
import OfflineCache from '../utils/offlineCache';
import axios from 'axios';

const offlineAxiosGet = async (url, config = {}) => {
  return OfflineCache.fetch(url, {
    ...config,
    method: 'GET',
  });
};

export default offlineAxiosGet;
