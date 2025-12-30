import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const PartnerGallery = ({ partnerImages, t }) => {
  const containerRef = useRef(null);
  const [ind, setInd] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [imageViewerModal, setImageViewerModal] = useState({
    gallery: false,
    people: false,
    partner: false,
  });

  // NEW: state & ref to control auto-scroll
  const autoScrollRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const element = document?.querySelectorAll(".css-jndv62")[0];
    if (element) {
      element.children[0].style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      element.children[0].style.zIndex = "2";
    }
  }, [imageViewerModal.gallery]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      setIsScrollable(el.scrollWidth > el.clientWidth);
    }
  }, [partnerImages]);

  // Auto scroll logic
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let scrollPos = 0;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let direction = 1;

    const startAutoScroll = () => {
      stopAutoScroll(); // avoid duplicate intervals
      autoScrollRef.current = setInterval(() => {
        if (isPausedRef.current) return; // if paused, skip this tick

        if (scrollPos >= maxScroll) direction = -1;
        else if (scrollPos <= 0) direction = 1;

        scrollPos += direction;
        el.scrollLeft = scrollPos;
      }, 20);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();

    // Stop/resume on touch
    const handleTouchStart = () => {
      isPausedRef.current = true;
      stopAutoScroll();
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };

    const handleTouchEnd = () => {
      // resume after 3 seconds
      pauseTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false;
        startAutoScroll();
      }, 3000);
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      stopAutoScroll();
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [partnerImages]);

  return (
    <>
      {!!partnerImages.length && (
        <>
          <Typography sx={{ mt: 3, mb: 2, fontWeight: "bold", fontSize: 18 }}>
            {t("event_detail_page.partners")}
          </Typography>
          <Box
            ref={containerRef}
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              scrollbarWidth: "thin",
              scrollbarColor: "#FFBA83 transparent",
              "&::-webkit-scrollbar": { height: 6 },
              "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#FFBA83",
                borderRadius: 3,
              },
              px: isScrollable ? 1 : 0,
              position: "relative",
            }}
          >
            {partnerImages.map((item, index) => (
              <Box
                key={index}
                component="img"
                src={item.src}
                alt={`Partner ${index + 1}`}
                sx={{
                  width: 120,
                  height: 70,
                  borderRadius: 3,
                  objectFit: "cover",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: "2px solid #FFBA83",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 16px rgba(255,77,103,0.6)",
                  },
                }}
                onClick={() => {
                  setImageViewerModal({ partner: true });
                  setInd(index);
                }}
              />
            ))}
          </Box>
          {isScrollable && (
            <Typography
              sx={{
                fontSize: 12,
                opacity: 0.6,
                mt: 1,
                textAlign: "center",
                color: "#bbb",
                userSelect: "none",
              }}
            >
              {/* Optional hint text */}
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export default PartnerGallery;
