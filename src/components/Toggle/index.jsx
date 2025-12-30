import { Box } from "@mui/material";
import * as React from "react";
import { Style } from "./style";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../store/slice/user";
import { useSelector } from "react-redux";

export default function Toggle({ isComming, setIsComming }) {
  const { t } = useTranslation();
  const { language } = useSelector(selectUser);
  return (
    <Box sx={Style.container(language === "ar")}>
      <Box
        sx={[Style.toggleItem, isComming && Style.toggleItemSelected]}
        onClick={() => setIsComming(true)}
      >
        {t("my_ticket_page.coming")}
      </Box>
      <Box
        sx={[Style.toggleItem, !isComming && Style.toggleItemSelected]}
        onClick={() => setIsComming(false)}
      >
        {t("my_ticket_page.expired")}
      </Box>
    </Box>
  );
}
