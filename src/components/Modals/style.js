import { COLORS } from "../../theme";

export const Style = {
  heading: (isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontWeight: 700,
    fontSize: "20px",
  }),
  subHeading: (isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontWeight: 400,
    fontSize: "16px",
    color: COLORS.grey,
    width: "100%",
    maxWidth: "315px",
  }),
  button: {
    // width: "100%",
    mt: "20px",
    height: "45px",
    position: { xs: "absolute", sm: "static" },
    width: { xs: "calc(100% - 40px)", sm: "calc(100% - 3px)" },
    bottom: "20px",
    left: "20px",
  },
};
