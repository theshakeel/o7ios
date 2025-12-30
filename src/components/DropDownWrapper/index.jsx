import { Box, Menu } from "@mui/material";
import * as React from "react";
import { Style } from "./style";

const DropDown = ({ onClose, onClick, id, anchorEl, children }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={Style.anchorOrigin}
      id={id}
      keepMounted
      transformOrigin={Style.transformOrigin}
      open={!!anchorEl}
      onClick={onClick}
      onClose={onClose}
      sx={Style.menuDataContainer}
    >
      <Box sx={Style.menuDataWrapper}>{children}</Box>
    </Menu>
  );
};

export default DropDown;
