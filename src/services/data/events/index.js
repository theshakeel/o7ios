import axios from "axios";
import offlineAxiosGet from '../../offlineAxiosGet';

const getCountryEvents = async (countryId) => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/country-events/${countryId}`,
  });
};

const getSearchedEvent = async (props) => {
  const { searchKey, page = 1, number = 12 } = props;
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/search-events?name=${searchKey}&page=${page}&number=${number}`,
  });
};

// const getSingleEvent = async (event, token) => {
//   return await axios({
//     method: "get",
//     url: `${process.env.REACT_APP_BASE_URL}/event/${event}?token=${token}`,
//   });
// };
const getSingleEvent = async (event, token) => {
  let data = await offlineAxiosGet(`${process.env.REACT_APP_BASE_URL}/event2/${event}?token=${token}`);
  //  console.log("data reached in events ", data)
   return data
}

const getCountryCategoryEvents = async (props) => {
  const { page, number, country, category, searchKey } = props;
  let data =  await axios({
    method: "get",
    url: `${
      process.env.REACT_APP_BASE_URL
    }/events-filter?page=${page}&number=${number}&country=${country}&category=${category}&name=${
      searchKey || ""
    }`,
  });
   console.log("data reached in events ", data)

  return data
};
    // }/events-filter?page=${page}&number=${number}&country=${country}&category=${category}&name=${

// const getCountryCategoryEvents = async (props) => {
//   const { page, number, country, category, searchKey } = props;
  
//    let data = await offlineAxiosGet(`${
//       process.env.REACT_APP_BASE_URL
//     }/allevents`);
//    console.log("data reached in events ", data)
//    return {data}
// };
export {
  getCountryCategoryEvents,
  getCountryEvents,
  getSearchedEvent,
  getSingleEvent,
};
