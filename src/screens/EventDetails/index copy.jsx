import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, CircularProgress, Typography } from "@mui/material";
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

import {
  addEventToFavourite,
  removeEventToFavourite,
} from "../../services/favourite";
import toast from "react-hot-toast";

import ReactImageVideoLightbox from "react-image-video-lightbox";
import { useTranslation } from "react-i18next";
//   
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
  // useEffect(() => {
  //   mixpanel?.track("event-details", {
  //     email: user?.email,
  //     name: user?.name || "anonymous",
  //   });
  //   if (id) {
  //     fetchEventDetails();
  //   }
  // }, []);
  useEffect(() => {
    const element = document?.querySelectorAll(".css-jndv62")[0];
    if (element) {
      element.children[0].style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      element.children[0].style.zIndex = "2";
    }
  }, [imageViewerModal.gallery]);
  const isArabic = language === "ar";
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
        <CircularProgress size={100} color="secondary" />
      </Box>
    );
  return (
    <Box sx={Style.eventDetail(isArabic)}>
      <Box sx={Style.eventDetailScrollBox}>
        <Box sx={Style.ImageBox}>
          <Typography sx={Style.hiddenNavbar}>
            <Typography component={"span"}>
              <ArrowBackIcon
                onClick={() => navigate("/")}
                style={{ ...Style.icon, fontSize: "30px" }}
              />
            </Typography>
            <Typography
              component={"span"}
              sx={{ display: "flex", gap: "10px" }}
            >
              <PiShareFat
                onClick={handleClick}
                style={{ ...Style.icon, fontSize: "30px" }}
              />
              <Box component={"span"} onClick={handleSaveEvent}>
                {event.favorite ? (
                  <LiaHeartSolid
                    color="#fff"
                    style={{ ...Style.icon, fontSize: "30px" }}
                  />
                ) : (
                  <LiaHeart style={{ ...Style.icon, fontSize: "30px" }} />
                )}
              </Box>
            </Typography>
          </Typography>
          <Box component={"img"} src={event?.full_image} sx={Style.Image} />
          <Box sx={Style.grayscale} />
          <Box sx={Style.hiddenLabelBox(isArabic)}>
            <Box sx={Style.hiddenTypoContainer}>
              <Typography sx={Style.musicalTypo(isArabic)}>
                {event?.category?.translation?.[language]?.name}
              </Typography>
              <Typography sx={Style.hiddenTypoHeading(isArabic)}>
                {event?.translation?.[language]?.name}
              </Typography>
              <Link
                style={Style.locationLink}
                to={event?.map}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box sx={Style.locationContainer(isArabic)}>
                  <IoLocationOutline />
                  <Typography sx={Style.hiddenLocation(isArabic)}>
                    {event?.translation?.[language]?.address}
                  </Typography>
                </Box>
              </Link>
              <Typography sx={Style.location(isArabic)}>
                <PiTicket style={Style.icon} />
                {event.start_price.is_free
                  ? `${t("event_detail_page.free")} `
                  : `${t("event_detail_page.ticket_price")} ${leastPrice}${" "}
                ${currencyJson?.[event?.tickets?.[0]?.currency]?.[language]}`}
              </Typography>
              <Typography sx={Style.location(isArabic)}>
                <AccessTimeIcon style={Style.icon} />
                {event?.event_time}
              </Typography>
            </Box>
            <TicketDateTag
              dateSx={Style.whiteTagDate(isArabic)}
              monthSx={Style.whiteTagMonth(isArabic)}
              sx={Style.whiteTag(isArabic)}
              date={day}
              month={month}
            />
          </Box>
        </Box>
        <Box sx={Style.typoContainer}>
          {!!galleryImages?.length && (
            <Box sx={Style.miniCardsContainer(isArabic)}>
              <Box sx={Style.miniCards(isArabic, galleryImages?.length)}>
                {event?.full_video && (
                  <video
                    width={"96px"}
                    style={{ objectFit: "cover", cursor: "pointer" }}
                    onClick={() => {
                      setImageViewerModal({ gallery: true });
                      setInd(0);
                    }}
                    poster={
                      "https://yachteskills.com/wp-content/themes/yacht/images/video-thumbnail-default.png"
                    }
                  >
                    <source
                      src={event.full_video}
                      // type="video/webm"
                    />
                  </video>
                )}
                {/* <video  style={Style.miniCardCenter}/> */}
                {/* <Box
                  component={"video"}
                  onClick={() => {
                    setImageViewerModal({ gallery: true });
                    setInd(0);
                  }}
                  src={event?.full_video}
                /> */}
                {galleryImages
                  ?.filter((_, ind) =>
                    !!event?.full_video ? ind !== 0 : ind + 1
                  )
                  ?.map((item, index) => (
                    <Box
                      onClick={() => {
                        setImageViewerModal({ gallery: true });
                        setInd(!!event?.full_video ? index + 1 : index);
                      }}
                      sx={Style.miniCardCenter}
                      key={index}
                      component={"img"}
                      src={item?.url}
                    />
                  ))}
              </Box>
            </Box>
          )}
          {!!peopleImages.length && (
            <Box sx={Style.miniCardsContainer(isArabic)}>
              <Typography sx={Style.heading(isArabic)}>
                {t("event_detail_page.guests_attendees")}
              </Typography>
              <Box sx={Style.miniCards(isArabic, galleryImages?.length)}>
                {peopleImages.map((item, index) => (
                  <Box
                    onClick={() => {
                      setImageViewerModal({ people: true });
                      setInd(index);
                    }}
                    sx={Style.miniCardCenter}
                    key={index}
                    component={"img"}
                    src={item?.src}
                  />
                ))}
              </Box>
            </Box>
          )}
          {!!partnerImages.length && (
            <Box sx={Style.miniCardsContainer(isArabic)}>
              <Typography sx={Style.heading(isArabic)}>
                {t("event_detail_page.partners")}
              </Typography>
              <Box sx={Style.miniCards(isArabic, galleryImages?.length)}>
                {partnerImages?.map((item, index) => (
                  <Box
                    onClick={() => {
                      setImageViewerModal({ partner: true });
                      setInd(index);
                    }}
                    sx={Style.miniCardCenter}
                    key={index}
                    component={"img"}
                    src={item?.src}
                  />
                ))}
              </Box>
            </Box>
          )}
          <Box
            sx={Style.termsBox(isArabic)}
            dangerouslySetInnerHTML={{
              __html: event.translation[language]?.content,
            }}
          />
          {!!event.translation[language]?.terms?.length && (
            <Box>
              <Typography sx={{ ...Style.heading(isArabic), color: "#FFBA83" }}>
                {t("event_detail_page.terms_condition")}
              </Typography>
              <Box
                sx={Style.termsBox(isArabic)}
                dangerouslySetInnerHTML={{
                  __html: event.translation[language]?.terms,
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      {/* large screen */}
      <Box sx={Style.grayInfoBox(isArabic)}>
        <Typography sx={Style.musicalPara(isArabic)}>
          {event?.category?.translation?.[language]?.name}
        </Typography>
        <Typography sx={Style.infoHeading(isArabic)}>
          {event?.translation?.[language]?.name}
        </Typography>
        <Link
          style={{ ...Style.locationLink, width: "80%" }}
          to={event?.map}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography sx={Style.location(isArabic)}>
            <IoLocationOutline style={Style.icon} />
            {event?.translation?.[language]?.address}
          </Typography>
        </Link>
        <Typography sx={Style.location(isArabic)}>
          <PiTicket style={Style.icon} />
          {event.start_price.is_free
            ? `${t("event_detail_page.free")} `
            : `${t("event_detail_page.ticket_price")} ${leastPrice}${" "}
          ${currencyJson?.[event?.tickets?.[0]?.currency]?.[language]}
          `}
        </Typography>
        <Typography sx={Style.location(isArabic)}>
          <AccessTimeIcon style={Style.icon} />
          {event?.event_time}
        </Typography>
        <CustomButton
          color="secondary"
          onClick={buyTikcet}
          buttonText={t("event_detail_page.buy_ticket")}
          sx={Style.buyButton(isArabic)}
        />
        <Box sx={Style.grayButtonBox(isArabic)}>
          <CustomButton
            typSx={Style.grayButtonTypo(isArabic)}
            icon={<PiShareFat />}
            onClick={handleClick}
            buttonText={t("event_detail_page.share")}
            sx={Style.grayButton(isArabic)}
          />
          <CustomButton
            typSx={Style.grayButtonTypo(isArabic)}
            icon={
              event.favorite ? <LiaHeartSolid color="#fff" /> : <LiaHeart />
            }
            onClick={handleSaveEvent}
            buttonText={
              !event.favorite
                ? t("event_detail_page.save")
                : t("event_detail_page.saved")
            }
            sx={Style.grayButton(isArabic)}
            loading={loadSaveBtn}
            disable={loadSaveBtn}
          />
        </Box>
        <TicketDateTag
          dateSx={Style.whiteTagDate(isArabic)}
          monthSx={Style.whiteTagMonth(isArabic)}
          sx={Style.whiteTag(isArabic)}
          date={day}
          month={month}
        />
      </Box>
      {/* large screen */}

      {/* small screen div start*/}
      <Box sx={Style.hiddenButtonBox}>
        <CustomButton
          sx={Style.hiddenButton(isArabic)}
          color={"secondary"}
          onClick={buyTikcet}
          buttonText={
            <>
              <Typography sx={Style.buyTypo(isArabic)}>
                {t("event_detail_page.buy_ticket")}
              </Typography>
              <Typography sx={Style.priceTypo(isArabic)}>
                {event.start_price.is_free
                  ? t("event_detail_page.free")
                  : `${t("event_detail_page.starts_from")} ${leastPrice}${" "}
                ${currencyJson?.[event?.tickets?.[0].currency]?.[language]}`}
              </Typography>
            </>
          }
        />
      </Box>
      {/* small screen div end*/}

      <BuyTicket
        open={buyTicketModal}
        setOpen={setBuyTicketModal}
        data={event}
      />
      <MobileNumberModal open={loginModal} setOpen={setLoginModal} />

      <ShareEvent
        open={shareEventOpen}
        handleClose={handleClose}
        userLink={window.location.href}
        anchorEl={anchorEl}
      />

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
