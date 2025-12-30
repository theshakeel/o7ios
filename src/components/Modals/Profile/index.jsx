import {
  Box,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdOutlineTextsms } from "react-icons/md";

import { updateUserData } from "../../../store/slice/user";
import CustomButton from "../../CustomButton";
import ModalWrapper from "../../ModalWrapper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CustomStyle } from "./style";
import { selectUser } from "../../../store/slice/user";
import { CountryMenu } from "../../";
import { selectCountries } from "../../../store/slice/countries";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import dayjs from "dayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { updateUserProfile } from "../../../services/profile";
import "./style.css";
import { loginStepThree } from "../../../services/auth";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
const Profile = ({ open, setOpen, data }) => {
  const countries = useSelector(selectCountries);
  // console.log("countries", countries);
  const countryMenuId = "primary-search-country-menu";
  const [countryMenuAnchorEl, setCountryMenuAnchorEl] = React.useState(null);
  const user = useSelector(selectUser);
  const language = user?.language;
  const country = countries?.data?.find((item) => item.id === (user?.country_id || 1));
  const { t } = useTranslation();

  const handleCountryMenuClose = () => {
    setCountryMenuAnchorEl(null);
  };
  const handleCountryMenuOpen = (event) => {
    setCountryMenuAnchorEl(event.currentTarget);
  };
  const [mobile, setMobile] = useState("");

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const countryArray = [
    {
      icon: (
        <Box
          src={country?.full_flag}
          component={"img"}
          style={{ ...CustomStyle.customIcons }}
        />
      ),
      text: country?.translation[language]?.name,
      func: handleCountryMenuOpen,
    },
  ];
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: user?.name || "",
      birthDate: user?.date_birth || dayjs(Date.now()).format("YYYY-MM-DD"),
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t("profile_modal.required")),
    }),
    onSubmit: async (values) => {
      console.log(data, values);
      if (data) {
        setLoading(true);
        await loginStepThree({
          ...values,
          email: data.email,
          mobile,
          country_id: user.country_id,
          date_birth: values.birthDate,
        })
          .then((res) => {
            setLoading(false);
            setOpen(false);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("countryId", user?.country_id);
            dispatch(
              updateUserData({
                ...res.data.user,
                token: res.data.token,
                countryId: user.country_id,
              })
            );
            toast.success("Registered!");

            formik.resetForm();
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err?.response?.data?.data?.message);
          });
      } else {
        setLoading(true);
        await updateUserProfile(
          {
            name: values.name,
            mobile: values.mobile,
            country_id: user.country_id,
            date_birth: values.birthDate,
          },
          user?.token
        )
          .then((res) => {
            setLoading(false);
            setOpen(false);
            dispatch(
              updateUserData({
                ...user,
                ...res.data.data,
                country_id: user.country_id,
              })
            );
            toast.success(res?.data?.message);

            setOpen(false);
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err?.response?.data?.data?.message);
          });
      }
    },
  });
  const isArabic = language === "ar";
  return (
    <ModalWrapper open={open} setOpen={setOpen} crossIcon>
      <Typography
        sx={{ display: "flex", textAlign: "center", mt: { xs: "20px", sm: 0 } }}
      >
        <Typography
          component={"span"}
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            left: "10px",
            display: { xs: "flex", sm: "none" },
          }}
        >
          <ArrowBackIcon />
        </Typography>
        <Typography component={"span"} sx={CustomStyle.heading(isArabic)}>
          {data
            ? t("profile_modal.complete_profile")
            : t("profile_modal.edit_profile")}
        </Typography>
      </Typography>
      <Typography sx={CustomStyle.subHeading(isArabic)}>
        {data
          ? t("profile_modal.complete_heading")
          : t("profile_modal.update_heading")}
      </Typography>
      {/* form start */}
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={CustomStyle.container}
      >
        <Typography sx={CustomStyle.label(isArabic)}>
          {t("profile_modal.full_name")}
        </Typography>
        <OutlinedInput
          sx={CustomStyle.input}
          placeholder="Enter Full Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          id="name"
        />
        {formik.errors.name && formik.touched.name && (
          <Typography sx={{ color: "red" }}>{formik.errors.name}</Typography>
        )}
        
          <PhoneInput
              country={"kw"}
              enableSearch
              disableSearchIcon
              autocompleteSearch
              enableClickOutside
              defaultErrorMessage="Invalid Number"
              inputStyle={CustomStyle.inputm}
              buttonStyle={CustomStyle.buttons}
              dropdownStyle={CustomStyle.dropDown}
              containerStyle={CustomStyle.containerStyle}
              inputProps={CustomStyle.inputProps}
              searchStyle={CustomStyle.searchStyle}
              placeholder="Mobile Number"
              value={formik.values.mobile}
              countryCodeEditable={false}
              onChange={(no, data) => {
                setMobile(no);
              }}
              name="mobile"
              
            /> 
             {/* <Box sx={CustomStyle.verificationOtpContiner}> */}
              {/* <MdOutlineTextsms  /> */}
              {/* <Typography sx={CustomStyle.verificationOtpText(isArabic)}>
                {t("mobile_no_modal.verification_text")}{" "}
              </Typography> */}
            {/* </Box> */}
        <Typography sx={CustomStyle.label(isArabic)}>
          {t("profile_modal.country_optional")}
        </Typography>
        <List sx={{ ...CustomStyle.lists, ...CustomStyle.input }}>
          {countryArray.map((item, index) => (
            <ListItem
              sx={CustomStyle.listItemsContainer}
              key={index}
              disablePadding
              onClick={item.func}
            >
              <ListItemText sx={CustomStyle.listItems}>
                <Typography component={"span"} sx={CustomStyle.listItems}>
                  {item.icon}
                  <Typography component={"span"} sx={CustomStyle.drawerOptions}>
                    {item.text}
                  </Typography>
                </Typography>
              </ListItemText>
              <KeyboardArrowDownIcon />
            </ListItem>
          ))}
        </List>
        <CountryMenu
          id={countryMenuId}
          onClick={handleCountryMenuClose}
          onClose={handleCountryMenuClose}
          anchorEl={countryMenuAnchorEl}
          isProfile={true}
        />
        <Typography sx={CustomStyle.label(isArabic)}>
          {t("profile_modal.birth_optional")}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            defaultValue={dayjs(formik?.values?.birthDate)}
            onChange={(e) =>
              formik.setFieldValue(
                "birthDate",
                dayjs(e?.$d).format("YYYY-MM-DD")
              )
            }
            value={dayjs(formik?.values?.birthDate)}
            format="YYYY-MM-DD"
            sx={{
              width: "100%",
              background: "#1E2324",
              color: "#fff",
            }}
          />
        </LocalizationProvider>

        {/* form end */}
        <CustomButton
          buttonText={t("profile_modal.confirm")}
          color="secondary"
          sx={CustomStyle.button(isArabic)}
          loading={loading}
          type="submit"
        />
      </Box>
    </ModalWrapper>
  );
};

export default Profile;
