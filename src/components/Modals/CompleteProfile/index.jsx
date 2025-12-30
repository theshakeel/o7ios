import { Box, OutlinedInput, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { loginStepThree } from "../../../services/auth";
import { selectUser, updateUserData } from "../../../store/slice/user";
import CustomButton from "../../CustomButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModalWrapper from "../../ModalWrapper";
import { Style } from "../style";
import { CustomStyle } from "./style";
import toast from "react-hot-toast";
const CompleteProfileModal = ({ open, setOpen, data }) => {
  const { language } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required!"),
      email: Yup.string().email().required("Required!"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await loginStepThree({ ...values, mobile: data.mobile })
        .then((res) => {
          setLoading(false);
          setOpen(false);
          localStorage.setItem("token", res.data.token);
          dispatch(updateUserData({ ...res.data.user, token: res.data.token }));
          toast.success("Registered!");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err?.response?.data?.data?.message);
        });
    },
  });
  const isArabic = language === "ar";
  return (
    <ModalWrapper open={open} setOpen={setOpen} crossIcon>
      <Typography
        sx={{ display: "flex", textAlign: "center", mt: { xs: "20px", sm: 0 } }}
      >
        <Typography
          component={"span"}
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            left: "10px",
            display: { xs: "flex", sm: "none" },
          }}
        >
          <ArrowBackIcon />
        </Typography>
        <Typography component={"span"} sx={Style.heading}>
          Complete Profile
        </Typography>
      </Typography>

      <Typography sx={Style.subHeading}>
        Please enter your personal information to complete your profile
      </Typography>
      {/* form start */}
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={CustomStyle.container}
      >
        <Typography sx={CustomStyle.label(isArabic)}>Full Name</Typography>
        <OutlinedInput
          sx={CustomStyle.input}
          placeholder="Enter Full Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          id="name"
        />
        {formik.errors.name && formik.touched.name && (
          <Typography sx={{ color: "red" }}>{formik.errors.name}</Typography>
        )}
        <Typography sx={CustomStyle.label(isArabic)}>Email Address</Typography>
        <OutlinedInput
          placeholder="Enter Email Address"
          sx={CustomStyle.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          id="email"
        />
        {formik.errors.email && formik.touched.email && (
          <Typography sx={{ color: "red" }}>{formik.errors.email}</Typography>
        )}
        {/* form end */}
        <CustomButton
          buttonText="Confirm"
          color="secondary"
          sx={Style.button}
          loading={loading}
          disable={loading}
          type="submit"
        />
      </Box>
    </ModalWrapper>
  );
};

export default CompleteProfileModal;
