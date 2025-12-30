export const Style = {
  dropdownItems: (isArabic) => ({
    padding: "8px 0",
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "16px",
    fontWeight: 700,
    display: "flex",
    flexDirection: isArabic ? "row-reverse" : "row",
    justifyContent: isArabic ? "end" : "start",
  }),
  countryImage: {
    mx: 1,
    width: 30,
    aspectRatio: 1,
    borderRadius: 30,
  },
};
