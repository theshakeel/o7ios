import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function CustomizedSnackbars({
  isShowAlert,
  setIsShowAlert,
  alertText,
  type = "success",
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsShowAlert({isShowAlert : false, alertText: "", type: ""});
  };

  return (
    <Snackbar
      open={isShowAlert}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertText}
      </Alert>
    </Snackbar>
  );
}
