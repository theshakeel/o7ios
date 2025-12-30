export const styles = {
  shareParent: (isArabic) => ({
    width: "200px",
    display: "flex",
    flexDirection: isArabic ? "row-reverse" : "row",
    height: "40px",
    justifyContent: "flex-start",
    alignItems: "center",
  }),
  shareText: (isArabic) => ({
    flexGrow: 1,
    textAlign: isArabic ? "right" : "left",
    m: 1,
    // mr: 1
  }),
};
