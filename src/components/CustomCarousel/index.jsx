import { Box } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useNavigate } from "react-router-dom";
import { selectEventsData } from "../../store/slice/events";
import { selectSlides } from "../../store/slice/slides";
import { selectUser } from "../../store/slice/user";
import { handleCategorySelect } from "../../utils";
import { Style } from "./style";
import ImageSkeleton from "../Skeleton";
const CustomCarousel = () => {
  const dispatch = useDispatch();
  const slides = useSelector(selectSlides);
  const { language, countryId } = useSelector(selectUser);
  const { searchKey } = useSelector(selectEventsData);
  const hasSlides = Array.isArray(slides) && slides.length > 0;
  const navigate = useNavigate();
  console.log("we have slides", slides)
  return (
    <Box sx={Style.main}>
         {hasSlides ? (
          <Carousel
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
      >
        {slides?.map((item, index) => {
          return (
            <Box key={index} sx={Style.carouselBox}>
              <Box
                component={"img"}
                src={ item?.translation[language]?.full_image_mobile }
                sx={Style.carouselImg}
              />
              <Box
                component="div"
                onClick={() => {
                  item.type === "url" && (window.location.href = item?.url);
                  item.type === "page" && navigate(`${item?.page?.slug}`);
                  item.type === "event" &&
                    navigate(`/event-details/${item?.event?.slug}`);
                  item.type === "category" &&
                    handleCategorySelect(
                      item.category,
                      searchKey,
                      dispatch,
                      countryId
                    );
                }}
                sx={Style.contentContainer}
              />
            </Box>
          );
        })}
      </Carousel>
          ) : (
        <ImageSkeleton width="100%" height="180px" variant="wave" />
      )}
      
    </Box>
  );
};

export default CustomCarousel;
