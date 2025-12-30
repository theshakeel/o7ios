import { MenuItem } from "@mui/material";
import React from "react";
import { DropDownWrapper } from "../..";
import { Style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUserData } from "../../../store/slice/user";

const LanguageMenu = ({ anchorEl, id, onClick, onClose }) => {
  const { language } = useSelector(selectUser);
  const dispatch = useDispatch();
  const languagesData = [
    { name: "English", id: "en" },
    { name: "Arabic", id: "ar" },
  ];
  const handleLanguageSelect = async (item) => {
    localStorage.setItem("language", item.id);
    dispatch(updateUserData({ language: item.id }));
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
      {languagesData.map((item, index) => {
        return (
          <MenuItem
            sx={Style.dropdownItems(language === 'ar')}
            onClick={() => handleLanguageSelect(item)}
            key={index}
          >
            {item.name}
          </MenuItem>
        );
      })}
    </DropDownWrapper>
  );
};

export default LanguageMenu;
