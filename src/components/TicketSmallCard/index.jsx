import { Box, Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { convertDate, currencyJson } from "../../lib/helper";
import { selectUser } from "../../store/slice/user";
import TicketQR from "../Modals/TicketQR";
import TicketDateTag from "../TicketDateTag";
import { Style } from "./style";
import { useTranslation } from "react-i18next";

const TicketSmallCard = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const { language } = useSelector(selectUser);
  const { t } = useTranslation();
  const { day, month } = convertDate(data?.ticket?.event?.event_date, t);
  const isArabic = language === "ar";
  return (
    <>
      <Grid sx={Style.mainContainer}>
        <Box onClick={() => setOpen(true)} sx={Style.main(isArabic)}>
          <TicketDateTag
            date={day}
            month={month}
            sx={Style.ticketDateTag(isArabic)}
            dateSx={Style.date(isArabic)}
            monthSx={Style.month(isArabic)}
          />
          <Box
            onClick={() => setOpen(true)}
            component={"img"}
            src={data?.ticket?.event?.full_image}
            sx={Style.img}
          />
          <Box sx={Style.contentContainer(isArabic)}>
            <Box sx={Style.typeBadge}>
              { data?.ticket?.is_free ? `${t("event_detail_page.free")} ` : data?.ticket?.translation?.[language]?.name}
            </Box>
            <Box sx={Style.tittle}>
              {data?.ticket?.event?.translation?.[language]?.name}
            </Box>
            <Box sx={Style.price}>
              {data?.ticket?.is_free ? (
                `${t("event_detail_page.free")} `
              ) : (
                <>
                  {data?.price}
                  <Box component="span" sx={Style.currency}>
                    {currencyJson?.[data?.currency]?.[language]}
                  </Box>
                </>
              )}
            </Box>
            <Box sx={Style.price}>
              {data?.qty}{" "}
              <Box component="span" sx={Style.currency}>
                QTY
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <TicketQR open={open} setOpen={setOpen} data={data.qr} />
    </>
  );
};

export default TicketSmallCard;
