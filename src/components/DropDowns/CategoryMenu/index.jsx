import { MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DropDownWrapper } from "../..";
import { selectCategories } from "../../../store/slice/categories";
import { Style } from "./style";
import { selectUser } from "../../../store/slice/user";

const CategoryMenu = ({ anchorEl, id, onClick, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const { language } = useSelector(selectUser);

  const handleCategorySelect = async (category) => {};
  return (
    <DropDownWrapper
      anchorEl={anchorEl}
      id={id}
      keepMounted
      open={!!anchorEl}
      onClick={onClick}
      onClose={onClose}
    >
      {categories.map((item, index) => {
        return (
          <MenuItem
            sx={Style.dropdownItems}
            onClick={() => handleCategorySelect(item)}
            key={index}
          >
            {item?.translation[language].name}
          </MenuItem>
        );
      })}
    </DropDownWrapper>
  );
};

export default CategoryMenu;
