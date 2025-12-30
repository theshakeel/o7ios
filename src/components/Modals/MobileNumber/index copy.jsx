import { Box, Input, OutlinedInput, Typography, IconButton, Button } from "@mui/material";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  employeeLogin,
  loginStepOne,
  loginStepThree,
} from "../../../services/auth";
import { IMAGES } from "../../../theme";

import CustomButton from "../../CustomButton";
import ModalWrapper from "../../ModalWrapper";
import VerifyAccountModal from "../VerifyAccount";
import { Style } from "../style";
import { CustomStyle } from "./style";
// import {} from "@mui/icons-material";
import "./style.css";
import toast from "react-hot-toast";
import { MdOutlineTextsms } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { selectUser, updateUserData } from "../../../store/slice/user";
import { useDispatch, useSelector } from "react-redux";
import CustomToggle from "../../CustomToggle";
import { ArrowBackIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { updateUserProfile } from "../../../services/profile";
import * as Yup from "yup";

const MobileNumberModal = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [openVerfiyModal, setVerfiyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [email, setEmail] = useState("");
  const [isCallOnly, setIsCallOnly] = useState(false);
  const { language } = useSelector(selectUser);
  const [select, setSelect] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required(t("profile_modal.required")),
      password: Yup.string().required(t("profile_modal.required")),
    }),
    onSubmit: async (values) => {
      // if (data) {
      setLoading(true);
      await employeeLogin({
        email: formik?.values?.email,
        password: formik?.values?.password,
      })
        .then((res) => {
          setLoading(false);
          setOpen(false);
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

  const handleSubmit = async () => {
    setLoading(true);
    await loginStepOne({ email, type: "sms" })
      .then((res) => {
        setEmail("");
        setLoading(false);
        setData({ ...res.data.data, email });
        toast.success("OTP has been sent to email");
        setOpen(false);
        setVerfiyModal(true);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.data?.message);
      });
  };
  const isArabic = language === "ar";
  return (
    <Box>
  <ModalWrapper 
    open={open} 
    setOpen={setOpen} 
    crossIcon
    sx={{
      '& .MuiDialog-paper': {
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 186, 131, 0.2)',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        maxWidth: 400,
        width: '90%',
        p: 0
      }
    }}
  >
    {/* Header */}
    <Box sx={{
      position: 'relative',
      textAlign: 'center',
      p: 3,
      pb: 1,
      borderBottom: '1px solid rgba(255, 186, 131, 0.1)'
    }}>
      {/* Close Icon - Top Right */}
      <IconButton
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 1,
          '&:hover': {
            background: 'rgba(255, 186, 131, 0.2)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CloseIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 20 }} />
      </IconButton>

      {/* Back Arrow - Mobile Only */}
      <Typography 
        component={"span"} 
        onClick={() => setOpen(false)} 
        sx={{
          position: "absolute",
          left: 16,
          top: 16,
          display: { xs: "flex", sm: "none" },
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 1,
          cursor: 'pointer',
          '&:hover': {
            background: 'rgba(255, 186, 131, 0.2)',
          },
          transition: 'all 0.3s ease'
        }}
      >
        {/* <ArrowBackIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 20 }} /> */}
      </Typography>

      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <Box
          component="img"
          src={IMAGES.FavIcon}
          alt="Logo"
          sx={{
            width: "40%", // 40% of total width
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        />
      </Box>


      {/* Sign In Title */}
      <Typography sx={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'white',
        mb: 0.5
      }}>
        Sign In
      </Typography>
      
      <Typography sx={{
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 400
      }}>
        Welcome back! Please sign in to continue
      </Typography>
    </Box>

    {/* Form Content */}
    <Box sx={{ p: 3 }}>
      {select ? (
        <>
          {/* Email Field */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{
              ...CustomStyle.label(isArabic),
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              fontWeight: 600,
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              {t("profile_modal.email_address")}
            </Typography>
            <OutlinedInput 
              sx={{
                ...CustomStyle.input,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 186, 131, 0.3)',
                borderRadius: 3,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: "16px",
                "& .MuiOutlinedInput-input": {
                  fontWeight: 400,
                  color: "white",
                  py: 1.5,
                  px: 2
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'none'
                },
                "&:hover": {
                  borderColor: 'rgba(255, 186, 131, 0.5)',
                  background: 'rgba(255, 255, 255, 0.15)'
                },
                "&.Mui-focused": {
                  borderColor: '#FFBA83',
                  boxShadow: '0 0 0 3px rgba(255, 186, 131, 0.2)',
                  background: 'rgba(255, 255, 255, 0.15)'
                },
                transition: 'all 0.3s ease'
              }} 
              placeholder={t("profile_modal.enter_email_address")} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.email} 
              id="email"
            />
            {formik.errors.email && formik.touched.email && (
              <Typography sx={{
                color: "#ff6b6b",
                width: '100%',
                textAlign: 'left',
                fontSize: '0.8rem',
                mt: 0.5,
                fontWeight: 500
              }}>
                {formik.errors.email}
              </Typography>
            )}
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              ...CustomStyle.label(isArabic),
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              fontWeight: 600,
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              {t("profile_modal.password")}
            </Typography>
            <Box position={"relative"} width={"100%"}>
              <OutlinedInput 
                sx={{
                  ...CustomStyle.input,
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 186, 131, 0.3)',
                  borderRadius: 3,
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontSize: "16px",
                  "& .MuiOutlinedInput-input": {
                    fontWeight: 400,
                    color: "white",
                    py: 1.5,
                    px: 2,
                    pr: 6
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 'none'
                  },
                  "&:hover": {
                    borderColor: 'rgba(255, 186, 131, 0.5)',
                    background: 'rgba(255, 255, 255, 0.15)'
                  },
                  "&.Mui-focused": {
                    borderColor: '#FFBA83',
                    boxShadow: '0 0 0 3px rgba(255, 186, 131, 0.2)',
                    background: 'rgba(255, 255, 255, 0.15)'
                  },
                  transition: 'all 0.3s ease'
                }} 
                type={showPassword ? "text" : "password"} 
                placeholder={t("profile_modal.enter_password")} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.password} 
                id="password"
              />
              <IconButton 
                sx={{
                  position: "absolute",
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: "pointer",
                  color: 'rgba(255, 186, 131, 0.8)',
                  '&:hover': {
                    color: '#FFBA83',
                    background: 'rgba(255, 186, 131, 0.1)'
                  },
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => {
                  !!showPassword ? setShowPassword(false) : setShowPassword(true)
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              {formik.errors.password && formik.touched.password && (
                <Typography sx={{
                  color: "#ff6b6b",
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  mt: 0.5,
                  fontWeight: 500
                }}>
                  {formik.errors.password}
                </Typography>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* Email Only Mode */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              ...CustomStyle.label(isArabic),
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              fontWeight: 600,
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              Email Address
            </Typography>
            <OutlinedInput 
              placeholder="Enter Email Address" 
              sx={{
                ...CustomStyle.input,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 186, 131, 0.3)',
                borderRadius: 3,
                "& .MuiOutlinedInput-input": {
                  color: "white",
                  py: 1.5,
                  px: 2
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'none'
                },
                "&:hover": {
                  borderColor: 'rgba(255, 186, 131, 0.5)',
                  background: 'rgba(255, 255, 255, 0.15)'
                },
                "&.Mui-focused": {
                  borderColor: '#FFBA83',
                  boxShadow: '0 0 0 3px rgba(255, 186, 131, 0.2)',
                  background: 'rgba(255, 255, 255, 0.15)'
                },
                transition: 'all 0.3s ease'
              }} 
              onChange={(e) => { setEmail(e.target.value) }} 
              value={email} 
              id="email"
            />
            {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "") && email && (
              <Typography sx={{
                color: "#ff6b6b",
                fontSize: '0.8rem',
                mt: 0.5,
                fontWeight: 500
              }}>
                Please enter a valid email address
              </Typography>
            )}
          </Box>
        </>
      )}

      {/* Social Login Options */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.85rem',
          mb: 2,
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            width: '35%',
            height: '1px',
            background: 'rgba(255, 186, 131, 0.3)'
          },
          '&::before': { left: 0 },
          '&::after': { right: 0 }
        }}>
          or continue with
        </Typography>

        {/* Google Sign In */}
        <Button
          sx={{
            width: '100%',
            mb: 1.5,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            py: 1.5,
            color: 'white',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 186, 131, 0.3)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Box component="span" sx={{ mr: 2, fontSize: '1.2rem' }}>🔍</Box>
          Sign in with Google
        </Button>

        {/* Apple Sign In */}
        <Button
          sx={{
            width: '100%',
            mb: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            py: 1.5,
            color: 'white',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 186, 131, 0.3)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Box component="span" sx={{ mr: 2, fontSize: '1.2rem' }}>🍎</Box>
          Sign in with Apple
        </Button>
      </Box>

      {/* Continue Button */}
      <CustomButton 
        onClick={handleSubmit} 
        buttonText={t("mobile_no_modal.continue")} 
        color="secondary" 
        sx={{
          ...Style.button,
          width: '100%',
          background: 'linear-gradient(135deg, #FFBA83 0%, #ff9f5a 100%)',
          borderRadius: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(255, 186, 131, 0.4)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(255, 186, 131, 0.5)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)',
            transform: 'none',
            boxShadow: 'none'
          },
          transition: 'all 0.3s ease'
        }} 
        loading={loading} 
        disable={loading || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
      />
    </Box>
  </ModalWrapper>
  <VerifyAccountModal open={openVerfiyModal} setOpen={setVerfiyModal} data={data} setData={setData} />
</Box>
  );
};

export default MobileNumberModal;
