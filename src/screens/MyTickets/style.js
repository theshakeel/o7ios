import { COLORS } from "../../theme";

export const Style = {
  main: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    flexGrow: 1,
    color: COLORS.white,
    gap: "18px",
    py: "40px",
    position: "relative",
  },
  heading: (isArabic) => ({
    fontWeight: 700,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: { xs: "18px", md: "24px" },
  }),
  gridContainer: (isArabic) => ({
    gap: "30px 15px",
    boxSizing: "border-box",
    width: "100%",
    padding: { xs: "0 10px", sm: "0 25px" },
    flexDirection: isArabic ? "row-reverse" : "row",
    display: "flex",
    maxWidth: "1235px",
    flexWrap: "wrap",
    margin: 0,
    mt: "20px",
  }),
  
  //   no tickets
  noTicketsImg: { width: "80px", height: "60px", paddingTop: "100px" },
  StatusText: (isArabic) => ({
    fontWeight: 700,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "20px",
    color: COLORS.grey,
  }),
  message: (isArabic) => ({
    fontWeight: 400,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "16px",
    maxWidth: "335px",
    margin: "0 15x",
    width: "calc(100% - 30px)",
    textAlign: "center",
    color: COLORS.grey,
  }),
  cardWrapperContainer: {
    width: "100%",
    maxWidth: "1235px",
  },
  cardWrapper: {
    display: "flex",
    width: "100%",
    margin: "0",
    alignItems: "center",
    maxWidth: "1235px",
    overflow: "hidden",
    flexDirection: "column",
  },
};
