import { COLORS } from "../../theme";

export const Style = {
  menuDataContainer: {
    top: "64px",
    "& .MuiPaper-root": {
      top: "64px",
      borderRadius: "20px",
      background: "#20353A",
      color: COLORS.white,
    },
    "& .MuiList-root": {
      padding: 0,
    },
  },
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  menuDataWrapper: {
    py: "22px",
    px: "30px",
    width: "200px",
  },
};
