import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "../../lib/debounce";
import { getCountryCategoryEvents } from "../../services/data/events";
import { selectCountries } from "../../store/slice/countries";
import { getEvents } from "../../store/slice/events";
import { updateLoader } from "../../store/slice/loading";
import { selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import CustomButton from "../CustomButton";
import CustomDrawer from "../CustomDrawer";
import CountryMenu from "../DropDowns/CountryMenu";
import LanguageMenu from "../DropDowns/LanguageMenu";
import MainMenu from "../DropDowns/MainMenu";
import Profile from "../Modals/Profile";
import { Style } from "./style";
import { changeLanguage, i18n } from "../index";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

const Navbar = ({ onRequireAuth }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const countries = useSelector(selectCountries);
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [countryMenuAnchorEl, setCountryMenuAnchorEl] = useState(null);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const isHome = useLocation()?.pathname == "/";
  const { t } = useTranslation();

  let { language, countryId, category } = user || {};
  const isEmployee = localStorage.getItem("isEmployee");
  const [openAuth, setOpenAuth] = useState(false);

  const requireAuths = () => {
    onRequireAuth()
  };
  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
    let tempLanguage = localStorage.getItem("language");
    changeLanguage(tempLanguage);
  };
  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchorEl(event.currentTarget);
  };

  const openLink = () => {
    let url = "https://admin.o7events.com/vendor";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCountryMenuClose = () => {
    setCountryMenuAnchorEl(null);
  };
  const handleCountryMenuOpen = (event) => {
    setCountryMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const requireAuth = () => {
    setOpenDrawer(false); // close drawer if open
    setOpen(true);        // open auth modal
    onRequireAuth()
  };
  const countryMenuId = "primary-search-country-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";
  const langugeMenuId = "primary-language-menu";

  const countryFlag = countries?.data?.find(
    (item) => item?.id === user?.countryId
  )?.full_flag;

  const handleSearchResult = async (text) => {
    const res = await getCountryCategoryEvents({
      searchKey: text,
      page: 1,
      number: 12,
      country: countryId,
      category: category?.id,
    });
    dispatch(getEvents({ ...res?.data?.data, searchKey: text }));
    dispatch(updateLoader({ loader: false }));
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
    dispatch(updateLoader({ loader: true }));
    debounce(() => handleSearchResult(e.target.value), 1500);
  };

  const isArabic = language === "ar";

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
      textAlign: isArabic ? "end" : "start",
      padding: theme.spacing(1, 5.5, 1, 5.5),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  return (
    <Box sx={Style.main(isHome, isEmployee)}>

      <AppBar
        position="static"
        sx={{
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          borderRadius: { xs: 0, sm: 2 },
          mx: { xs: 0, sm: 2 },
          mt: { xs: 0, sm: 2 },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: isArabic ? "row-reverse" : "row",
            justifyContent: "space-between",
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Left section - Menu & Logo */}
          <Box
            display="flex"
            flexDirection={isArabic ? "row-reverse" : "row"}
            alignItems="center"
            sx={{ flex: 1 }}
          >

            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpenDrawer(true)}
              sx={{
                mr: { xs: 1, md: 2 },
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                padding: "3px",
                "&:hover": {
                  background: "rgba(255, 186, 131, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <HiMenuAlt2 style={{ ...Style.menuIcon, fontSize: "20px" }} />
            </IconButton>

            <CustomDrawer
              setOpenProfile={setOpenProfile}
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              requireAuth={onRequireAuth}
            />

            <Box
              component={"div"}
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: "25vw", sm: "20vw" },
                  maxWidth: "120px",
                  ml: { xs: 1, sm: 2 },
                }}
                component={"img"}
                src={IMAGES.Logo}
                width={"100%"}
              />
            </Box>
          </Box>

          {/* Right section - Location & User options */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {/* Location */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 186, 131, 0.3)",
                },
              }}
            >
              <IoLocationSharp
                style={{ width: "20px", height: "20px", color: "#FFBA83" }}
              />
              <Typography
                sx={{
                  fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                {t("navbar.location")}
              </Typography>
              <Avatar alt="Country" src={countryFlag} sx={{ width: 24, height: 24 }} />
              <IconButton
                size="small"
                aria-label="show more"
                aria-controls={countryMenuId}
                onClick={handleCountryMenuOpen}
                aria-haspopup="true"
                color="inherit"
                sx={{ p: 0.5 }}
              >
                <FaChevronDown style={{ fontSize: "12px" }} />
              </IconButton>
            </Box>

            {/* Language */}
            <Box
              sx={{
                ...Style.langName(isArabic),
                background: "rgba(255, 186, 131, 0.2)",
                borderRadius: 2,
              }}
              onClick={handleLanguageMenuOpen}
              aria-controls={langugeMenuId}
            >
              {language}
            </Box>
            {/* Desktop Profile / Login */}
            {!user?.token ? (
              <IconButton
                onClick={requireAuth}
                sx={{
                  background: "rgba(255, 186, 131, 0.2)",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    background: "rgba(255, 186, 131, 0.3)",
                  },
                }}
              >
                <PersonIcon sx={{ fontSize: 34, color: "#FFBA83" }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    background: "rgba(255, 186, 131, 0.2)",
                  },
                }}
              >
                <PersonIcon sx={{ fontSize: 34, color: "#FFBA83" }} />
              </IconButton>
            )}

          </Box>

          {/* Mobile options - visible only on mobile */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Mobile Location */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                px: 1,
                py: 0.5,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <IoLocationSharp
                style={{ width: "18px", height: "18px", color: "#FFBA83" }}
              />
              <Avatar alt="Country" src={countryFlag} sx={{ width: 20, height: 20 }} />
              <IconButton
                size="small"
                aria-label="show more"
                aria-controls={countryMenuId}
                aria-haspopup="true"
                onClick={handleCountryMenuOpen}
                color="inherit"
                sx={{ p: 0.25 }}
              >
                <FaChevronDown style={{ fontSize: "10px" }} />
              </IconButton>
            </Box>

            {/* Mobile Profile/Login */}
            {/* Mobile Profile / Login */}
            {!user?.token ? (
              // ❌ Not logged in → show user icon
              <IconButton
                onClick={requireAuth}
                sx={{
                  background: "rgba(255, 186, 131, 0.2)",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    background: "rgba(255, 186, 131, 0.3)",
                  },
                }}
              >
                <PersonIcon sx={{ fontSize: 34, color: "#FFBA83" }} />
              </IconButton>
            ) : (
              // ✅ Logged in → open menu / drawer
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    background: "rgba(255, 186, 131, 0.2)",
                  },
                }}
              >
                <PersonIcon sx={{ fontSize: 34, color: "#FFBA83" }} />
              </IconButton>
            )}


          </Box>
        </Toolbar>
      </AppBar>

      {/* Menus */}
      <CountryMenu
        id={countryMenuId}
        onClick={handleCountryMenuClose}
        onClose={handleCountryMenuClose}
        anchorEl={countryMenuAnchorEl}
      />
      <MainMenu
        anchorEl={mobileMoreAnchorEl}
        id={mobileMenuId}
        onClick={handleMobileMenuClose}
        onClose={handleMobileMenuClose}
        setOpenProfile={setOpenProfile}
      />
      <LanguageMenu
        anchorEl={languageMenuAnchorEl}
        id={langugeMenuId}
        onClick={handleLanguageMenuClose}
        onClose={handleLanguageMenuClose}
      />
      <Profile open={openProfile} setOpen={setOpenProfile} />
    </Box>
  );
};

export default Navbar;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
