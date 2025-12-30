import { Box, Input, OutlinedInput, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { employeeLogin } from "../../services/auth";
import CustomButton from "../../components/CustomButton";
import ModalWrapper from "../../components/ModalWrapper";
import { Style } from "../../components/Modals/style";
import { CustomStyle } from "../../components/Modals/MobileNumber/style";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../components/Modals/MobileNumber/style.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { selectUser, updateUserData } from "../../store/slice/user";
import { useDispatch, useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
//   

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const { language } = useSelector(selectUser);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   mixpanel?.track("employee-login", {
  //     email: user?.email,
  //     name: user?.name || "anonymous",
  //   });
  // }, []);
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: user?.email || "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required(t("profile_modal.required")),
      password: Yup.string().required(t("profile_modal.required")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await employeeLogin({
        email: formik?.values?.email,
        password: formik?.values?.password,
      })
        .then((res) => {
          setLoading(false);
          localStorage.setItem("token", res?.data?.token);
          localStorage.setItem("isEmployee", true);
          dispatch(
            updateUserData({
              ...res?.data?.user,
              token: res?.data?.token,
              countryId: user.country_id,
            })
          );
          toast.success("Registered!");

          formik.resetForm();
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error(err?.response?.data?.message);
        });
    },
  });

  const isArabic = language === "ar";
  return (
    <Box>
      <ModalWrapper employee open={true} sx={{ bgColor: "#fff !important" }}>
        <Typography
          sx={{
            display: "flex",
            textAlign: "center",
          }}
        >
          <Typography
            component={"span"}
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: "10px",
              display: { xs: "flex", sm: "none" },
            }}
          >
            <ArrowBackIcon />
          </Typography>
          <Typography component={"span"} sx={Style.heading(isArabic)}>
            {t("mobile_no_modal.employee")}
          </Typography>
        </Typography>
        <Typography component={"span"} sx={Style.subHeading(isArabic)}>
          {t("mobile_no_modal.employee_heading")}
        </Typography>
        <>
          <Typography sx={CustomStyle.label(isArabic)}>
            {t("profile_modal.email_address")}
          </Typography>
          <OutlinedInput
            sx={{
              ...CustomStyle.input,
              fontFamily: "400 !important",
              fontSize: "16px",
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
              "& .MuiOutlinedInput-input": {
                fontWeight: 400,
                color: "rgb(200, 200, 200)",
              },
            }}
            placeholder={t("profile_modal.enter_email_address")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            id="email"
          />
          {formik.errors.email && formik.touched.email && (
            <Typography sx={{ color: "red", width: "100%", textAlign: "left" }}>
              {formik.errors.email}
            </Typography>
          )}

          <Typography sx={CustomStyle.label(isArabic)}>
            {t("profile_modal.password")}
          </Typography>
          <Box position={"relative"} width={"100%"}>
            <OutlinedInput
              sx={{
                ...CustomStyle.input,
                fontFamily: "400 !important",
                fontSize: "16px",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                "& .MuiOutlinedInput-input": {
                  fontWeight: 400,
                  color: "rgb(200, 200, 200)",
                },
              }}
              type={showPassword ? "text" : "password"}
              placeholder={t("profile_modal.enter_password")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              id="password"
            />
            <Box
              sx={{
                position: "absolute",
                right: "18px",
                top: "13px",
                cursor: "pointer",
              }}
              onClick={() => {
                !!showPassword ? setShowPassword(false) : setShowPassword(true);
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </Box>
            {formik.errors.password && formik.touched.password && (
              <Typography
                sx={{ color: "red", width: "100%", textAlign: "left" }}
              >
                {formik.errors.password}
              </Typography>
            )}
          </Box>
        </>
        <CustomButton
          onClick={formik.handleSubmit}
          buttonText={t("mobile_no_modal.continue")}
          color="secondary"
          sx={Style.button}
          loading={loading}
          disable={
            loading ||
            !!Object?.values(formik?.errors)?.length ||
            !formik?.values?.email?.length ||
            !formik?.values?.password?.length
          }
        />
      </ModalWrapper>
    </Box>
  );
};

export default EmployeeLogin;
