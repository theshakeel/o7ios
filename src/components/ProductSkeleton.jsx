import React from "react";
import { IMAGES } from "../theme";

const ProductSkeleton = ({
  width = "100%",   // 80% of parent
  height = "100%", // 80% of parent
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
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 375 812" id="CardDark" style={{ width: "100%", height: "100vh", filter: "none" }}>
  <rect width="375" height="812" fill="#212121" rx="0" />
  <rect width="335" height="200" x="20" y="20" fill="#fff" fillOpacity="0.1" rx="12" />
  <path
    fill="#fff"
    fillRule="evenodd"
    d="M217.5 157.5V102.5c0-3.5-2.9-6.4-6.4-6.4H160.9c-3.5 0-6.4 2.9-6.4 6.4v55c0 3.5 2.9 6.4 6.4 6.4h50.2c3.5 0 6.4-2.9 6.4-6.4Zm-40-17.6l8 9.6L200 130l14.4 19.2H160.9l11.2-14.4Z"
    clipRule="evenodd"
    opacity="0.2"
  />
  <g fill="#fff" opacity="0.5">
    <rect width="120" height="16" x="20" y="260" rx="8" />
    <rect width="80" height="16" x="150" y="260" rx="8" />
    <rect width="60" height="16" x="240" y="260" rx="8" />
  </g>
  <rect width="100" height="12" x="20" y="300" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="140" height="12" x="130" y="300" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="80" height="12" x="280" y="300" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="90" height="12" x="20" y="330" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="110" height="12" x="120" y="330" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="100" height="12" x="240" y="330" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="160" height="12" x="20" y="360" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="120" height="12" x="190" y="360" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="130" height="12" x="20" y="390" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="90" height="12" x="160" y="390" fill="#fff" fillOpacity="0.2" rx="6" />
  <rect width="80" height="12" x="260" y="390" fill="#fff" fillOpacity="0.2" rx="6" />
  <g fill="#fff" opacity="0.1">
    <circle cx="35" cy="450" r="15" />
    <rect width="80" height="10" x="60" y="445" rx="5" />
    <rect width="120" height="8" x="60" y="465" rx="4" />
  </g>
  <g fill="#fff" opacity="0.1">
    <circle cx="35" cy="510" r="15" />
    <rect width="100" height="10" x="60" y="505" rx="5" />
    <rect width="140" height="8" x="60" y="525" rx="4" />
  </g>
  <g fill="#fff" opacity="0.1">
    <circle cx="35" cy="570" r="15" />
    <rect width="90" height="10" x="60" y="565" rx="5" />
    <rect width="110" height="8" x="60" y="585" rx="4" />
  </g>
</svg>

)}
      </div>
    </>
  );
};

export default ProductSkeleton;
