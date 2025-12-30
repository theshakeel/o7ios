import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slice/user";
import ChatComponent from "../ChatComponent";
import { useDispatch } from "react-redux";
import { openAuthModal } from "../../store/slice/ui";

const Footer = ({ requireAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [chatOpen, setChatOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const dispatch = useDispatch();
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: -40,
          left: 0,
          right: 0,
          zIndex: 1300,
          background: "var(--app-background)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0px)",         
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          pb: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            pt: 0.1,
            pb: 1,
            px: 2,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          {/* Home */}
          <NavItem active={isActive("/")} icon={<HomeIcon />} onClick={() => navigate("/")} />

          {/* Search */}
          <NavItem active={isActive("/search")} icon={<SearchIcon />} onClick={() => navigate("/search")} />

          {/* Tickets */}
          <NavItem
            active={isActive("/my-tickets")}
            icon={<ConfirmationNumberIcon />}
            onClick={() => {
              if (!user?.id) {
                requireAuth();
                return;
              }
              navigate("/my-tickets");
            }}
          />

          {/* Chat toggle */}
          {user?.id && (
            <NavItem
              active={false}
              icon={<ChatBubbleIcon />}
              onClick={() => setChatOpen(true)}
            />
          )}

        </Box>
      </Box>

      {/* Fullscreen Chat */}
      {user?.id && (
        <ChatComponent open={chatOpen} onClose={() => setChatOpen(false)} />
      )}
    </>
  );
};

// Reusable item
const NavItem = ({ active, icon, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      py: 1,
      px: 2,
      borderRadius: 2,
      width: 48,
      height: 48,
    }}
  >
    {React.cloneElement(icon, {
      sx: {
        fontSize: 28,
        color: active ? "#FFBA83" : "#94a3b8",
        transition: "all 0.3s ease",
      },
    })}
  </Box>
);

export default Footer;
