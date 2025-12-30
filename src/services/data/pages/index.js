import axios from "axios";
import { pageCache } from "../pageCache";

const getAllPages = async () => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/pages`,
  });
};
// const getSinglePage = async (page_slug) => {
//   return await axios({
//     method: "get",
//     url: `${process.env.REACT_APP_BASE_URL}/page/${page_slug}`,
//   });
// };

const getSinglePage = async (slug) => {
  // ✅ serve from cache
  if (pageCache[slug]) {
    console.log("data load from cache")
    return {
      data: {
        data: pageCache[slug],
      },
    };
  }

  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/page/${slug}`);

  // ✅ store EXACT response shape
  pageCache[slug] = res.data.data;

  return res;
};

export { getAllPages, getSinglePage };
