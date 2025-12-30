import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
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

const MyTickets = () => {
  // Dummy ticket data for testing
const dummyTickets = [
  {
    id: "TICKET-001",
    qr_code: {
      full_qr_code: "https://www.shutterstock.com/image-vector/qr-code-isolated-on-white-600w-2429446241.jpg", // local image
    },
    ticket: {
      is_free: false,
      price: 50,
      currency: "USD",
      qty: 2,
      translation: {
        en: { name: "VIP Ticket" },
        ar: { name: "تذكرة كبار الشخصيات" },
      },
      event: {
        event_date: "2025-09-10T18:30:00Z",
        event_time: "18:30",
        full_image: "/images/placeholder.png",
        translation: {
          en: { name: "Music Concert", address: "123 Main St" },
          ar: { name: "حفل موسيقي", address: "١٢٣ الشارع الرئيسي" },
        },
        category: {
          translation: {
            en: { name: "Concert" },
            ar: { name: "حفلة" },
          },
        },
        map: "https://maps.google.com", // optional, for open map click
      },
    },
  },
  {
    id: "TICKET-002",
    qr_code: {
      full_qr_code: "https://www.shutterstock.com/image-vector/qr-code-isolated-on-white-600w-2429446241.jpg",
    },
    ticket: {
      is_free: true,
      qty: 1,
      translation: {
        en: { name: "Free Ticket" },
        ar: { name: "تذكرة مجانية" },
      },
      event: {
        event_date: "2025-09-12T20:00:00Z",
        event_time: "20:00",
        full_image: "/images/placeholder.png",
        translation: {
          en: { name: "Art Exhibition", address: "456 Art St" },
          ar: { name: "معرض فني", address: "٤٥٦ شارع الفن" },
        },
        category: {
          translation: {
            en: { name: "Exhibition" },
            ar: { name: "معرض" },
          },
        },
        map: "https://maps.google.com",
      },
    },
  },
];


  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const { language } = useSelector(selectUser);
  const navigate = useNavigate();
  const [isComming, setIsComming] = useState(true);
  const [loading, setLoading] = useState(true);
  const [oldTickets, setOldTickets] = useState({
    data: [],
  });
  const [upcomingTickets, setUpcomingTickets] = useState({
    data: [],
  });
  const { token } = useSelector(selectUser);

  const handleHistoryFetch = async () => {
    // const getOldTicketsData = await getOldTickets({
    //   token,
    //   page: oldTickets?.current_page || 1,
    //   number: 12,
    // });
    // const getUpcomigTickets = await getUpcomingTickets({
    //   token,
    //   page: upcomingTickets?.current_page || 1,
    //   number: 12,
    // });
    // Promise.all([getOldTicketsData, getUpcomigTickets]).then(
    //   ([oldTicketsRes, upcomigTicketsRes]) => {
    //     setLoading(false);
    //     setUpcomingTickets((prev) => ({
    //       ...prev,
    //       ...upcomigTicketsRes?.data?.data,
    //       data: [...prev?.data, ...upcomigTicketsRes?.data?.data?.data],
    //     }));
    //     setOldTickets((prev) => ({
    //       ...prev,
    //       ...oldTicketsRes?.data?.data,
    //       data: [...prev?.data, ...oldTicketsRes?.data?.data?.data],
    //     }));
    //   }
    // );
     setLoading(false);
  setUpcomingTickets({
    data: dummyTickets,
    current_page: 1,
    next_page_url: null,
  });
  setOldTickets({
    data: dummyTickets,
    current_page: 1,
    next_page_url: null,
  });
  };
  useEffect(() => {
    if (token) {
      handleHistoryFetch();
    }
  }, []);

  let ticketsData = isComming ? upcomingTickets : oldTickets;
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
            <Grid container spacing={0} sx={Style.gridContainer(isArabic)}>
              {ticketsData?.data?.map((item, index) => {
                return <TicketSmallCard data={item} key={index} />;
              })}
            </Grid>
          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
};

export default MyTickets;
