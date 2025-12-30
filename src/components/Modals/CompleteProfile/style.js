import { COLORS } from "../../../theme";

export const CustomStyle = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    gap: "10px",
  },
  label: (isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontWeight: 600,
    fontSize: "12px",
    color: COLORS.grey,
    opacity: "0.6",
  }),
  input: {
    color: COLORS.grey,
    background: "#1E2324",
    width: "100%",
    borderRadius: "12px",
  },
};
