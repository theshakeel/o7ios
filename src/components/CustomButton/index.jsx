import React from "react";
import Button from "@mui/material/Button";
import { Style } from "./style";
import { CircularProgress, Typography } from "@mui/material";
import { COLORS } from "../../theme";
import { selectUser } from "../../store/slice/user";
import { useSelector } from "react-redux";

const CustomButton = (props) => {
  const { language } = useSelector(selectUser);
  const {
    buttonText,
    color,
    sx = {},
    typSx,
    icon,
    onClick = () => {},
    disable,
    loading,
    type,
  } = props;
  const isArabic = language === "ar";
  return (
    <Button
      disabled={disable}
      onClick={onClick}
      variant="contained"
      color={color}
      type={type}
      sx={{
        ...Style.button(isArabic),
        ...sx,
        backgroundColor: disable && "gainsboro !important",
        color: disable && `${COLORS.black} !important`,
      }}
    >
      {!loading ? (
        !icon ? (
          buttonText
        ) : (
          <>
            {icon}
            <Typography sx={typSx}>{buttonText}</Typography>
          </>
        )
      ) : (
        <CircularProgress size={30} />
      )}
    </Button>
  );
};

export default CustomButton;
