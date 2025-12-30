import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ImLink } from "react-icons/im";
import { MdEmail } from "react-icons/md";
import {
  BsFacebook,
  BsTwitter,
  BsTelegram,
  BsLinkedin,
  BsWhatsapp,
} from "react-icons/bs";
import { styles } from "./style";
import { Box } from "@mui/material";
import toast from "react-hot-toast";
import { selectUser } from "../../store/slice/user";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ShareEvent = ({ open, handleClose, userLink, anchorEl }) => {
  const { language } = useSelector(selectUser);
  const { t } = useTranslation();
  const textCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Event Successfully Copied!");
  };
  const isArabic = language === "ar";
  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <MenuItem
        onClick={() => {
          textCopy(userLink, "Event link copied!");
          handleClose();
        }}
      >
        <Box sx={styles.shareParent(isArabic)}>
          <ImLink color="#828282" size="23px" />
          <Box sx={styles.shareText(isArabic)}>{t('share_event.copy_link')}</Box>
        </Box>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        <FacebookShareButton url={userLink}>
          <Box sx={styles.shareParent(isArabic)}>
            <BsFacebook color="#0571e6" size="25px" />
            <Box sx={styles.shareText(isArabic)}>{t('share_event.with_facebook')}</Box>
          </Box>
        </FacebookShareButton>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        <TwitterShareButton url={userLink}>
          <Box sx={styles.shareParent(isArabic)}>
            <BsTwitter color="#00b6f1" size="25px" />
            <Box sx={styles.shareText(isArabic)}>{t('share_event.with_twitter')}</Box>
          </Box>
        </TwitterShareButton>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        <EmailShareButton url={userLink}>
          <Box sx={styles.shareParent(isArabic)}>
            <MdEmail color="#0677bb" size="25px" />
            <Box sx={styles.shareText(isArabic)}>{t('share_event.with_email')}</Box>
          </Box>
        </EmailShareButton>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        <TelegramShareButton url={userLink}>
          <Box sx={styles.shareParent(isArabic)}>
            <BsTelegram color="#2b9fda" size="25px" />
            <Box sx={styles.shareText(isArabic)}>{t('share_event.with_telegram')}</Box>
          </Box>
        </TelegramShareButton>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        <LinkedinShareButton url={userLink}>
          <Box sx={styles.shareParent(isArabic)}>
            <BsLinkedin color="#0077b5" size="25px" />
            <Box sx={styles.shareText(isArabic)}>{t('share_event.with_linkedin')}</Box>
          </Box>
        </LinkedinShareButton>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        <WhatsappShareButton url={userLink}>
          <Box sx={styles.shareParent(isArabic)}>
            <BsWhatsapp color="#2cd348" size="25px" />
            <Box sx={styles.shareText(isArabic)}>{t('share_event.with_whatsapp')}</Box>
          </Box>
        </WhatsappShareButton>
      </MenuItem>
    </Menu>
  );
};

export default ShareEvent;
