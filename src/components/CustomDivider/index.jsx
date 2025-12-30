import React from "react";
import Divider from "@mui/material/Divider";
import { Style } from "./style";

const CustomDivider = ({ sx }) => <Divider sx={{ ...Style.divider, ...sx }} />;

export default CustomDivider;
