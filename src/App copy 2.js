// src/App.js
import React, { useEffect } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { COLORS } from "./theme";
import { Toaster } from "react-hot-toast";
import BackButtonHandler from "./BackButtonHandler";
import AppRoutes from "./route";

// Capacitor SplashScreen
import { SplashScreen } from "@capacitor/splash-screen";

const App = () => {
  useEffect(() => {
    // Hide splash as soon as app mounts
    SplashScreen.hide();
  }, []);

  const theme = createTheme({
    palette: {
      primary: { light: COLORS.primary, main: COLORS.primary, dark: COLORS.primary },
      secondary: { light: COLORS.secondary, main: COLORS.secondary, dark: COLORS.secondary },
      black: { light: COLORS.black, main: COLORS.black, dark: COLORS.black },
      white: { light: COLORS.white, main: COLORS.white, dark: COLORS.white },
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <BackButtonHandler />
        <Toaster position="top-right" reverseOrder={false} />
        <Box
          sx={{
            width: "100%",
            maxWidth: "1440px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            m: "auto",
            padding: "6px",
            boxSizing: "border-box",
            justifyContent: "flex-start",
          }}
        >
          <Navbar />
          <AppRoutes />
          <Footer />
        </Box>
      </ThemeProvider>
    </Router>
  );
};

export default App;
