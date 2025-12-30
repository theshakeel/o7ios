import { Box, Typography } from "@mui/material";
import React from "react";
import { IMAGES } from "../../theme";
import { Style } from "./Style";
import { CustomButton } from "..";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../store/slice/user";
import { useSelector } from "react-redux";

const TicketStatus = ({ success }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useSelector(selectUser);
  const isArabic = language === "ar"
  return (
    <Box sx={Style.main}>
      <Box
        component={"img"}
        src={success ? IMAGES.success : IMAGES.failure}
        width={140}
        height={140}
      />
      <Typography sx={Style.statusText(isArabic)}>
        {success ? t("ticket_status_page.thank_you") : t("ticket_status_page.failure")}
      </Typography>
      <Typography sx={Style.message(isArabic)}>
        {success
          ? t("ticket_status_page.payment_positive_status")
          : t("ticket_status_page.payment_negative_status")}
      </Typography>
      <CustomButton
        onClick={() => navigate(success ? "/my-tickets" : -2)}
        buttonText={success ? t("ticket_status_page.button_text_positive") : t("ticket_status_page.try_again")}
        color="secondary"
        sx={Style.actionButton(isArabic)}
      />
      <CustomButton
        onClick={() => navigate("/")}
        buttonText={t("ticket_status_page.home")}
        color="black"
        sx={Style.backButton(isArabic)}
      />
    </Box>
  );
};

export default TicketStatus;
