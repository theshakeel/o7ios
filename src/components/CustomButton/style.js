export const Style = {
  button: (isArabic) => ({
    fontSize: "14px",
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontWeight: 700,
    textTransform: "capitalize",
  }),
};
