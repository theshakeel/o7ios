import React from "react";
import { IMAGES } from "../theme";

const ImageSkeleton = ({
  width = "80%",   // 80% of parent
  height = "80%", // 80% of parent
  borderRadius = "8px",
  className = "",
  variant = "shimmer", // "shimmer", "pulse", "wave"
  showSvg = true, // if true → render svg placeholder
}) => {
  const skeletonStyles = {
    width,
    height,
    borderRadius,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a", // dark background
  };

  const getAnimationStyles = () => {
    switch (variant) {
      case "pulse":
        return {
          animation: "skeleton-pulse 1.5s ease-in-out infinite",
        };
      case "wave":
        return {
          background:
            "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-wave 2s ease-in-out infinite",
        };
      default: // shimmer
        return {
          background:
            "linear-gradient(90deg, #1a1a1a 25%, #333333 50%, #1a1a1a 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.5s ease-in-out infinite",
        };
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes skeleton-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes skeleton-wave {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>

      <div
        className={`image-skeleton ${className}`}
        style={{
          ...skeletonStyles,
          ...getAnimationStyles(),
        }}
        role="img"
        aria-label="Loading content..."
      >
        {showSvg && (
          <img
            src={IMAGES.svg}
            alt="Loading placeholder"
            style={{
              width: "60%",
              height: "60%",
              objectFit: "contain",
              opacity: 0.7,
              filter: "invert(1) brightness(0.8)", // makes SVG visible on dark bg
            }}
          />
        )}
      </div>
    </>
  );
};

export default ImageSkeleton;
