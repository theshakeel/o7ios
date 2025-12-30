import * as React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
// import { Box, Card, CardContent, Typography, Skeleton } from "@mui/material";
// import { IoLocationOutline } from "react-icons/io5";
// import { LiaHeart, LiaHeartSolid } from "react-icons/lia";

import { IoLocationOutline } from "react-icons/io5";
import { Style } from "./style";
import { TicketDateTag } from "..";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slice/user";
import { convertDate, currencyJson, getLeastPrice } from "../../lib/helper";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import {
  addEventToFavourite,
  removeEventToFavourite,
} from "../../services/favourite";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Skeleton from "../Skeleton"; // 👈 import your skeleton

const CustomCard = ({ length, data, favoritePage, sx, childSx }) => {
  const { language, token } = useSelector(selectUser);
  // console.log("we have data in custom card ", data, language)
  const startingPrice = getLeastPrice(data.tickets);
  const navigate = useNavigate();
  const [favorite, selectFavorite] = useState(true);
  const { t } = useTranslation();
  const { day, month } = convertDate(data.event_date, t);

  // 👇 state to handle image loading
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleFavaoriteClick = async () => {
    if (favorite) {
      return await removeEventToFavourite(token, data?.id);
    } else {
      return await addEventToFavourite(
        {
          event: data?.id,
        },
        token
      );
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    await handleFavaoriteClick()
      .then((res) => {
        if (res.data.status) {
          selectFavorite((prev) => !prev);
          toast.success(
            favorite
              ? "Event has been removed from favorite!"
              : "Event Saved Successfully!"
          );
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.data?.message);
      });
  };

  const isArabic = language === "ar";

  // image URL

const imageUrl =
  data.full_image ||
  `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;

return (
  <Box>
    <Card
      onClick={() => navigate(`/event-details/${data.slug}`)}
      sx={{
        position: "relative",
        width: "100%",
        height: "320px",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {/* Skeleton placeholder */}
      {!isImageLoaded && (
                  <Skeleton width="100%" height="200px" variant="wave" />
        
      )}

      {/* Background Image */}
       <img
          src={imageUrl}
          alt={data?.translation[language]?.name}
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
            borderRadius: "8px",
            display: isImageLoaded ? "block" : "none",
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
      {/* Overlay Gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Date Tag (your existing component) */}
      <TicketDateTag
        date={day}
        month={month}
        sx={Style.ticketDateTag(isArabic)}
        dateSx={Style.date(isArabic)}
        monthSx={Style.month(isArabic)}
      />

      {/* Favourite Icon */}
      <Box sx={{ position: "absolute", top: "16px", right: "16px", zIndex: 10 }}>
        {favoritePage &&
          (favorite ? (
            <LiaHeartSolid color="#fff" size={32} onClick={handleFavorite} />
          ) : (
            <LiaHeart color="#fff" size={32} onClick={handleFavorite} />
          ))}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          color: "#fff",
          zIndex: 10,
        }}
      >
        {/* Category Tag */}
        <Box
          sx={{
            display: "inline-block",
            background: "rgba(255,186,131,0.9)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: 1.2,
            
          }}
        >
          {data?.category?.translation?.[language]?.name}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: "1.8rem",
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {data?.translation?.[language]?.name}
        </Typography>

        {/* Location */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.9rem",
            fontWeight: 500,
            mb: 1,
            opacity: 0.9,
          }}
        >
          <IoLocationOutline />
          <span>{data?.translation?.[language]?.address}</span>
        </Box>

        {/* Price Info */}
        <Box
          sx={{
            background: "rgba(255,186,131,0.9)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "12px",
            fontWeight: 800,
            textAlign: "center",
            display: "inline-block",
          }}
        >
          {startingPrice || data?.start_price?.price}{" "}
          {
            currencyJson?.[
              data?.tickets?.[0]?.currency || data?.start_price?.currency
            ]?.[language]
          }
        </Box>
      </CardContent>
    </Card>

    {/* Event Name under card */}
    <Typography sx={{...Style.eventName(isArabic), color:"white !important"}}>
      {data?.translation[language]?.name}
    </Typography>
  </Box>
);

};

export default CustomCard;
