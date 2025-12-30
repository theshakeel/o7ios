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
// import FavIcon from "/assets/favicon.ico"
import FavIcon from "../../../assets/newlogo.png";
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
import { Capacitor } from "@capacitor/core";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";


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
  const platform = Capacitor.getPlatform();

  async function handleAppleLogin() {
    try {
      const res = await SignInWithApple.authorize();
      console.log("Apple Login Success:", res);
      // send res.identityToken / res.authorizationCode to your backend for verification
    } catch (err) {
      console.error("Apple Login Failed:", err);
    }
  }

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
    <Box
  sx={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pb:5,
    background: "var(--app-background)",
    zIndex: 1300,
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
    overflow: 'auto',
  }}
>
  {/* Header */}
  <Box sx={{ position: 'relative', p: 3, textAlign: 'center' }}>
    <IconButton
      onClick={() => setOpen(false)}
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
      }}
    >
      <CloseIcon sx={{ fontSize: 20, color: '#e2e8f0' }} />
    </IconButton>

    <Box
      sx={{
        width: 64,
        height: 64,
        margin: '40px auto 2px',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 28,
        fontWeight: 700,
      }}
    >
    <Box
  component="img"
  src={`${window.location.origin}/assets/newlogo.png`}
  alt="O7Events"
  loading="eager"
  sx={{
    width: 50,
    height: 50,
    objectFit: "contain",
  }}
/>
    </Box>

    <Typography
      sx={{
        fontSize: 32,
        fontWeight: 700,
        color: '#f8fafc',
        mb: 1,
        letterSpacing: '-0.02em',
      }}
    >
      Sign In
    </Typography>

    <Typography sx={{ fontSize: 18, color: '#94a3b8', mb: 4 }}>
      Welcome to O7Events
    </Typography>
  </Box>

  {/* Content */}
  <Box sx={{ flex: 1, px: 0, pb: 3, mx: 'auto', width: '90%' }}>
    {select ? (
      <>
        {/* Email Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: '#f1f5f9',
              mb: 1.5,
              display: 'block',
            }}
          >
            {t("profile_modal.email_address")}
          </Typography>
          <OutlinedInput
            placeholder={t("profile_modal.enter_email_address")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            id="email"
            fullWidth
            sx={{
              height: 56,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
              },
              '& input': {
                fontSize: 16,
                color: '#f8fafc',
                '&::placeholder': {
                  color: '#94a3b8',
                  opacity: 1,
                },
              },
            }}
          />
          {formik.errors.email && formik.touched.email && (
            <Typography
              sx={{
                color: '#f87171',
                fontSize: 14,
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              ⚠️ {formik.errors.email}
            </Typography>
          )}
        </Box>

        {/* Password Field */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: '#f1f5f9',
              mb: 1.5,
              display: 'block',
            }}
          >
            {t("profile_modal.password")}
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              placeholder={t("profile_modal.enter_password")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              id="password"
              fullWidth
              sx={{
                height: 56,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                pr: 7,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
                },
                '& input': {
                  fontSize: 16,
                  color: '#f8fafc',
                  '&::placeholder': {
                    color: '#94a3b8',
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                '&:hover': { color: '#f1f5f9' },
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
          {formik.errors.password && formik.touched.password && (
            <Typography
              sx={{
                color: '#f87171',
                fontSize: 14,
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              ⚠️ {formik.errors.password}
            </Typography>
          )}
        </Box>

        {/* Sign In Button */}
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 56,
            background: 'linear-gradient(135deg, #FFBA83 0%, #FF7E5F 100%)',
            borderRadius: 2,
            fontSize: 18,
            fontWeight: 600,
            textTransform: 'none',
            mb: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            },
            '&:disabled': {
              opacity: 0.6,
              transform: 'none',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* <CircularProgress size={24} sx={{ color: 'white' }} /> */}
              Signing In...
            </Box>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Forgot Password */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component="a"
            href="#"
            sx={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 500,
              '&:hover': { 
                textDecoration: 'underline',
                color: '#818cf8',
              },
            }}
          >
            Forgot your password?
          </Typography>
        </Box>
      </>
    ) : (
      <>
        {/* Email Only Form */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: '#f1f5f9',
              mb: 1.5,
              display: 'block',
            }}
          >
            Email Address
          </Typography>
          <OutlinedInput
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            fullWidth
            sx={{
              height: 56,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFBA83',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
              },
              '& input': {
                fontSize: 16,
                color: '#f8fafc',
                '&::placeholder': {
                  color: '#94a3b8',
                  opacity: 1,
                },
              },
            }}
          />
          {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "") && email && (
            <Typography
              sx={{
                color: '#f87171',
                fontSize: 14,
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              ⚠️ Please enter a valid email address
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
          sx={{
            height: 56,
            background: "linear-gradient(135deg, #FFBA83 0%, #FF7E5F 100%)",
            borderRadius: 2,
            fontSize: 18,
            color:"#FFFF !important",
            fontWeight: 600,
            textTransform: 'none',
            mb: 4,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            '&:hover:not(:disabled)': {
              background: 'linear-gradient(135deg, #FFBA83 0%, #FF7E5F 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            },
            '&:disabled': {
              opacity: 0.6,
              transform: 'none',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* <CircularProgress size={24} sx={{ color: 'white' }} /> */}
              Please wait...
            </Box>
          ) : (
            t("mobile_no_modal.continue")
          )}
        </Button>
      </>
    )}

    {/* Divider */}
    <Box
      sx={{
        textAlign: 'center',
        my: 4,
        position: 'relative',
        color: '#64748b',
        fontSize: 16,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1,
        },
      }}
    >
     {platform === "ios" && (
      <Button
        fullWidth
        onClick={handleAppleLogin}
        sx={{
          height: 56,
          background: "#000",
          borderRadius: 2,
          fontSize: 18,
          fontWeight: 600,
          textTransform: "none",
          color: "#fff",
          mb: 2,
          "&:hover": {
            background: "#222",
            transform: "translateY(-2px)",
          },
        }}
      >
         Sign in with Apple
      </Button>
    )}

    </Box>

  </Box>

  <VerifyAccountModal 
    open={openVerfiyModal} 
    setOpen={setVerfiyModal} 
    data={data} 
    setData={setData}
  />
</Box>
  );
};

export default MobileNumberModal;
