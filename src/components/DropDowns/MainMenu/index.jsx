import React from "react";
import { CustomDivider } from "../..";
import { Style } from "./style";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../services/profile";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../../store/slice/user";
import { Box, MenuItem, IconButton, Drawer, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { X as CloseIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const MainMenu = ({ anchorEl, id, onClick, onClose, setOpenProfile }) => {
  const { language } = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      await logoutUser(user.token);
      dispatch(logout());
      toast.success("Sign Out Successfully");
      onClose(); // close drawer after logout
    } catch (err) {
      return err;
    }
  };

  const isArabic = language === "ar";

  return (
    <Drawer
      anchor="right"
      open={!!anchorEl}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "80%",
          maxWidth: 320,
          bgcolor: "#121212", // match app bg
          color: "#fff",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      {/* Slide-in animation */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header with close button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 2,
            bgcolor: "#1E1E1E",
          }}
        >
          <Box>
            <Typography sx={Style.username(isArabic)}>{user?.name}</Typography>
            {!!user?.mobile && (
              <Typography sx={Style.phoneNumber(isArabic)}>
                +{user?.mobile}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon size={22} />
          </IconButton>
        </Box>


        {/* Menu items */}
        <Box sx={Style.dropdownItemsContainer}>
          <MenuItem
            sx={Style.dropdownItems(isArabic)}
            onClick={() => {
              setOpenProfile(true);
              onClose();
            }}
          >
            {t("drawer.my_profile")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/my-tickets");
              onClose();
            }}
            sx={Style.dropdownItems(isArabic)}
          >
            {t("drawer.my_tickets")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/my-favorites");
              onClose();
            }}
            sx={Style.dropdownItems(isArabic)}
          >
            {t("drawer.my_favorites")}
          </MenuItem>
        </Box>

        <CustomDivider />

        <MenuItem sx={{...Style.dropdownItems(isArabic), padding:"20px"}} onClick={handleLogout}>
          {t("drawer.sign_out")}
        </MenuItem>
      </motion.div>
    </Drawer>
  );
};

export default MainMenu;
