import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { scanQrCode } from "../../services/redeem";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import { CustomButton } from "../../components";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../../services/profile";
import toast from "react-hot-toast";
import { Style } from "../../components/TicketStatus/Style";
import { QrReader } from "react-qr-reader";
import { CustomStyle } from "./style";
// import mixpanel from "mixpanel-browser";

const RedeemTickets = () => {
  const user = useSelector(selectUser);
  const delay = 1000;
  const { token, language } = useSelector(selectUser);
  const { t } = useTranslation();

  const [result, setResult] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [wait, setWait] = useState(false);
  window.addEventListener("resize", () => setWidth(window.innerWidth));
  const dispatch = useDispatch();
  const handleScan = (result) => {
    if (result) {
      scanQrCode({ code: result }, token)
        .then((res) => {
          setResult(res?.data);
          setScanned(false);
          setWait(true);
          setTimeout(() => {
            setWait(false);
          }, 2000);
        })
        .catch((err) => {
          console.log("err: ", err);
          setWait(false);
          setScanned(false);
          setResult(false);
        });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser(token);
      dispatch(logout());
      toast.success("Sign Out Successfully");
    } catch (err) {
      return err;
    }
  };

  const isArabic = language === "ar";
  // useEffect(() => {
  //   mixpanel?.track("redeem-tickets", {
  //     email: user?.email,
  //     name: user?.name || "anonymous",
  //   });
  // }, []);

  return (
    <>
      <Box sx={CustomStyle.buttonBox}>
        <CustomButton
          sx={CustomStyle.button}
          onClick={handleLogout}
          buttonText={t("drawer.sign_out")}
          color={"secondary"}
        />
      </Box>
      <Box sx={CustomStyle.main}>
        {scanned ? (
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={"20px"}
          >
            <Typography
              p={"0 10px"}
              boxSizing={"border-box"}
              sx={Style.message(isArabic)}
            >
              <Typography
                component={"span"}
                sx={{
                  color:
                    !!error || result?.redeem
                      ? "rgba(255, 90, 90, 0.8)"
                      : "#fff",
                  fontSize: "20px",
                }}
              >
                Waiting ...
              </Typography>
            </Typography>
          </Box>
        ) : !wait ? (
          <QrReader
            delay={delay}
            constraints={{ facingMode: "environment" }}
            facingMode={"environment"}
            onResult={(result) => {
              if (!!result) {
                setError(false);
                setScanned(true);
                handleScan(result?.text);
              }
            }}
          />
        ) : (
         <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  gap="20px"
>
  <Box
    component="img"
    src={!!result && !result?.redeem ? IMAGES.success : IMAGES.failure}
    width={140}
    height={140}
  />

  {/* Redeem Status */}
  <Typography p="0 10px" boxSizing="border-box" sx={Style.message(isArabic)}>
    <Typography
      component="span"
      sx={{
        color:
          !!error || result?.redeem ? "rgba(255, 90, 90, 0.8)" : "#fff",
        fontSize: "20px",
        fontWeight: 600,
      }}
    >
      {!!result
        ? result?.redeem
          ? "Already redeemed"
          : "Redeem successful"
        : !!error
        ? `${error}`
        : "Redeem Failed"}
    </Typography>
  </Typography>

  {/* ✅ Event / Ticket Info */}
  {!!result?.item && (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="8px"
      sx={{
        mt: 1,
        background: "rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "14px 18px",
        minWidth: "240px",
        maxWidth: "90%",
        textAlign: "center",
      }}
    >
      {/* Event image */}
      <Box
        component="img"
        src={result.item.item.ticket.event.full_image}
        alt="Event"
        sx={{
          width: "100%",
          maxWidth: "320px",
          borderRadius: "10px",
          objectFit: "cover",
        }}
      />

    <Typography
  sx={{
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    mt: 1,
  }}
>
  {result?.item?.item?.ticket?.event?.translation?.en?.name || "N/A"}
</Typography>

<Typography sx={{ color: "#bbb", fontSize: "14px" }}>
  🎟️ {result?.item?.item?.ticket?.translation?.en?.name || "N/A"} (
  {result?.item?.item?.ticket?.event?.ticket_type || "N/A"})
</Typography>

<Typography sx={{ color: "#bbb", fontSize: "14px" }}>
  📅 {result?.item?.item?.ticket?.event?.event_date || "N/A"} — 🕐{" "}
  {result?.item?.item?.ticket?.event?.event_time || "N/A"}
</Typography>

<Typography sx={{ color: "#bbb", fontSize: "14px" }}>
  👤 {result?.item?.order?.customer?.name || "N/A"}
</Typography>

    </Box>
  )}
</Box>

        )}{" "}
      </Box>
    </>
  );
};

export default RedeemTickets;