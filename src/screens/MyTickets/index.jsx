import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { convertDate, currencyJson } from "../../lib/helper";
import { useNavigate } from "react-router-dom";
import TicketSmallCard from "../../components/TicketSmallCard";
import Toggle from "../../components/Toggle";
import {
  getOldTickets,
  getUpcomingTickets,
} from "../../services/ticketHistory";
import { selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import { Style } from "./style";
import { useTranslation } from "react-i18next";
import TicketCard from "./TicketCard";
const MyTickets = () => {



  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const { language } = useSelector(selectUser);
  const navigate = useNavigate();
  const [isComming, setIsComming] = useState(true);
  const [loading, setLoading] = useState(true);
  const [oldTickets, setOldTickets] = useState({ data: [], current_page: 0, next_page_url: null });
const [upcomingTickets, setUpcomingTickets] = useState({ data: [], current_page: 0, next_page_url: null });


  const { token } = useSelector(selectUser);

  const handleHistoryFetch = async () => {
  // pick which set we are working with
  const isUpcoming = isComming;
  const target = isUpcoming ? upcomingTickets : oldTickets;

  // if no next page, stop
  if (target?.next_page_url === null && target?.current_page) return;

  // determine which page to fetch
  const nextPage = target?.current_page ? target.current_page + 1 : 1;

  // call the right endpoint
  const res = isUpcoming
    ? await getUpcomingTickets({ token, page: nextPage, number: 12 })
    : await getOldTickets({ token, page: nextPage, number: 12 });

  const data = res?.data?.data;
  const newItems = data?.data || [];

  // update the right state
  if (isUpcoming) {
    setUpcomingTickets((prev) => ({
      ...prev,
      current_page: data?.current_page,
      next_page_url: data?.next_page_url,
      data: [...prev.data, ...newItems],
    }));
  } else {
    setOldTickets((prev) => ({
      ...prev,
      current_page: data?.current_page,
      next_page_url: data?.next_page_url,
      data: [...prev.data, ...newItems],
    }));
  }

  setLoading(false);
};

  useEffect(() => {
    if (token) {
      handleHistoryFetch();
    }
  }, []);

  let ticketsData = isComming ? upcomingTickets : oldTickets;
  console.log("data we have ", ticketsData)
  const isArabic = language === "ar";
  return (
    <Box sx={Style.main}>
      <Typography
        sx={{
          position: "relative",
          width: "calc(100% - 25px)",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography
          component={"span"}
          sx={{
            display: { xs: "flex", md: "none" },
            position: "absolute",
            width: "100%",
            top: "0px",
          }}
        >
          <ArrowBackIcon
            onClick={() => navigate(-1)}
            style={{
              ...Style.icon,
              fontSize: "30px",
            }}
          />
        </Typography>
        <Typography component={"span"} sx={Style.heading(isArabic)}>
          {t("my_ticket_page.my_tickets")}
        </Typography>
      </Typography>
      <Toggle isComming={isComming} setIsComming={setIsComming} />
      {loading ? (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      ) : !ticketsData?.data?.length ? (
        <>
          <Box
            component={"img"}
            src={IMAGES.noTickets}
            sx={Style.noTicketsImg}
          />
          <Typography sx={Style.StatusText(isArabic)}>
            {t("my_ticket_page.no_tickets_yet")}
          </Typography>
          <Typography sx={Style.message(isArabic)}>
            {t("my_ticket_page.no_ticket_message")}
          </Typography>
        </>
      ) : (
        <Box sx={Style.cardWrapperContainer}>
          <InfiniteScroll
            dataLength={ticketsData?.data?.length}
            next={handleHistoryFetch}
            hasMore={!!ticketsData?.next_page_url}
            loader={
              <Box
                sx={{
                  textAlign: "center",
                  marginY: 5,
                  flex: 1,
                }}
              >
                <CircularProgress size={50} color="secondary" />
              </Box>
            }
            style={Style.cardWrapper}
          >
            <Grid container spacing={2} justifyContent="center">
            {ticketsData?.data?.map((item, index) => (
             <TicketCard
  key={index}
  data={{
    eventName: item.ticket?.event?.translation?.[language]?.name,
    ticketType: item?.ticket?.is_free ? `${t("event_detail_page.free")} ` : item?.ticket?.translation?.[language]?.name,
    dateTime: `${item?.ticket?.event?.event_date} ${item.ticket?.event?.event_time}`,
    qty: item?.qty,
    price: item?.ticket?.is_free ? t("event_detail_page.free") : `${item?.price} ${currencyJson?.[item?.currency]?.[language]}`,
    venue: item.ticket?.event?.category?.translation?.en?.name,
    address: item.ticket?.event?.translation?.en?.address,
    ticketId: item.id,
    eventImage: item?.ticket?.event?.full_image,
    qr: item,
  }}
/>

            ))}
          </Grid>

          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
};

export default MyTickets;
