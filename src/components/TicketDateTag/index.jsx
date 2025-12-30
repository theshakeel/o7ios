import React from "react";
import { Box, Typography } from "@mui/material";
import { Style } from "./style";

const TicketDateTag = ({ date, month, sx = {}, dateSx = {}, monthSx = {} }) => {
  const dateSxNew = {...dateSx, fontSize:"15px"}
  const monthSxNew = {...monthSx, fontSize:"15px"}
  return (
    <Box
      sx={{
        ...Style.main,
        ...sx,
      }}
    >
      <Typography sx={dateSxNew}>{date}</Typography>
      <Typography sx={monthSxNew}>{month}</Typography>
    </Box>
  );
};

export default TicketDateTag;
