import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PartnerGallery from './PartnerGallery'; 
import { Box, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import { PiShareFat, PiTicket } from "react-icons/pi";
import ImgsViewer from "react-images-viewer";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CustomButton,
  MobileNumberModal,
  ShareEvent,
  TicketDateTag,
} from "../../components";
import BuyTicket from "../../components/Modals/BuyTicket";
import { convertDate, currencyJson, getLeastPrice } from "../../lib/helper";
import { getSingleEvent } from "../../services/data/events";
import { selectUser } from "../../store/slice/user";
import Style from "./style";
import "./style.css";
import ProductSkeleton from "../../components/ProductSkeleton";
import Skeleton from "../../components/Skeleton";

import {
  addEventToFavourite,
  removeEventToFavourite,
} from "../../services/favourite";
import toast from "react-hot-toast";

import ReactImageVideoLightbox from "react-image-video-lightbox";
import { useTranslation } from "react-i18next";
  
const EventDetails = () => {
  const { id } = useParams();
  const { language, token } = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [loadSaveBtn, setLoadSaveBtn] = useState(false);
  const [event, setEvent] = useState();
  const { t } = useTranslation();
  const { day, month } = convertDate(event?.event_date, t);
  const [anchorEl, setAnchorEl] = useState(null);
  const leastPrice = getLeastPrice(event?.tickets);
  const [buyTicketModal, setBuyTicketModal] = React.useState(false);
  const [loginModal, setLoginModal] = React.useState(false);
  const [ind, setInd] = useState(0);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
   const [loaded, setLoaded] = useState(false);
  const [imageViewerModal, setImageViewerModal] = useState({
    gallery: false,
    people: false,
    partner: false,
  });

  const galleryImages = !!event?.full_video
    ? [{ url: event?.full_video, type: "video" }]
    : [];
  event?.gallery?.map((item) => {
    return galleryImages.push({ url: item?.full_image, type: "photo" });
  });

  const peopleImages = [];
  event?.peoples?.map((item) => {
    return peopleImages.push({ src: item?.full_image });
  });

  const partnerImages = [];
  event?.partners?.map((item) => {
    return partnerImages.push({ src: item?.full_image });
  });

  const shareEventOpen = Boolean(anchorEl);
  const buyTikcet = () => {
    if (token) {
      setBuyTicketModal(true);
    } else {
      setLoginModal(true);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFavaoriteClick = async () => {
    if (event.favorite) {
      return await removeEventToFavourite(token, event?.id);
    } else {
      return await addEventToFavourite(
        {
          event: event?.id,
        },
        token
      );
    }
  };
  const handleSaveEvent = async () => {
    if (token) {
      if (!loadSaveBtn) {
        setLoadSaveBtn(true);
        await handleFavaoriteClick()
          .then((res) => {
            if (res.data.status) {
              setEvent((prev) => ({ ...prev, favorite: !prev?.favorite }));
            }
            toast.success(
              event.favorite
                ? "Event has been removed from favorite!"
                : "Event Saved Successfully!"
            );
            setLoadSaveBtn(false);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.data?.message);
            setLoadSaveBtn(false);
          });
      }
    } else {
      setLoginModal(true);
    }
  };

  const fetchEventDetails = async () => {
    await getSingleEvent(id, token)
      .then((res) => {
        setEvent(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Event not found!");
        setLoading(false);
        navigate("/");
      });
  };
  useEffect(() => {
    // mixpanel?.track("event-details", {
    //   email: user?.email,
    //   name: user?.name || "anonymous",
    // });
    if (id) {
      fetchEventDetails();
    }
  }, []);
  useEffect(() => {
    const element = document?.querySelectorAll(".css-jndv62")[0];
    if (element) {
      element.children[0].style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      element.children[0].style.zIndex = "2";
    }
  }, [imageViewerModal.gallery]);
  const isArabic = language === "ar";
  console.log("we have event in eventDetails", event)
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ProductSkeleton />
        {/* <CircularProgress size={100} color="secondary" /> */}
      </Box>
    );
  return (
  <Box sx={{ bgcolor: "#0E0E0E", color: "#fff", minHeight: "100vh" }}>
    {/* Hero Section */}
    <Box sx={{ position: "relative" }}>
       {!loaded && (
        <Skeleton
          width="100%"
          height="300px"
          variant="wave"
          showSvg={true}
          className="skeleton-image"
        />
      )}

      <Box
        component="img"
        src={event?.full_image}
        alt="Event"
        onLoad={() => setLoaded(true)}
        sx={{ marginBottom: "10px",borderRadius:"20px",display: loaded ? "block" : "none",width: "100%", height: "300px", objectFit: "cover" }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.2))",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        {/* Back button */}
        <ArrowBackIcon
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            fontSize: 30,
            cursor: "pointer",
          }}
        />

        {/* Floating Actions */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 2,
          }}
        >
          <PiShareFat
            onClick={handleClick}
            style={{ fontSize: 26, cursor: "pointer" }}
          />
          <Box onClick={handleSaveEvent}>
            {event.favorite ? (
              <LiaHeartSolid color="#FF4D67" style={{ fontSize: 26 }} />
            ) : (
              <LiaHeart style={{ fontSize: 26 }} />
            )}
          </Box>
        </Box>

        {/* Event Info */}
        <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
          {event?.category?.translation?.[language]?.name}
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: "bold", mb: 0.5 }}>
          {event?.translation?.[language]?.name}
        </Typography>
        <Link
          to={event?.map}
          target="_blank"
          style={{ textDecoration: "none", color: "#bbb" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IoLocationOutline style={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 13 }}>
              {event?.translation?.[language]?.address}
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>

    {/* Quick Info Section */}
    {/* Quick Info Section */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
    bgcolor: "#1A1A1A",
    borderRadius: 2,
  }}
>
  {/* Ticket Price */}
  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: 12, opacity: 0.6, mb: 0.5 }}>
      {t("event_detail_page.ticket_price")}
    </Typography>
    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
      {event.start_price.is_free
        ? t("event_detail_page.free")
        : `${leastPrice} ${currencyJson?.[event?.tickets?.[0]?.currency]?.[language]}`}
    </Typography>
  </Box>

  {/* Event Time */}
  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: 12, opacity: 0.6, mb: 0.5 }}>
      {t("event_detail_page.time")}
    </Typography>
    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
      {event?.event_time}
    </Typography>
  </Box>

  {/* Date Tag */}
  <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
  <Box
    sx={{
      bgcolor: "#FFBA83",
      color: "#1E2324",
      borderRadius: 2,
      px: 0,
      py: 1,
      minWidth: 80,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(255, 186, 131, 0.5)",
    }}
  >
    <Typography sx={{ fontSize: 18, fontWeight: "bold", lineHeight: 1 }}>
      {day}
    </Typography>
    <Typography sx={{ fontSize: 12, textTransform: "uppercase", lineHeight: 1, mt: 0.25 }}>
      {month}
    </Typography>
  </Box>
</Box>

</Box>


    {/* Content */}
    <Box sx={{ p: 2 }}>
      {/* Gallery */}
      {!!galleryImages?.length && (
        <>
          <Typography sx={{ mb: 1, fontWeight: "bold" }}>
            {t("event_detail_page.gallery")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              scrollSnapType: "x mandatory",
            }}
          >
            {event?.full_video && (
              <video
                width="140"
                style={{
                  borderRadius: 8,
                  objectFit: "cover",
                  scrollSnapAlign: "start",
                }}
                poster="https://yachteskills.com/wp-content/themes/yacht/images/video-thumbnail-default.png"
                onClick={() => {
                  setImageViewerModal({ gallery: true });
                  setInd(0);
                }}
              >
                <source src={event.full_video} />
              </video>
            )}
            {galleryImages.map((item, index) => (
              <Box
                key={index}
                component="img"
                src={item.url}
                sx={{
                  width: 140,
                  height: 100,
                  borderRadius: 2,
                  objectFit: "cover",
                  cursor: "pointer",
                  scrollSnapAlign: "start",
                }}
                onClick={() => {
                  setImageViewerModal({ gallery: true });
                  setInd(index);
                }}
              />
            ))}
          </Box>
        </>
      )}

      {/* People */}
      {!!peopleImages.length && (
        <>
          <Typography sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
            {t("event_detail_page.guests_attendees")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
            {peopleImages.map((item, index) => (
              <Box
                key={index}
                component="img"
                src={item.src}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setImageViewerModal({ people: true });
                  setInd(index);
                }}
              />
            ))}
          </Box>
        </>
      )}

<PartnerGallery
  partnerImages={partnerImages}
  t={t}
/>
      {/* Content */}
      <Typography sx={{ mt: 3, fontWeight: "bold", mb: 1 }}>
        {t("event_detail_page.about")}
      </Typography>
      <Box
        sx={{ color: "#ccc", fontSize: 14, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{
          __html: event.translation[language]?.content,
        }}
      />

      {/* Terms */}
      {!!event.translation[language]?.terms?.length && (
        <Box sx={{ mt: 3, mb:10 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1, color: "#FFBA83" }}>
            {t("event_detail_page.terms_condition")}
          </Typography>
          <Box
            sx={{ color: "#bbb", fontSize: 13, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{
              __html: event.translation[language]?.terms,
            }}
          />
        </Box>
      )}
    </Box>

    {/* Sticky Buy Button */}
    <Box
      sx={{
        padding:"24px 0px 31px 0px",
        bgcolor: "#111",
        borderTop: "1px solid #333",
      }}
    >

<Button
  variant="contained"
  onClick={buyTikcet}
  sx={{
    backgroundColor: '#FFBA83',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    py: 1.5,
    position:"fixed",
    bottom:"5vh",
    width:"90%",
    left:"5%",
    right:"5%",
    borderRadius: 4,
    boxShadow: '0 4px 8px rgba(255, 186, 131, 0.5)',
    transition: 'all 0.3s ease',
    mb: 6,  // margin bottom ~ 48px
    "&:hover": {
      backgroundColor: '#ffb94a',
      boxShadow: '0 6px 20px rgba(255, 186, 131, 0.7)',
      transform: 'scale(1.05)',
    },
    "&:active": {
      transform: 'scale(0.95)',
    },
  }}
>
  {t("event_detail_page.buy_ticket")}
</Button>

    </Box>

    {/* Keep Modals */}
    <BuyTicket open={buyTicketModal} setOpen={setBuyTicketModal} data={event} />
    <MobileNumberModal open={loginModal} setOpen={setLoginModal} />
    <ShareEvent
      open={shareEventOpen}
      handleClose={handleClose}
      userLink={`https://o7events.com/event-details/${event?.slug}`}
      anchorEl={anchorEl}
    />
    {/* viewers unchanged */}
    {/* Image ---------------------viewers */}
      {/* gallery viewer */}
      {!imageViewerModal.gallery ? (
        false
      ) : (
        <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
          <ReactImageVideoLightbox
            data={galleryImages}
            startIndex={ind}
            onClickPrev={() => setInd(ind - 1)}
            onClickNext={() => setInd(ind + 1)}
            onCloseCallback={() => setImageViewerModal(false)}
            width={500}
          />
        </Box>
      )}
      {/* partner images viewer */}
      <ImgsViewer
        imgs={partnerImages}
        currImg={ind}
        isOpen={imageViewerModal.partner}
        onClickPrev={() => setInd(ind - 1)}
        onClickNext={() => setInd(ind + 1)}
        onClose={() => setImageViewerModal(false)}
        width={500}
      />
      {/* people images viewer */}
      <ImgsViewer
        imgs={peopleImages}
        currImg={ind}
        isOpen={imageViewerModal.people}
        onClickPrev={() => setInd(ind - 1)}
        onClickNext={() => setInd(ind + 1)}
        onClose={() => setImageViewerModal(false)}
        width={500}
      />
  </Box>
);

};
export default EventDetails;
