import React from "react";
import { Box } from "@mui/material";
import TicketQR from "../../components/Modals/TicketQR";

const TicketCard = ({ data }) => {
      const [open, setOpen] = React.useState(false);
      const qrSrc = data?.qr_code?.full_qr_code || data?.qr?.qr_code?.full_qr_code;

  return (
    <Box

      sx={{ width: "100%",p:2, maxWidth: 320, mx: "auto", cursor: "pointer" }}
    >
      <svg
        className="ticket-svg"
        viewBox="0 0 300 420"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "auto",
          filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.25))",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="0.5" fill="#444" />
          </pattern>
        </defs>

        {/* Main Ticket Shape */}
        <path
          d="M 20 0 L 280 0 Q 300 0 300 20 L 300 180 Q 285 180 285 195 Q 285 210 300 210 L 300 400 Q 300 420 280 420 L 20 420 Q 0 420 0 400 L 0 210 Q 15 210 15 195 Q 15 180 0 180 L 0 20 Q 0 0 20 0 Z"
          fill="#242423"
          filter="url(#glow)"
        />

        {/* Header Image */}
        <image
          href={data?.eventImage || "/placeholder-event.png"}
          x="15"
          y="15"
          width="270"
          height="80"
          preserveAspectRatio="xMidYMid slice"
          clipPath="inset(0 round 8)"
        />

        {/* Event Name */}
        <text
          x="150"
          y="125"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#FFBA83"
        >
          {data?.eventName || "Event Title"}
        </text>

        {/* Ticket Type */}
        <text
          x="150"
          y="145"
          textAnchor="middle"
          fontSize="10"
          fill="#fff"
        >
          {data?.ticketType || "General"}
        </text>

        {/* Date and Time */}
        <text
          x="150"
          y="165"
          textAnchor="middle"
          fontSize="9"
          fill="#ddd"
        >
          {data?.dateTime || "SAT, JUL 15, 7:00 PM"}
        </text>

        {/* Dotted Separator */}
        <line
          x1="25"
          y1="185"
          x2="275"
          y2="185"
          stroke="url(#dots)"
          strokeWidth="2"
        />

        {/* Quantity */}
        <text x="25" y="210" fontSize="10" fill="#fff">
          QTY: {data?.qty || 1}
        </text>

        {/* Price */}
        <text
          x="275"
          y="210"
          textAnchor="end"
          fontSize="14"
          fontWeight="700"
          fill="#FFBA83"
        >
          {data?.price || "$0.00"}
        </text>

        {/* Venue Info */}
        <text x="25" y="230" fontSize="8" fill="#ccc">
          {data?.venue || "Venue Name"}
        </text>
        <text x="25" y="245" fontSize="8" fill="#ccc">
          {data?.address || "Venue Address"}
        </text>

        {/* Ticket ID */}
        <text x="25" y="265" fontSize="8" fill="#777">
          TICKET ID: {data?.ticketId || "ID-XXXXXX"}
        </text>

        {/* Dotted Separator */}
        <line
          x1="25"
          y1="280"
          x2="275"
          y2="280"
          stroke="url(#dots)"
          strokeWidth="2"
        />

        {/* QR Placeholder */}
        <image
        onClick={() => setOpen(true)}

          href={qrSrc}
          x="125"   // adjust position
          y="300"
          width="50"
          height="50"
        />
       
        

        {/* Footer */}
        <text
          x="150"
          y="390"
          textAnchor="middle"
          fontSize="6"
          fill="#666"
        >
          VALID FOR ONE-TIME USE ONLY
        </text>
        <text
          x="150"
          y="405"
          textAnchor="middle"
          fontSize="6"
          fill="#666"
        >
          NO REFUNDS • KEEP THIS TICKET
        </text>
      </svg>
      <TicketQR open={open} setOpen={setOpen} data={data} />
      
    </Box>
  );
};

export default TicketCard;
