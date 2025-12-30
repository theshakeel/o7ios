import * as React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
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
  const imageUrl = data.full_image || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;

  return (
    <Box>
      <Box sx={{ position: "relative", height: "200px", width: "100%" }}>
        {/* Skeleton placeholder until image loads */}
        {!isImageLoaded && (
          <Skeleton width="100%" height="200px" variant="wave" />
        )}

        {/* Actual image (hidden until loaded) */}
        <img
          src={imageUrl}
          alt={data?.translation[language]?.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            display: isImageLoaded ? "block" : "none",
          }}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Overlay Card */}
        <Card
          onClick={() => navigate(`/event-details/${data.slug}`)}
          sx={{ ...Style.card(), ...childSx, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
          <TicketDateTag
            date={day}
            month={month}
            sx={Style.ticketDateTag(isArabic)}
            dateSx={Style.date(isArabic)}
            monthSx={Style.month(isArabic)}
          />
          <Box sx={Style.favouriteIcon(isArabic)}>
            {favoritePage &&
              (favorite ? (
                <LiaHeartSolid color="#fff" size={40} onClick={handleFavorite} />
              ) : (
                <LiaHeart color="#fff" size={40} onClick={handleFavorite} />
              ))}
          </Box>
          <CardContent sx={Style.cardContent(isArabic)}>
            <Typography sx={Style.name(isArabic)}>
              {data?.category?.translation?.[language]?.name}
            </Typography>
            <Typography sx={Style.startPeriod(isArabic)}>
              <Box component={"span"} fontWeight={400}>
                {t("home_page.start_from")}
              </Box>
              <Box component={"span"}>
                {" "}
                {startingPrice || data?.start_price?.price}{" "}
              </Box>
              <Box component={"span"} fontSize={"10px"}>
                {
                  currencyJson?.[
                    data?.tickets?.[0]?.currency || data?.start_price?.currency
                  ]?.[language]
                }
              </Box>
            </Typography>
            <Typography sx={Style.location(isArabic)}>
              <IoLocationOutline />
              <Typography component={"span"}>
                {data?.translation?.[language]?.address}
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography sx={Style.eventName(isArabic)}>
        {data?.translation[language]?.name}
      </Typography>
    </Box>
  );
};

export default CustomCard;
