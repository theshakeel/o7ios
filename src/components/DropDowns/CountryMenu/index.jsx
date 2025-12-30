import { Box, MenuItem } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DropDownWrapper } from "../..";
import { getCountryCategoryEvents } from "../../../services/data/events";
import { getAllCountries } from "../../../services/data/countries";
import { selectCountries, getCountries } from "../../../store/slice/countries";
import { getEvents, selectEventsData } from "../../../store/slice/events"; // ✅ keep this
import { updateLoader } from "../../../store/slice/loading";
import { selectUser, updateUserData } from "../../../store/slice/user";
import { Style } from "./style";

const CountryMenu = ({ anchorEl, id, onClick, onClose, isProfile }) => {
  const dispatch = useDispatch();
  // const countries = useSelector(selectCountries);
  const countriesState = useSelector(selectCountries);
  const countries = countriesState.data || [];
  const { language, category } = useSelector(selectUser);
  const { searchKey } = useSelector(selectEventsData);

  // ✅ New: Load countries if not already in store
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getAllCountries();
        dispatch(getCountries(res.data)); // ✅ set countries in redux
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    };

    if (!countries || countries.length === 0) {
      fetchCountries();
    }
  }, [dispatch, countries]);

  const handleSeletCountry = async (country) => {
    if (!isProfile) {
      localStorage.setItem("countryId", country?.id);
      dispatch(updateUserData({ countryId: country?.id }));
      try {
        dispatch(updateLoader({ loader: true }));
        let res = await getCountryCategoryEvents({
          page: 1,
          number: 12,
          country: country?.id,
          category: category.id || 0,
          searchKey,
        });
        dispatch(getEvents(res?.data?.data));
        dispatch(updateLoader({ loader: false }));
      } catch (err) {
        console.log("err:", err);
      }
    } else {
      dispatch(updateUserData({ country_id: country?.id }));
    }
  };

  return (
    <DropDownWrapper
      anchorEl={anchorEl}
      id={id}
      keepMounted
      open={!!anchorEl}
      onClick={onClick}
      onClose={onClose}
    >
      {countries.map((item, index) => (
        <MenuItem
          sx={Style.dropdownItems(language === "ar")}
          onClick={() => handleSeletCountry(item)}
          key={index}
        >
          <Box component="img" src={item?.full_flag} sx={Style.countryImage} />
          {item?.translation[language].name}
        </MenuItem>
      ))}
    </DropDownWrapper>
  );
};

export default CountryMenu;
