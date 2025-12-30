import { COLORS } from "../../theme";

export const Style = {
  container: (isArabic) => ({
    display: "flex",
    flexDirection: isArabic ? "row-reverse" : "row",
    backgroundColor: COLORS.black,
    width: "calc(100% - 30px)",
    maxWidth: "400px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    cursor: "pointer",
    p: "5px",
    margin: "0 20px !important",
  }),
  toggleItem: {
    display: "flex",
    alignItems: "center",
    py: 2,
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  toggleItemSelected: {
    backgroundColor: COLORS.white,
    borderRadius: "16px",
    color: COLORS.black,
  },
};
