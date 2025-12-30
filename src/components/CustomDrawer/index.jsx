import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import * as React from "react";
import { openAuthModal, closeAuthModal } from "../../store/slice/ui";
import { Browser } from "@capacitor/browser";
import { PiHouseBold, PiTicket } from "react-icons/pi";
import PersonIcon from "@mui/icons-material/Person";
import { BsPerson } from "react-icons/bs";
import CustomButton from "../CustomButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CountryMenu, MobileNumberModal, changeLanguage } from "..";
import { selectCountries } from "../../store/slice/countries";
import { logout, selectUser } from "../../store/slice/user";
import { Style } from "./style";
import { useNavigate } from "react-router";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RedeemIcon from "@mui/icons-material/Redeem";
import { selectPages } from "../../store/slice/pages";
import LanguageMenu from "../DropDowns/LanguageMenu";
import { MdLanguage } from "react-icons/md";
import { logoutUser } from "../../services/profile";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getAllPages } from "../../services/data/pages";
import { getPages } from "../../store/slice/pages";

const CustomDrawer = ({ openDrawer, setOpenDrawer, setOpenProfile, requireAuth }) => {
  const dispatch = useDispatch();
  const countries = useSelector(selectCountries);
  const user = useSelector(selectUser);
  const pages = useSelector(selectPages);
  const language = user?.language;
  // const [open, setOpen] = useState(false);
  const [countryMenuAnchorEl, setCountryMenuAnchorEl] = React.useState(null);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const country = countries?.data?.find((item) => item.id === user.countryId);
  
  const isEmployee = localStorage.getItem("isEmployee");
  const authModalOpen = useSelector((state) => state.ui.authModalOpen);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleCountryMenuOpen = (event) => {
    setCountryMenuAnchorEl(event.currentTarget);
  };
  const handleCountryMenuClose = () => {
    setCountryMenuAnchorEl(null);
  };
  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchorEl(event.currentTarget);
  };
  const handleLanguageMenuClose = () => {
    let tempLanguage = localStorage.getItem("language");
    changeLanguage(tempLanguage);
    setLanguageMenuAnchorEl(null);
  };
  const customFirstArray = [
    {
      icon: <PiHouseBold style={Style.customIcons} />,
      text: t("drawer.home"),
      onclickFunc: () => navigate("/"),
    },
    {
      icon: <PiHouseBold style={Style.customIcons} />,
      text: t("drawer.createEvent"),
      onclickFunc: async () => { await Browser.open({ url: "https://admin.o7events.com/vendor" }) ;}
    },
    !!user.name && {
      icon: <BsPerson style={Style.customIcons} />,
      text: t("drawer.my_profile"),
      onclickFunc: () => setOpenProfile(true),
    },
    !!user.name && {
      icon: <PiTicket style={Style.customIcons} />,
      text: t("drawer.my_tickets"),
      onclickFunc: () => {
        if (!user?.token) {
          requireAuth();
          return;
        }
        navigate("/my-tickets");
      },
    }
,
    !!user.name && {
      icon: <FavoriteBorderIcon style={Style.customIcons} />,
      text: t("drawer.my_favorites"),
      onclickFunc: () => navigate("/my-favorites"),
    },
    isEmployee && {
      icon: <RedeemIcon style={Style.customIcons} />,
      text: "Redeem Tickets",
      onclickFunc: () => navigate("/redeem-tickets"),
    },
  ];
  const handleLogout = async () => {
    try {
      await logoutUser(user.token);
      dispatch(logout());
      toast.success("Sign Out Successfully");
    } catch (err) {
      return err;
    }
  };

  const customSecondArray = [
    {
      icon: <MdLanguage style={Style.customIcons} />,
      text: t("drawer.change_language"),
      func: handleLanguageMenuOpen,
    },
    {
      icon: (
        <Box
          src={country?.full_flag}
          component={"img"}
          style={Style.customIcons}
        />
      ),
      text: t("drawer.location"),
      func: handleCountryMenuOpen,
    },
  ];

  const EXTERNAL_SLUGS = ["page-1", "howto", "page-4", "page-4-1", "page-3", "terms", "/"];

  const customThirdArray = pages?.map((item) => {
    const slug = item?.slug;

    const isExternal = EXTERNAL_SLUGS.includes(slug);

    return {
      text: item?.translation?.[language]?.title,
      func: () => {
        // if (isExternal) {
          // Redirect to external website
          // navigate(`/${slug.replace(/^\//, "")}`);
        // } else {
          // Internal navigation
          navigate(`/${slug}`);
        // }
      },
    };
  });

  console.log("pges in third array", pages, customThirdArray)

  const handleClose = () => setOpenDrawer(false);
  const handleSignModal = () => {
          requireAuth();
    
  };
 const fetchPages = async () => {
    try {
      const pagesResponse = await getAllPages();
      // dispatch to redux, this will trigger your reducer and console.log
      dispatch(getPages(pagesResponse.data.data));
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);
  const countryMenuId = "primary-search-country-menu";
  const langugeMenuId = "primary-language-menu";
  const isArabic = language === "ar";
  return (
    <Drawer
      anchor={isArabic ? "right" : "left"}
      open={openDrawer}
      onClose={handleClose}
    >
      <Box
        sx={Style.main(isArabic)}
        // onClick={handleClose}
      >
        <PersonIcon style={Style.person} />
        {!!user.name ? (
          <Box mb={2}>
            <Typography sx={Style.userName(isArabic)}>{user?.name}</Typography>
            {!!user?.mobile && (
              <Typography sx={Style.userPhone(isArabic)}>
                +{user?.mobile}
              </Typography>
            )}
          </Box>
        ) : (
          <Box>
            <Typography sx={Style.userName(isArabic)}>
              {t("navbar.hello_guest")}
            </Typography>
            <Typography sx={Style.userPhone(isArabic)}>
              {t("navbar.welcome_message")}
            </Typography>
            <CustomButton
              buttonText={t("navbar.sign_in")}
              color={"secondary"}
              sx={Style.drawerButton(isArabic)}
              onClick={handleSignModal}
            />
            {/* <MobileNumberModal
              open={authModalOpen}
              setOpen={(value) => {
                if (!value) dispatch(closeAuthModal());
              }}
            /> */}
          </Box>
        )}
        <Divider sx={Style.divider} />
        <List sx={Style.lists} onClick={handleClose}>
          {customFirstArray.filter(Boolean).map((item, index) => (
            <ListItem
              onClick={item?.onclickFunc}
              sx={Style.listItems(isArabic)}
              key={index}
              disablePadding
            >
              {item.icon}
              <ListItemText
                sx={Style.drawerOptions(isArabic)}
                primary={item.text}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={Style.divider} />
        <List sx={{ ...Style.lists, width: "100%" }}>
          {customSecondArray.map((item, index) => (
            <ListItem
              sx={Style.listItemsContainer(isArabic)}
              key={index}
              disablePadding
              onClick={item.func}
            >
              <ListItemText sx={Style.listItems(isArabic)}>
                <Typography component={"span"} sx={Style.listItems(isArabic)}>
                  {item.icon}
                  <Typography
                    component={"span"}
                    sx={Style.drawerOptions(isArabic)}
                  >
                    {item.text}
                  </Typography>
                </Typography>
              </ListItemText>
              <KeyboardArrowDownIcon />
            </ListItem>
          ))}
        </List>
        <Divider sx={Style.divider} />
        <List sx={Style.lists} onClick={handleClose}>
          {customThirdArray.map((val, index) => (
            <ListItem
              sx={Style.listItems(isArabic)}
              key={index}
              onClick={val.func}
              disablePadding
            >
              <ListItemText
                sx={Style.drawerOptions(isArabic)}
                primary={val.text}
              />
            </ListItem>
          ))}
        </List>
        {!!user?.token && (
          <List sx={Style.lists} onClick={handleClose}>
            <ListItem
              sx={Style.listItems(isArabic)}
              onClick={handleLogout}
              disablePadding
            >
              <ListItemText
                sx={Style.drawerOptions(isArabic)}
                primary={t("drawer.sign_out")}
              />
            </ListItem>
          </List>
        )}
      </Box>
      <CountryMenu
        id={countryMenuId}
        onClick={handleCountryMenuClose}
        onClose={handleCountryMenuClose}
        anchorEl={countryMenuAnchorEl}
      />
      <LanguageMenu
        anchorEl={languageMenuAnchorEl}
        id={langugeMenuId}
        onClick={handleLanguageMenuClose}
        onClose={handleLanguageMenuClose}
      />
    </Drawer>
  );
};
export default CustomDrawer;
