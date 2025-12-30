import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { convertDate } from "../../../lib/helper";
import { selectUser } from "../../../store/slice/user";
import ModalWrapper from "../../ModalWrapper";
import { useTranslation } from "react-i18next";

const TicketQR = ({ open, setOpen, data }) => {
  const { t } = useTranslation();
  const { day, month, year, time } = convertDates(data?.dateTime);
  const { language, email, mobile, name } = useSelector(selectUser);
  const isArabic = language === "ar";
  const handleBack = () => {
    console.log("going back")
    setOpen(false);
  }
  function convertDates(dateTime, t) {
  if (!dateTime) return { day: "", month: "", year: "", time: "" };

  // Parse safely: convert "YYYY-MM-DD HH:mm:ss" → valid Date object
  const date = new Date(dateTime.replace(" ", "T")); // ISO-compatible

  if (isNaN(date.getTime())) {
    console.warn("Invalid date passed to convertDate:", dateTime);
    return { day: "", month: "", year: "", time: "" };
  }

  // Day name (e.g. Thursday)
  const weekday = date.toLocaleDateString(t?.language || "en", { weekday: "long" });

  // Month name (e.g. November)
  const month = date.toLocaleDateString(t?.language || "en", { month: "long" });

  // Day number, year, and formatted time
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString(t?.language || "en", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { weekday, day, month, year, time };
}

  // ✅ keep your original logic intact
  const qrSrc =
    data?.qr_code?.full_qr_code || data?.qr?.qr_code?.full_qr_code;

  return (
    <ModalWrapper
      open={open}
      crossIcon={false}
      onClose={() => setOpen(false)}
    sx={{
    display: { xs: "flex", sm: "none" },
    flexDirection: "column",
    alignItems: "center",
    // use padding & gap instead of space-between
    py: 2,
    px: 2,
    gap: 2,
    maxHeight: "90%",      // don't stretch full screen
    boxSizing: "border-box",
    backgroundColor: "#fff",
    overflowY: "auto",     // allow scroll if content exceeds
  }}
    >
      {/* Header with Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          mb: 1,
          mt: 3,
        }}
      >
        <ArrowBackIcon
           onClick={() => setOpen(false)}
          style={{ cursor: "pointer" }}
        />
        <Typography
          variant="h6"
          sx={{
            mx: "auto",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {t("Ticket Details")}
        </Typography>
      </Box>

      {/* QR Code - main focus */}
      <Box
  sx={{
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxHeight: "65%",
  }}
>
  {qrSrc ? (
    <Box
      sx={{
        width:"85%",
        borderRadius: 8,
        border: "2px solid #555", // 3D border
        backgroundColor: "#00000", // QR bg
        boxShadow: `
          2px 2px 5px rgba(0,0,0,0.6),
          -2px -2px 5px rgba(255,255,255,0.3)
        `,
        padding: 1, // Add space between border and QR
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.1s",
      }}
    >
      <Box
        component="img"
        src={qrSrc}
        alt="Ticket QR"
        sx={{
          width: "100%",
          maxWidth: "85%",
          maxHeight: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  ) : (
    <Typography>No QR Found</Typography>
  )}
</Box>


      {/* Event & User Info Section */}
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          borderTop: "1px dashed #ccc",
          pb: 6,
        }}
      >
     

        <Typography variant="body2">
          {data?.eventName}
        </Typography>
        <Typography variant="body2">
          {day} {month} {year} : {time}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {data?.address}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {/* <Typography variant="body2">{Object.keys(data)}</Typography> */}
          <Typography variant="body2">{name}</Typography>
          <Typography variant="body2">{email}</Typography>
          <Typography variant="body2">+{mobile}</Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ mt: 1, display: "block", opacity: 0.6 }}
        >
          Ticket By O7 Agency
        </Typography>
      </Box>
    </ModalWrapper>
  );
};

export default TicketQR;
