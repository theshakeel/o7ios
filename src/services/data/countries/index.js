import axios from "axios";

const getAllCountries = async () => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/countries`,
  });
};
export { getAllCountries };
