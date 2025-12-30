import { IMAGES } from "../../../theme";
import { Box, Typography } from "@mui/material";
import ModalWrapper from "../../ModalWrapper";
import { Style } from "./style";
import CustomButton from "../../CustomButton";
import { IoMdInformationCircleOutline } from "react-icons/io";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/slice/user";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { currencyJson } from "../../../lib/helper";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { checkout } from "../../../services/checkout";

const BuyTicket = ({ open, setOpen, data }) => {
  const { t } = useTranslation();
  const { tickets } = data;
  const [ticketsData, setTicketsData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currency, setCurrency] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { token, language } = useSelector(selectUser);
  const ticketImages = [
    IMAGES?.goldenTicket,
    IMAGES?.silverTicket,
    IMAGES?.greenTicket,
    IMAGES?.greenTicket,
  ];

  const handleQty = (type, item) => {
    setCurrency(item?.currency);
    setTicketsData((prevTicketsData) => {
      const existingTicketIndex = prevTicketsData.findIndex(
        (ticket) => ticket.ticket === item.id
      );

      if (existingTicketIndex !== -1) {
        return prevTicketsData.map((ticket, index) => {
          if (index === existingTicketIndex) {
            setTotalPrice((totalPrice) =>
              type === "add" ? totalPrice + item.price : totalPrice - item.price
            );
            return {
              ticket: item.id,
              quantity:
                type === "add" ? ticket.quantity + 1 : ticket.quantity - 1,
            };
          }
          return ticket;
        });
      } else {
        setTotalPrice((totalPrice) => totalPrice + item.price);
        console.log("prevTicketsData", prevTicketsData);

        return [...prevTicketsData, { ticket: item.id, quantity: 0 }];
      }
    });
  };
  let filterTicketsData = ticketsData.filter((item) => item.quantity > 0);
  const handleCheckout = () => {
    if (!!filterTicketsData?.length) {
      navigate("/payment-summary", {
        state: {
          eventSlug: { data, totalPrice: (Number(totalPrice) + Number(data.process_fees)), ticketsData: filterTicketsData },
        },
      });
    }
  };
  const handleFreeCheckout = async () => {
    setLoader(true);
    await checkout(
      {
        event: data?.id,
        tickets: filterTicketsData,
        payment_method: 'free',
      },
      token
    )
      .then(() => {
        toast.success("Success");
        navigate("/order-success")
      })
      .catch((err) => {
        setLoader(false);
        navigate("/order-failure");
      });
  };

  // useEffect(() => {
  //   tickets.map((item) => {
  //     handleQty("add", item);
  //   });
  // }, []);
  useEffect(() => {
    if (tickets.length > 0) {
      setCurrency(tickets[0].currency); // Set default currency from the first ticket
    }
    console.log("prevTicketsData", tickets.map(item => ({ ticket: item.id, quantity: 0 })));

    setTicketsData(tickets.map(item => ({ ticket: item.id, quantity: 0 })));
  }, [tickets]);
  const isArabic = language === "ar";
  return (
    <ModalWrapper open={open} setOpen={setOpen} crossIcon>
      <Typography
        sx={{ display: "flex", textAlign: "center", mt: { xs: "20px", sm: 0 } }}
      >
        <Typography
          component={"span"}
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            left: "10px",
            display: { xs: "flex", sm: "none" },
          }}
        >
          <ArrowBackIcon />
        </Typography>
        <Typography component={"span"} sx={Style.heading(isArabic)}>
          {t("buy_ticket_modal.select_tickets")}
        </Typography>
      </Typography>
      <Typography sx={Style.para(isArabic)}>
        {t("buy_ticket_modal.select_tickets_para")}
        {/* Please select the ticket(s) you want to buy and continue the process. */}
      </Typography>
      <Box sx={Style.allTickets}>
        {tickets?.map((item, index) => {
          const ticketQuantity = ticketsData?.find(
            (ticket) => ticket.ticket === item.id
          );
          return (
            <Box key={index} sx={Style.ticket(ticketImages[index], isArabic)}>
              <Box sx={Style.ticketInfoBox(isArabic)}>
                <Typography sx={Style.priceBox(isArabic)}>
                  {data.start_price.is_free ? (
                    <Typography sx={Style.price(isArabic)}>
                      {t("event_detail_page.free")}
                    </Typography>
                  ) : (
                    <>
                      <Typography sx={Style.price(isArabic)}>
                        {item?.price}
                      </Typography>
                      {currencyJson?.[item?.currency]?.[language]}
                    </>
                  )}
                </Typography>
                <Typography sx={Style.ticketTypeBox}>
                  <Typography sx={Style.ticketType(isArabic)}>
                    {item?.translation?.[language]?.name}
                  </Typography>
                  <IoMdInformationCircleOutline style={Style.info} />
                </Typography>
                {/* <Typography
                  sx={Style.avail}
                >{`${item.qty} Available Tickets`}</Typography> */}
              </Box>
              <Box sx={Style.numBox(isArabic)}>
                <RemoveIcon
                  style={Style.remove}
                  onClick={() => {
                    if (ticketQuantity?.quantity) handleQty("remove", item);
                  }}
                />
                <Typography>{ticketQuantity?.quantity || 0}</Typography>
                <AddCircleIcon
                  style={Style.add}
                  onClick={() => {
                    if (ticketQuantity?.quantity !== item.qty)
                      handleQty("add", item);
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
      <CustomButton
        onClick={data.start_price.is_free ? handleFreeCheckout : handleCheckout}
        color="secondary"
        buttonText={
          <>
            <Typography sx={Style.buttonHead}>
              {t("buy_ticket_modal.checkout")}
            </Typography>
            <Typography sx={Style.buttonPrice}>
              {data.start_price.is_free
                ? t("event_detail_page.free")
                : `${t("buy_ticket_modal.total")} ${totalPrice}${" "}
              ${currencyJson?.[currency]?.[language]}`}
            </Typography>
          </>
        }
        sx={Style.button(isArabic)}
        disable={!filterTicketsData?.length}
      />
    </ModalWrapper>
  );
};
export default BuyTicket;
