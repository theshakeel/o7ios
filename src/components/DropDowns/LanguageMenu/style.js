export const Style = {
  dropdownItems: (isArabic) => ({
    padding: "8px 0",
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    display: 'flex',
    fontSize: "16px",
    fontWeight: 700,
  }),
  countryImage: {
    marginRight: 1,
    width: 30,
    aspectRatio: 1,
    borderRadius: 30,
  },
};
