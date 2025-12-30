import { COLORS } from "../../theme";

export const Style = {
  wrapper: {
    background: { xs: "#060B0C", sm: "none" },
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "noWrap",
    overflow: "auto",
    top: "0 !important",
  },
  main: (isEmployee) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: { xs: "600px", sm: "400px" },
    bgcolor: isEmployee ? 'rgba(0, 0, 0, 0)' : { xs: "none", sm: COLORS.primary },
    color: COLORS.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    boxShadow: 24,
    gap: "10px",
    borderRadius: "24px",
    p: { xs: 2, sm: 4 },
    boxSizing: "border-box",
    height: { xs: "100%", sm: "auto" },
    outline: isEmployee && 'none',
    // outline: isEmployee ? 'none' : 'auto'
  }),
  actionBtn: {
    width: "24px",
    height: "24px",
    cursor: "pointer",
    display: { xs: "none", sm: "flex" },
    alignSelf: "flex-end",
  },
};
