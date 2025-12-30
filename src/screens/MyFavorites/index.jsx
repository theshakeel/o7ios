import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomCard } from "../../components";
import { getFavouriteEvents } from "../../services/favourite";
import { getFavourite, selectFavourite } from "../../store/slice/favourite";
import { selectUser } from "../../store/slice/user";
import { Style } from "./style";
import { useTranslation } from "react-i18next";
  

const MyFavorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const user = useSelector(selectUser);
  const favouriteEvents = useSelector(selectFavourite);
  const { token, language } = useSelector(selectUser);
  const scrollAbleDivRef = useRef(null);
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const scrollLeft = scrollAbleDivRef.current.scrollLeft;
    setScrollPosition(scrollLeft);
  };
  let skeletonArray = new Array(1, 2, 3, 4, 5, 6, 7, 8);
  const handleFavouriteEventsFetch = async () => {
    try {
      const { data } = await getFavouriteEvents(token);
      dispatch(getFavourite(data?.data));
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    handleFavouriteEventsFetch();
    // mixpanel?.track("my-favorites", {
      // email: user?.email,
      // name: user?.name || "anonymous",
    // });
  }, []);
  const isArabic = language === "ar";
 return (
  <Box
    sx={{
      ...Style.main,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      bgcolor: "#0f0f0f",
    }}
  >
    {/* 🔹 Sticky header */}
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0f0f0f",
        py: 2,
        px: 2,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <ArrowBackIcon
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          left: isArabic ? "auto" : 16,
          right: isArabic ? 16 : "auto",
          fontSize: 28,
          color: "#fff",
          cursor: "pointer",
          display: { xs: "flex", md: "none" },
        }}
      />
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: 600,
          color: "#fff",
          textAlign: "center",
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        {t("drawer.my_favorites")}
      </Typography>
    </Box>

    {/* 🔹 Scrollable content */}
    <Box
      ref={scrollAbleDivRef}
      onScroll={handleScroll}
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 1.5, sm: 3 },
        pt: 2,
        pb: 6,
      }}
    >
      {/* 🔹 Responsive grid */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, sm: 3 },
          gridTemplateColumns: {
            xs: "1fr", // full width on mobile
            sm: "repeat(2, 1fr)", // 2 columns on tablets
            md: "repeat(3, 1fr)", // 3 columns on desktop
          },
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        {!loader ? (
          favouriteEvents?.length > 0 ? (
            favouriteEvents.map((item, index) => (
              <CustomCard
                key={index}
                data={item}
                favoritePage={true}
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  bgcolor: "#1c1c1c",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s ease",
                  "&:active": { transform: "scale(0.98)" },
                }}
                childSx={Style.customCardBox}
              />
            ))
          ) : (
            <Typography
              sx={{
                gridColumn: "1 / -1",
                color: "#999",
                fontSize: "1rem",
                textAlign: "center",
                mt: 4,
              }}
            >
              {t("drawer.no_favorites_found")}
            </Typography>
          )
        ) : (
          skeletonArray.map((item, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{
                borderRadius: "16px",
                height: 220,
                width: "100%",
                bgcolor: "#222",
              }}
            />
          ))
        )}
      </Box>
    </Box>
  </Box>
);

};

export default MyFavorites;
