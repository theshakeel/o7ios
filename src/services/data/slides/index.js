// src/services/data/slides.js
import offlineAxiosGet from '../../offlineAxiosGet';

const getAllSlides = async () => {
   let data = await offlineAxiosGet(`${process.env.REACT_APP_BASE_URL}/slides`);
   return data
};

export { getAllSlides };
