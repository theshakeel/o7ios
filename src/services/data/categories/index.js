// import axios from "axios";

// const getAllCategories = async (props) => {
//   const { page = 1, number = 12 } = props;
//   return await axios({
//     method: "get",
//     url: `${process.env.REACT_APP_BASE_URL}/categories?page=${page}&number=${number}`,
//   });
// };
// export { getAllCategories };


// src/services/data/slides.js
import offlineAxiosGet from '../../offlineAxiosGet';

const getAllCategories = async (props) => {
  const { page = 1, number = 12 } = props;

   let data = await offlineAxiosGet(`${process.env.REACT_APP_BASE_URL}/categories?page=${page}&number=${number}`);
   return data
};

export { getAllCategories };
