import { COLORS } from "../../theme";

const Style = {
  container: {
    color: COLORS.white,
    maxWidth: "1260px",
    margin: "0 auto",
    px: { xs: "12px", md: "24px" },
    py: "40px",
  },
  firstChild: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  hedingContainer: {
    fontSize: "30px",
    color: "white",
    display: { xs: "block", md: "none" },
  },
  heading: { fontSize: "24px" },
};
export default Style;
