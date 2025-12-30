export const Style = {
  username: (isArabic) => ({
    padding: 0,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "20px",
    fontWeight: 700,
    display: 'flex',
    justifyContent: isArabic ? 'end' : 'start'
  }),
  phoneNumber: (isArabic) => ({
    padding: 0,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "14px",
    fontWeight: 400,
    display: 'flex',
    justifyContent: isArabic ? 'end' : 'start'
  }),
  dropdownItemsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "20px",
    padding:"20px"
  },
  dropdownItems: (isArabic) => ({
    padding: 0,
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    fontSize: "16px",
    fontWeight: 700,
    display: 'flex',
    justifyContent: isArabic ? 'end' : 'start',
    width: '100%'
  }),
};