import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import CustomCard from "../CustomCard"; // adjust path

const EventsByCategory = ({ eventsData, loader, skeletonArray, language }) => {
  // console.log("here is events data", eventsData)
  const [eventsGrouped, setEventsGrouped] = useState({});
  const scrollRefs = useRef({});
  const snapTimeouts = useRef({});
  const scrollStep = 282; // pixels

  // Group events by category
 useEffect(() => {
  const grouped = eventsData.reduce((acc, ev) => {
    const catId = ev.category?.id || "uncategorized";

    // If group does not exist yet, create it
    if (!acc[catId]) {
      acc[catId] = {
        category: ev.category || {
          // Create a safe fallback object if category is missing
          id: "uncategorized",
          translation: {
            en: { name: "Uncategorized" },
            ar: { name: "غير مصنف" }
          }
        },
        events: []
      };
    }

    acc[catId].events.push(ev);
    return acc;
  }, {});

  setEventsGrouped(grouped);
}, [eventsData]);


  // Smooth scroll helper
  const smoothScroll = (element, distance, duration = 500, callback) => {
    let start = element.scrollLeft;
    let change = distance;
    let currentTime = 0;
    const increment = 16;

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animate = () => {
      currentTime += increment;
      let val = easeInOutQuad(Math.min(currentTime / duration, 1));
      element.scrollLeft = start + change * val;

      if (currentTime < duration) {
        requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };

    animate();
  };

  // Snap scroll to nearest step after user scrolls
  const handleSnap = (catId) => {
    const container = scrollRefs.current[catId];
    if (!container) return;

    // clear previous debounce
    clearTimeout(snapTimeouts.current[catId]);

    snapTimeouts.current[catId] = setTimeout(() => {
      const current = container.scrollLeft;
      const snapTo = Math.round(current / scrollStep) * scrollStep;
      smoothScroll(container, snapTo - current, 300);
    }, 150); // wait 150ms after scroll ends
  };

  // Auto-scroll per category with step + pause + restart
  useEffect(() => {
    const animRefs = {};

    Object.keys(eventsGrouped).forEach((catId) => {
      const container = scrollRefs.current[catId];
      if (!container) return;

      const pauseTime = 3000; // ms

      const scrollLoop = () => {
        if (!container) return;

        let nextScrollLeft = container.scrollLeft + scrollStep;
        if (nextScrollLeft > container.scrollWidth - container.clientWidth) {
          nextScrollLeft = 0; // restart
        }

        smoothScroll(container, nextScrollLeft - container.scrollLeft, 600, () => {
          setTimeout(scrollLoop, pauseTime);
        });
      };

      setTimeout(scrollLoop, Math.random() * 3000);
      animRefs[catId] = scrollLoop;
    });

    return () => {
      Object.values(animRefs).forEach((fn) => fn && clearTimeout(fn));
    };
  }, [eventsGrouped]);

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 8 }}>
      {Object.values(eventsGrouped).map((group) => {
        const catId = group.category?.id || "uncategorized";

        const eventsToRender =
          group.events.length === 1
            ? Array(6).fill(group.events[0])
            : group.events;

        return (
          <Box key={catId} sx={{ mb: 2 }}>
            {/* Category Title */}
            <Typography
              variant="h6"
              sx={{
                mb: 1.5,
                color: "#FFBA83 !important",
                fontWeight: 700,
                fontSize: "0.95rem",
                px: 1,
              }}
            >
              {group.category?.translation?.[language]?.name || "Uncategorized"}
            </Typography>

            {/* Horizontal scroll container */}
            <Box
              ref={(el) => (scrollRefs.current[catId] = el)}
              onScroll={() => handleSnap(catId)}
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 1,
                pb: 1,
                scrollBehavior: "smooth",
                cursor: "grab",
                px: 0.5,
              }}
            >
              {!loader
                ? eventsToRender.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: "0 0 auto",
                        width: scrollStep - 7, // keep cards aligned
                        height: 320,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <CustomCard length={eventsToRender.length} data={item} />
                    </Box>
                  ))
                : skeletonArray.map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rectangular"
                      sx={{
                        height: 200,
                        borderRadius: 3,
                        flex: "0 0 auto",
                        width: "45vw",
                        maxWidth: 200,
                        minWidth: 160,
                      }}
                    />
                  ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default EventsByCategory;
