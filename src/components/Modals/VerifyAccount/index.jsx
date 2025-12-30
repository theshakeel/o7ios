import React, { useEffect, useState } from "react";
import ModalWrapper from "../../ModalWrapper";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../CustomButton";
import OtpInput from "react-otp-input";
import { Style } from "../style";
import { CustomStyle } from "./style";
import { loginStepOne, loginStepTwo } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUserData } from "../../../store/slice/user";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Profile from "../Profile";
import { COLORS } from "../../../theme";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const VerifyAccountModal = ({ open, setOpen, data, setData }) => {
  const dispatch = useDispatch();
  const { language } = useSelector(selectUser);
  const [code, setCode] = useState("");
  const [openCompleteProfileModal, setCompleteProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState({ minutes: 0, seconds: 59 });
  const { t } = useTranslation();
  const handleSubmit = async () => {
    setLoading(true);
    await loginStepTwo({ code, uuid: data.uuid })
      .then((res) => {
        setCode("");
        toast.success("Verified Successfully");
        setLoading(false);
        setOpen(false);
        if (data.isNewUser) {
          setCompleteProfileModal(true);
        } else {
          localStorage.setItem("token", res.data.data.token);
          dispatch(
            updateUserData({
              ...res.data.data.account,
              token: res.data.data.token,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err?.response?.data?.data?.message || "Verification failed"
        );
        setLoading(false);
      });
  };
  const handleResend = async (type) => {
    if (timePeriod?.seconds === 0 && timePeriod?.minutes === 0) {
      setTimePeriod({
        seconds: 59,
        minutes: 0,
      });
      await loginStepOne({ email: data.email, type })
        .then((res) => {
          setLoading(false);
          setData({ ...res.data.data, email: data.email });
          toast.success("OTP has been resent");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.data?.message);
        });
    }
  };

  useEffect(() => {
    if (open) {
      setTimePeriod({
        seconds: 59,
        minutes: 0,
      });
    }
    let timer = setInterval(() => {
      setTimePeriod((prev) => {
        if (!(prev?.seconds === 0 && prev?.minutes === 0)) {
          return {
            seconds: prev?.seconds === 0 ? 60 : prev?.seconds - 1,
            minutes: !prev?.seconds % 60 ? prev?.minutes - 1 : prev?.minutes,
          };
        } else {
          return {
            seconds: 0,
            minutes: 0,
          };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);
  const isArabic = language === 'ar'
 return (
  <Box>
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      crossIcon
      sx={{
        "& .MuiDialog-paper": {
          background: "rgba(30, 41, 59, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 186, 131, 0.2)",
          borderRadius: 4,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          maxWidth: 420,
          width: "90%",
          // make the modal tall on mobile and allow vertical centering
          minHeight: { xs: "100dvh", sm: "auto" },
          p: 0,
        },
      }}
    >
      {/* Centering wrapper for all modal content */}
      <Box
        sx={{
          position: "relative",
          py: 6,
          px: 4,
          height:"auto",
          textAlign: "center",
        }}
      >
        {/* Back Arrow - Mobile Only */}
        <Typography
          component={"span"}
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            left: 12,
            top: 12,
            display: { xs: "flex", sm: "none" },
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            p: 1,
            cursor: "pointer",
            "&:hover": {
              background: "rgba(255, 186, 131, 0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowBackIcon sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 20 }} />
        </Typography>

        {/* Security Icon */}
        <Box
          sx={{
            fontSize: "3rem",
            mb: 2,
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
          }}
        >
          🔐
        </Box>

        {/* Title */}
        <Typography
          sx={{
            ...Style.heading(isArabic),
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "white",
            mb: 1,
          }}
        >
          {t("verify_account_modal.verify_account")}
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            ...Style.subHeading(isArabic),
            fontSize: "0.95rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 400,
            mb: 1.5,
          }}
        >
          {t("verify_account_modal.enter_otp")}
        </Typography>

        {/* Phone Number */}
        <Typography
          sx={{
            ...CustomStyle.number(isArabic),
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#FFBA83",
            background: "rgba(255, 186, 131, 0.1)",
            borderRadius: 2,
            py: 1,
            px: 2,
            display: "inline-block",
            mb: 3,
          }}
        >
          +{data?.mobile}
        </Typography>

        {/* OTP Input Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <OtpInput
            value={code}
            isInputNum
            onChange={setCode}
            numInputs={4}
            inputType={"number"}
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  ...CustomStyle.otpInput,
                  width: "60px",
                  height: "60px",
                  margin: "0 8px",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: "2px solid rgba(255, 186, 131, 0.3)",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FFBA83";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 186, 131, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 186, 131, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              />
            )}
          />
        </Box>

        {/* Resend Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            sx={{
              ...CustomStyle.getCode(isArabic),
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.6)",
              mb: 1,
            }}
          >
            {t("verify_account_modal.not_get_code")}
          </Typography>

          {(timePeriod?.seconds > 0 || timePeriod?.minutes > 0) && (
            <Typography
              sx={{
                ...CustomStyle.getCode(isArabic),
                fontSize: "0.9rem",
                color: "rgba(255, 255, 255, 0.7)",
                mb: 1.5,
              }}
            >
              {t("verify_account_modal.send_again")} {timePeriod?.minutes}:
              {String(timePeriod?.seconds).padStart(2, "0")}
            </Typography>
          )}

          <Typography sx={{ ...CustomStyle.getCode(isArabic), fontSize: "0.9rem" }}>
            <span
              style={{
                ...CustomStyle.resend(isArabic),
                color:
                  !(timePeriod?.seconds === 0 && timePeriod?.minutes === 0)
                    ? "rgba(255, 255, 255, 0.4)"
                    : "#FFBA83",
                cursor:
                  !(timePeriod?.seconds === 0 && timePeriod?.minutes === 0)
                    ? "not-allowed"
                    : "pointer",
                fontWeight: 600,
                textDecoration:
                  !(timePeriod?.seconds === 0 && timePeriod?.minutes === 0)
                    ? "none"
                    : "underline",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleResend("sms")}
              onMouseEnter={(e) => {
                if (timePeriod?.seconds === 0 && timePeriod?.minutes === 0) {
                  e.target.style.color = "#ff9f5a";
                }
              }}
              onMouseLeave={(e) => {
                if (timePeriod?.seconds === 0 && timePeriod?.minutes === 0) {
                  e.target.style.color = "#FFBA83";
                }
              }}
            >
              {t("verify_account_modal.resend_otp")}
            </span>
          </Typography>
        </Box>

     <CustomButton
  disable={loading || code.length < 4}
  onClick={handleSubmit}
  buttonText={t("verify_account_modal.verify")}
  color="secondary"
  sx={{
    width: "80%",
    mx: "auto", // shorthand for margin-left & margin-right auto
    mt: 3,
    display: "flex", // ensures width is respected and centers properly
    justifyContent: "center",
    background: "linear-gradient(135deg, #FFBA83 0%, #ff9f5a 100%)",
    borderRadius: 3,
    py: 1.5,
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "0 4px 15px rgba(255, 186, 131, 0.4)",
    "&:disabled": {
      background: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.5)",
      boxShadow: "none",
    },
  }}
  loading={loading}
/>

      </Box>
    </ModalWrapper>

    <Profile
      open={openCompleteProfileModal}
      setOpen={setCompleteProfileModal}
      data={data}
    />
  </Box>
);

};

export default VerifyAccountModal;
