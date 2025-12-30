import { COLORS } from "../../theme";

export const Style = {
  main: {
    padding: { xs: "0 12px", sm: "0 24px 30px" },
    maxWidth: "1212px",
    margin: "0 auto",
    my: { xs: "40px", md: "0px" },
    width: {
      xs: "calc( 100% - 24px )",
      sm: "calc( 100% - 48px )",
    },
  },
  heading: (isArabic) => ({
    fontWeight: "400",
    letterSpacing: "0.00938em",
    fontWeight: "700",
    fontSize: { xs: "20px", md: "24px" },
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
  }),
  smallScreenOptionsContainer: {
    display: { xs: "flex" },
    mt: { xs: "10px", md: "5px" },
    margin: "auto",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0",
    },
    width: { xs: "auto", md: "fit-content" },
  },
  smallScreenOptions: (select, index, isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
    width: "fit-content",
    margin: "0 10px",
    display: "flex",
    height: "40px",
    boxSizing: "border-box",
    padding: "15px 24px",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "20px",
    color: select === index ? "black" : "#fff",
    background: select === index ? "#fff" : "rgba(25, 25, 25)",
    cursor: "pointer",
  }),
  customCardContainerBox: {
    width: "100%",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0",
    },
  },
customCardContainer: (totalNo, isArabic) => ({
  position: "relative",
  mt: { xs: "20px", md: "35px" },
  display: "flex",
  flexDirection: isArabic ? "row-reverse" : "row",
  flexWrap: "wrap",
  gap: { xs: "20px", sm: "32px 24px" },
  alignItems: "center",
  boxSizing: "border-box",
  width: "100%",
  transition: "0.5s ease",
  justifyContent: { xs: "center", md: "flex-start" },

  // 🧩 NEW responsive rules
  "& > *": {
    flex: {
      xs: "0 0 100%",  // full width on mobile
      sm: "0 0 calc(50% - 16px)", // two columns on small tablets
      md: "0 0 calc(33.333% - 20px)", // three columns on desktop
    },
    maxWidth: {
      xs: "100%",
      sm: "calc(50% - 16px)",
      md: "calc(33.333% - 20px)",
    },
  },
}),

  cardSkeleton: {
    background: COLORS.black,
    width: {
      xs: "100%",
      sm: "calc( 50% - 60px )",
      md: "calc( 33% - 60px )",
      lg: "calc( 25% - 67px )",
    },
    height: { xs: "500px", sm: "412px" },
    borderRadius: "20px",
  },
  customCard: {
    scrollLeft: 0,
    position: "relative",
    width: {
      xs: "calc(100% - 40px)",
      sm: "calc( 50% - 60px )",
      md: "calc( 33% - 60px )",
      lg: "calc( 25% - 67px )",
    },
    height: { xs: "500px", sm: "412px" },
  },
  customCardBox: {
    borderRadius: "20px",
    width: "100%",
    px: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    cursor: "pointer",
    height: { xs: "500px", sm: "412px" },
  },
};
