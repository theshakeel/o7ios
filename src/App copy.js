// src/App.js
import React, { useEffect } from "react";
import { Box, ThemeProvider, createTheme, GlobalStyles } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { COLORS } from "./theme";
import { Toaster } from "react-hot-toast";
import BackButtonHandler from "./BackButtonHandler";
import AppRoutes from "./route";
import { useDispatch } from "react-redux";
import { getUserProfile } from "./services/profile";
import { updateUserData } from "./store/slice/user";
import { SplashScreen } from "@capacitor/splash-screen";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { App as CapApp } from "@capacitor/app";
const App = () => {
  const dispatch = useDispatch();

  // ✅ Hide splash + load user profile
  useEffect(() => {
    SplashScreen.hide();

    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile(token)
        .then((res) => {
          dispatch(updateUserData({ ...res.data.data, token }));
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [dispatch]);

  // ✅ Register for Push Notifications


useEffect(() => {
  const registerPush = async () => {
    console.log("[Push] Starting push notification setup...");

    // 1️⃣ Request permission
    try {
      const permission = await PushNotifications.requestPermissions();
      console.log("[Push] Permission response:", permission);

      if (permission.receive !== "granted") {
        console.warn("[Push] Permission not granted. Aborting registration.");
        return;
      }
    } catch (err) {
      console.error("[Push] Error requesting permission:", err);
      return;
    }

    // 2️⃣ Register with FCM/APNs
    try {
      await PushNotifications.register();
      console.log("[Push] Registration request sent to FCM/APNs");
    } catch (err) {
      console.error("[Push] Registration failed:", err);
      return;
    }

    // 3️⃣ Handle registration token
    PushNotifications.addListener("registration", async (token) => {
      console.log("[Push] Device token received:", token.value);

      try {
        const response = await fetch("https://admin.o7events.com/api/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.value }),
        });

        const data = await response.json();
        console.log("[Push] Backend response:", data);

        if (!response.ok) {
          console.error("[Push] Backend returned error:", data);
        } else {
          console.log("[Push] Token saved successfully and ready for notifications");
        }
      } catch (err) {
        console.error("[Push] Error sending token to backend:", err);
      }
    });

    // 4️⃣ Handle registration errors
    PushNotifications.addListener("registrationError", (err) => {
      console.error("[Push] Registration error:", err);
    });

    // 5️⃣ Foreground notifications → show local notification
    PushNotifications.addListener("pushNotificationReceived", async (notification) => {
  console.log("[Push] Notification received (foreground):", notification);

  try {
    // Use a safe integer ID
    const notifId = Math.floor(Math.random() * 1000000);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: notifId,
          title: notification.title || "New Notification",
          body: notification.body || JSON.stringify(notification.data || {}),
          schedule: { at: new Date(Date.now() + 1000) }, // show after 1s
          sound: "default",
        },
      ],
    });

    console.log("[Push] Local notification scheduled with ID:", notifId);
  } catch (err) {
    console.error("[Push] Error scheduling local notification:", err);
  }
});


    // 6️⃣ Handle tapped notifications (background / user action)
PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
  console.log("[Push] Notification action performed:", notification);

  // Access correct data
  const data = notification.notification?.data || notification.data;

  if (data?.chat_id) {
    console.log("[Push] Navigating to chat:", data.chat_id);
    window.location.href = `/chat/${data.chat_id}`;
  }
});

    // 7️⃣ Force app to background after 5 seconds (simulate background test)
    setTimeout(async () => {
      console.log("[Push] Minimizing app after 5s to test background notification delivery");
      try {
        await CapApp.minimizeApp();
      } catch (err) {
        console.warn("[Push] Could not minimize app automatically:", err);
      }
    }, 5000);
  };

  registerPush();
}, []);


  // ✅ Theme setup
  const fontConfig = {
    body: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    heading: '"Poppins", "Montserrat", "Arial", sans-serif',
  };

  const theme = createTheme({
    palette: {
      primary: { main: COLORS.primary },
      secondary: { main: COLORS.secondary },
      black: { main: COLORS.black },
      white: { main: COLORS.white },
    },
    typography: {
      fontFamily: fontConfig.body,
      h1: { fontFamily: fontConfig.heading, fontWeight: 700 },
      h2: { fontFamily: fontConfig.heading, fontWeight: 600 },
      h3: { fontFamily: fontConfig.heading, fontWeight: 600 },
      h4: { fontFamily: fontConfig.heading, fontWeight: 500 },
      button: { fontFamily: fontConfig.body, textTransform: "none" },
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            "html, body, #root": {
              fontFamily: theme.typography.fontFamily,
            },
            "*": {
              fontFamily: theme.typography.fontFamily,
            },
          }}
        />
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
