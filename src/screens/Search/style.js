import { COLORS } from "../../theme";

export const Style = {
  main: {
    padding: { xs: "0 12px", sm: "0 24px 30px" },
    maxWidth: "1212px",
    margin: "0 auto",
    overflow: "hidden",
    width: {
      xs: "calc( 100% - 24px )",
      sm: "calc( 100% - 48px )",
    },
  },
  searchButton:{
    border: "2px solid #FFBA83",
    borderRadius: "0px 7px 7px 0px",
    borderLeft:"none"
  },
  searchInput: {
    border: "2px solid #FFBA83",
    borderRadius: "7px 0px 0px 7px",
    color:"#FFBA83 !important",
    paddingLeft: "25px",
    borderRight:"none",
  },
  categorySelect:{
    border: "2px solid #FFBA83",
    borderRadius: "0px",
    borderLeft: "none",
    color: "#FFBA83 !important"
  },
  smallScreenOptionsContainer: (isArabic) => ({
    display: { xs: "flex" },
    flexDirection: isArabic ? "row-reverse" : "row",
    margin: "auto",
    mt: "20px",
    overflowX: "auto",
    overflowY: "hidden",
    maxWidth: "100%",
    "&::-webkit-scrollbar": {
      width: "0",
    },
    width: { xs: "fit-content" },
  }),
  smallScreenOptionsContainerH: (isArabic) => ({
    display: { xs: "flex" },
    flexDirection: isArabic ? "row-reverse" : "row",
    margin: "auto",
    height:"40px",
    mt: "20px",
    overflowX: "auto",
    overflowY: "hidden",
    maxWidth: "100%",
    "&::-webkit-scrollbar": {
      width: "0",
    },
    width: { xs: "fit-content" },
  }),
  smallScreenOptions: (select, index, isArabic) => ({
    fontFamily: isArabic ? "Cairo, sans-serif" : "Cairo, sans-serif",
    minWidth: "fit-content",
    // width: "fit-content",
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
    display: { xs: "flex" },
    width: "100%",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0",
    },
  },
  customCardContainer: (totalNo, isLoading, isArabic) => ({
    position: "relative",
    mt: { xs: "40px", md: "35px" },
    display: "flex",
    flexDirection: isArabic ? "row-reverse" : "row",
    flexWrap: { xs: "nowrap", sm: "wrap" },
    gap: { xs: isLoading ? "20px" : "0", sm: "52px 36px !important" },
    alignItems: "center",
    boxSizing: "border-box",
    width: { xs: `${totalNo * 100}%`, sm: "100%" },
    transition: "0.5s ease",
    mb: "30px",
  }),
  cardSkeleton: {
    background: COLORS.black,
    width: {
      xs: "100vw",
      sm: "calc( 50% - 20px )",
      md: "calc( 33% - 22px )",
      lg: "calc( 25% - 27px )",
    },
    height: { xs: "500px", sm: "412px" },
    borderRadius: "20px",
  },
  card: (goToSlide, index) => ({
    // background: 'aqua',
    display: "none !important",
    // display: goToSlide - 2  === index || goToSlide + 2 === index ? 'none !important': 'flex !important'
    // left: `${goToSlide === index * 100}%`,
  }),
};
