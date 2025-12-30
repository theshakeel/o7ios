import { COLORS } from "../../theme";

export const Style = {
  main: (scroll, src, isOne) => ({
    scrollLeft: scroll || 0,
    position: "relative",
    // width: {
    //   xs: isOne ? "100vw" : "calc( 100vw - 80px )",
    //   sm: "calc( 50% - 20px )",
    //   md: "calc( 33% - 22px )",
    //   lg: "calc( 25% - 27px )",
    // },
    // height: { xs: "500px", sm: "412px" },
    minWidth: "200px",
    background: `url('${src}')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    borderRadius: "20px",
    display: "flex",
  }),

  card: () => ({
    // height: { xs: "500px", sm: "412px" },
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #20353A 100%)",
    borderRadius: "18px",
    boxSizing: "border-box",
    width: "100%",
    px: { xs: "0px", sm: "0px" },
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    cursor: "pointer",
  }),
  ticketDateTag: (isArabic) => ({
    top: "-12px",
    left: isArabic ? "none" : "0px",
    right: isArabic ? "0px" : "none",
    width: "45px",
    height: "78px",
  }),
  date: (isArabic) => ({
    fontSize: "24px",
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    padding: 0,
    lineHeight: "normal",
    mt: "12px",
  }),
  month: (isArabic) => ({
    fontSize: "14px",
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    lineHeight: 1.3,
    fontWeight: 700,
    padding: 0,
  }),
  cardContent: (isArabic) => ({
    color: COLORS.white,
    px: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: isArabic ? "end" : "start",
    textAlign: isArabic ? "end" : "start",
    gap: "12px",
  }),
 eventName: (isArabic) => ({
  fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
  fontSize: "16px", // ✅ smaller font, mobile-friendly
  textAlign: "center",
  fontWeight: 700,
  lineHeight: 1.4, // ✅ tighter line height
  whiteSpace: "nowrap", // ✅ force single line
  overflow: "hidden", // ✅ clip extra text
  textOverflow: "ellipsis", // ✅ show "..." if too long
}),

  startPeriod: (isArabic) => ({
  position: "absolute",
  bottom: "-7px",
  left: "-7px",
  width: "100%",                  // full width
  borderRadius: "50px",  // only top corners rounded since it sits at bottom
  background: COLORS.white,
  paddingTop: "2px",                  // py:1 → ~"8px"px
  paddingBottom: "8px",
  // paddingLeft: "8px",                 // px: { xs: 0."8px", sm: 3 }
  // paddingRight: "8px",
  color: COLORS.black,
  fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
  lineHeight: 1.3,
  fontSize: "14px",
  fontWeight: 800,
  textAlign: "center",            // override textAlign:end → center since it's full width
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
}),

  location: (isArabic) => ({
  flexDirection: isArabic ? "row-reverse" : "row",
  fontSize: "14px",
  fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
  fontWeight: 400,
  lineHeight: 1.5,
  color: "#B4B6B6",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backgroundColor: "#000", // black background
  padding: "0px 4px",
  borderRadius: "0px",
  maxWidth: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",

  "& svg": {
    fontSize: "14px",
    color: "inherit",
    flexShrink: 0, // prevent shrinking
  },
  "& span": {
    color: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // adds "..." if text is too long
    display: "inline-block",
  },
}),

  name: (isArabic) => ({
  position: "absolute",
  right: isArabic ? "auto" : "13px",
  left: isArabic ? "-4px" : "auto",
  top: "-1px",
  paddingLeft:"10px",
  width: "100px",                 // fixed width
  height: "14px",                 // fixed height
  display: "flex",
  alignItems: "center",           // vertical center
  justifyContent: "left",       // horizontal center
  borderRadius: "20px",
  backgroundColor: "#FFBA83",     // accent
  color: "#1E1E1E",               // contrast text
  border: "none",
  fontWeight: 600,
  fontSize: "0.75rem",
  lineHeight: 1,
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",             // prevents spill
  textOverflow: "ellipsis",       // adds "..." if too long
}),


  favouriteIcon: (isArabic) => ({
    position: "absolute",
    top: 10,
    right: isArabic ? "none" : 10,
    left: isArabic ? 10 : "none",
  }),
};
