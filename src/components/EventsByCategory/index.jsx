import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import CustomCard from "../CustomCard";

const EventsByCategory = ({ eventsData, loader, skeletonArray, language }) => {
  const [eventsGrouped, setEventsGrouped] = useState({});
  const scrollRefs = useRef({});
  const snapTimeouts = useRef({});
  const scrollLoopRefs = useRef({});
  const autoScrollTimers = useRef({});
  const touchPauseTimers = useRef({}); // NEW - to resume scrolling after touch
  const isPaused = useRef({}); // Track paused state per category
  const scrollStep = 282;

  // Group events by category
  useEffect(() => {
    const grouped = eventsData.reduce((acc, ev) => {
      const catId = ev.category?.id || "uncategorized";
      if (!acc[catId]) {
        acc[catId] = {
          category: ev.category || {
            id: "uncategorized",
            translation: {
              en: { name: "Uncategorized" },
              ar: { name: "غير مصنف" },
            },
          },
          events: [],
        };
      }
      acc[catId].events.push(ev);
      return acc;
    }, {});

    setEventsGrouped(grouped);
  }, [eventsData]);

  const smoothScroll = (element, distance, duration = 500, callback) => {
    let start = element.scrollLeft;
    let change = distance;
    let currentTime = 0;
    const increment = 16;

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animate = () => {
      currentTime += increment;
      let val = easeInOutQuad(Math.min(currentTime / duration, 1));
      element.scrollLeft = start + change * val;

      if (currentTime < duration) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    };

    animate();
  };

  const handleSnap = (catId) => {
    const container = scrollRefs.current[catId];
    if (!container) return;

    clearTimeout(snapTimeouts.current[catId]);

    snapTimeouts.current[catId] = setTimeout(() => {
      const current = container.scrollLeft;
      const snapTo = Math.round(current / scrollStep) * scrollStep;
      smoothScroll(container, snapTo - current, 300);
    }, 150);
  };

  const stopAutoScroll = (catId) => {
    if (autoScrollTimers.current[catId]) {
      clearTimeout(autoScrollTimers.current[catId]);
      autoScrollTimers.current[catId] = null;
    }
  };

  // NEW: pause and resume handling
  const handleTouchStart = (catId) => {
    isPaused.current[catId] = true;
    stopAutoScroll(catId);
    if (touchPauseTimers.current[catId]) {
      clearTimeout(touchPauseTimers.current[catId]);
    }
  };

  const handleTouchEnd = (catId) => {
    // Resume auto scroll after 3 seconds
    touchPauseTimers.current[catId] = setTimeout(() => {
      isPaused.current[catId] = false;
      if (scrollLoopRefs.current[catId]) scrollLoopRefs.current[catId]();
    }, 3000);
  };

  // Auto-scroll per category
  useEffect(() => {
    Object.keys(eventsGrouped).forEach((catId) => {
      const container = scrollRefs.current[catId];
      if (!container) return;

      const pauseTime = 3000;

      const scrollLoop = () => {
        if (isPaused.current[catId]) return; // respect pause
        let nextScrollLeft = container.scrollLeft + scrollStep;
        if (nextScrollLeft > container.scrollWidth - container.clientWidth) {
          nextScrollLeft = 0;
        }

        smoothScroll(container, nextScrollLeft - container.scrollLeft, 600, () => {
          autoScrollTimers.current[catId] = setTimeout(scrollLoop, pauseTime);
        });
      };

      scrollLoopRefs.current[catId] = scrollLoop;

      // start with random delay
      autoScrollTimers.current[catId] = setTimeout(
        scrollLoop,
        Math.random() * 3000
      );
    });

    return () => {
      Object.values(autoScrollTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
      Object.values(touchPauseTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, [eventsGrouped]);

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 8 }}>
      {Object.values(eventsGrouped).map((group) => {
        const catId = group.category?.id || "uncategorized";

        // const eventsToRender =
        //   group.events.length === 1
        //     ? Array(6).fill(group.events[0])
        //     : group.events;
const eventsToRender = group.events;
        return (
          <Box key={catId} sx={{ mb: 2 }}>
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
              {group.category?.translation?.[language]?.name ||
                "Uncategorized"}
            </Typography>

            <Box
              ref={(el) => (scrollRefs.current[catId] = el)}
              onScroll={() => handleSnap(catId)}
              onTouchStart={() => handleTouchStart(catId)}
              onTouchEnd={() => handleTouchEnd(catId)}
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
                        width: scrollStep - 7,
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
