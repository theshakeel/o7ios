import { COLORS } from "../../../theme";

export const CustomStyle = {
  number: (isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    opacity: "0.7",
    fontSize: "12px",
    color: COLORS.grey,
  }),
  otpInput: {
    width: "45px",
    height: "45px",
    marginRight: "15px",
    borderRadius: "12px",
    fontSize: "16px",
    border: "#1E2324",
    background: "#1E2324",
    textAlign: "center",
    color: COLORS.white,
  },
  getCode: (isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontWeight: 400,
    fontSize: "16px",
    color: COLORS.grey,
    width: "100%",
    maxWidth: "315px",
  }),
  resend: (isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontWeight: 800,
    fontSize: "16px",
    color: COLORS.secondary,
    cursor: "pointer",
    textDecoration: "underline",
  }),
};
