import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let listener;

    const setupListener = async () => {
      listener = await CapacitorApp.addListener("backButton", () => {
        if (location.pathname !== "/") {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      });
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove(); // 👈 now works
      }
    };
  }, [navigate, location]);

  return null;
};

export default BackButtonHandler;
