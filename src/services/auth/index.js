import axios from "axios";

const loginStepOne = async (data) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/step-one`,
    data,
  });
};

const loginStepTwo = async (data) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/step-two`,
    data,
  });
};

const loginStepThree = async (data) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/step-three`,
    data,
  });
};

const employeeLogin = async (data) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/login`,
    data,
  });
};

export { loginStepOne, loginStepTwo, loginStepThree, employeeLogin };
