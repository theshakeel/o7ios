import axios from "axios";

const checkout = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/checkout`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data
  });
};
const checkoutStripe = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/checkout-stripe`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data
  });
};
const checkoutSub = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/checkout-sub`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data
  });
};
const createPaymentIntentAPI = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/create-payment-intent`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};
const checkDiscount = async (data, token) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/check-coupon`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data
  });
};

export { checkout, checkDiscount, checkoutSub, checkoutStripe, createPaymentIntentAPI };
