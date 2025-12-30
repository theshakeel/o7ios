import axios from "axios";

const getUserProfile = async (token) => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateUserProfile = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/profile-update
    `,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

const logoutUser = async (token) => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/logout`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export { getUserProfile, logoutUser, updateUserProfile };
