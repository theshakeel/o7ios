// src/App.js
import React, { useEffect } from "react";
import { Box, ThemeProvider, createTheme, GlobalStyles } from "@mui/material";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
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
import MobileNumberModal from "./components/Modals/MobileNumber";
import { preloadPages } from "./services/preloadPages";
import { getSlides } from "./store/slice/slides";
import { getAllSlides } from "./services/data/slides"; // your API
// ✅ Wrapper to access navigate
function AppInner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = React.useState(false);

  const requireAuth = () => {
    setAuthOpen(true);
  };
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
  useEffect(() => {

    preloadPages(1000);
  }, []);
  useEffect(() => {
    let mounted = true;

    const preloadSlides = async () => {
      try {
        const res = await getAllSlides();
        if (!mounted) return;
        dispatch(getSlides(res.data.data));
      } catch (err) {
        console.error("Slides preload failed", err);
      }
    };

    preloadSlides();

    return () => {
      mounted = false;
    };
  }, [dispatch]);
  // ✅ Register for Push Notifications
  useEffect(() => {
    const registerPush = async () => {
      try {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive !== "granted") {
          console.warn("[Push] Permission not granted. Aborting registration.");
          return;
        }
      } catch (err) {
        console.error("[Push] Error requesting permission:", err);
        return;
      }
      try {
        await PushNotifications.register();
        console.log("[Push] Registration request sent to FCM/APNs");
      } catch (err) {
        console.error("[Push] Registration failed:", err);
        return;
      }

      // PushNotifications.addListener("registration", async (token) => {
      //   console.log("[Push] Device token received:", token.value);

      //   try {
      //   const response = await fetch("https://admin.o7events.com/api/push/register", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ token: token.value }),
      //   });

      //   // Debug the raw response
      //   const text = await response.text();
      //   console.log("[Push] Raw response from backend:", text);

      //   // Attempt JSON parse only if content-type is JSON
      //   const contentType = response.headers.get("content-type") || "";
      //   let data;
      //   if (contentType.includes("application/json")) {
      //     data = JSON.parse(text);
      //     console.log("[Push] Parsed JSON:", data);
      //   } else {
      //     console.warn("[Push] Backend did not return JSON!");
      //     data = null;
      //   }

      //   if (!response.ok) {
      //     console.error("[Push] Backend returned error:", data || text);
      //   } else {
      //     console.log("[Push] Token saved successfully");
      //   }
      // } catch (err) {
      //   console.error("[Push] Error sending token to backend:", err);
      // }

      // });
      
      PushNotifications.addListener("registration", async (token) => {
      console.log("[Push] Device token received:", token.value);

      try {
        // 🔹 Deduplicate same token
        const savedToken = localStorage.getItem("push_token");
        if (savedToken === token.value) {
          console.log("[Push] Token already registered — skipping backend call");
          return;
        }

        // 🔹 Cooldown (1 hour)
        const COOLDOWN_MS = 60 * 60 * 1000;
        const lastSent = Number(localStorage.getItem("push_last_sent") || 0);
        if (Date.now() - lastSent < COOLDOWN_MS) {
          console.log("[Push] Skipping backend call (cooldown active)");
          return;
        }

        const response = await fetch("https://admin.o7events.com/api/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.value }),
        });

        // 🔹 Ignore 429 rate-limit safely
        if (response.status === 429) {
          console.warn("[Push] Rate limited — skipping");
          return;
        }

        // ✅ Save token + timestamp
        localStorage.setItem("push_token", token.value);
        localStorage.setItem("push_last_sent", Date.now());

        // Debug output
        const text = await response.text();
        console.log("[Push] Raw response:", text);
      } catch (err) {
        console.error("[Push] Error sending token to backend (caught):", err);
      }
    });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("[Push] Registration error:", err);
      });
      PushNotifications.addListener("pushNotificationReceived", async (notification) => {
        console.log("[Push] Notification received (foreground):", notification);

        try {
          const notifId = Math.floor(Math.random() * 1000000);

          await LocalNotifications.schedule({
            notifications: [
              {
                id: notifId,
                title: notification.title || "New Notification",
                body: notification.body || JSON.stringify(notification.data || {}),
                schedule: { at: new Date(Date.now() + 1000) },
                sound: "default",
              },
            ],
          });

          console.log("[Push] Local notification scheduled with ID:", notifId);
        } catch (err) {
          console.error("[Push] Error scheduling local notification:", err);
        }
      });
     PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
  console.log("[Push] Notification action performed:", notification);
  let data = notification.notification?.data || notification.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("[Push] Failed to parse data payload:", data);
      data = {};
    }
  }

  if (data?.event) {
    console.log("[Push] Navigating to event:", data.event);
    navigate(data.event);
  } else {
    console.warn("[Push] No event found in payload, staying on home screen");
  }
});
      CapApp.addListener("appUrlOpen", (event) => {
        console.log("[DeepLink] App opened with URL:", event.url);
        try {
          const url = new URL(event.url);
          const pathname = url.pathname; // e.g. /event-details/liverpool
          navigate(pathname);
        } catch (err) {
          console.error("[DeepLink] Error parsing URL:", err);
        }
      });
    };

    registerPush();
  }, [navigate]);

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
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          "html, body, #root": { fontFamily: theme.typography.fontFamily },
          "*": { fontFamily: theme.typography.fontFamily },
        }}
      />
      <BackButtonHandler />
      <Toaster position="top-right" reverseOrder={false} />
      <Box
        sx={{
          width: "100%",
          maxWidth: "890px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          m: "auto",
          padding: "6px",
          boxSizing: "border-box",
          justifyContent: "flex-start",
        }}
      >
        <Navbar onRequireAuth={requireAuth} />

        <AppRoutes />

        <Footer requireAuth={requireAuth} />

        <MobileNumberModal open={authOpen} setOpen={setAuthOpen} />

      </Box>
    </ThemeProvider>
  );
}

// ✅ Router wrapper so navigate works
export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
