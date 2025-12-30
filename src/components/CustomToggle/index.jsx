import { Box } from "@mui/material";
import React, { Component, useState } from "react";
import MultiSwitch from "react-multi-switch-toggle";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUserData } from "../../store/slice/user";

const CustomToggle = ({select, setSelect}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const changeUserData = (no) => {
    dispatch(updateUserData({ isEmployee: no }));
  };
  const onToggle = async(no) => {
    setSelect(no);
    await changeUserData(!!no)
  };

  return (
    <Box sx={{ fontFamily: "Inter" }}>
      <MultiSwitch
        texts={["Customer", "Employee"]}
        selectedSwitch={select}
        bgColor={"rgb(255, 186, 131)"}
        onToggleCallback={onToggle}
        fontFamily={"Inter, sans-serif"}
        fontColor={"#000"}
        selectedSwitchColor={"#000"}
        selectedFontColor={"#fff"}
        eachSwitchWidth={135}
        height={"50px"}
        fontSize={"16px"}
      ></MultiSwitch>
    </Box>
  );
};

export default CustomToggle;
