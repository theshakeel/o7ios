import { COLORS } from "../../theme";

export const CustomStyle = {
  data: (isArabic) => ({
    color: COLORS.white,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    margin: { xs: "35px 0 15px", sm: "25px 0 15px !important" },
  }),
  buttonBox: {
    maxWidth: "1260px",
    width: "100%",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    p: 2,
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
  },
  iconBox: {
    fontSize: "40px",
    cursor: "pointer",
    padding: '4px 8px 0',
    borderRadius: '24px',
    "&:hover": {
      backgroundColor: "rgba(50, 50, 50, 0.7)",
    },
  },
  button: {
    padding: "6px 16px",
    height: "50px",
    width: "100px",
    borderRadius: "25px",
    fontFamily: "Inter",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "calc(100vh - 30px)",
    "& section": {
      margin: "0 10px",
      height: 340,
      width: "calc(100% - 20px)",
      maxWidth: 340,
      minWidth: 260,
      boxSizing: "border-box",
    },
  },
};
