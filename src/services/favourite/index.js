import axios from "axios";

const addEventToFavourite = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/add-favorite`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data
  });
};

const removeEventToFavourite = async (token,eventId) => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/favorites/${eventId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getFavouriteEvents = async (token) => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/favorites`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { addEventToFavourite,getFavouriteEvents,removeEventToFavourite };
