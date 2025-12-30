import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Typography,
  Input,
  IconButton,
  InputAdornment,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomButton } from "../../components";
import CustomDivider from "../../components/CustomDivider";
import { checkoutStripe, checkDiscount } from "../../services/checkout";
import { selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import { Style } from "./style";
import toast from "react-hot-toast";
import { currencyJson } from "../../lib/helper";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import mixpanel from "mixpanel-browser";

// Stripe imports
import {
  CardElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";

const PaymentSummary = ({ clientSecret, PID,summary, onCouponApplied }) => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
const [showCard, setShowCard] = useState(false);
  const [timer, setTimer] = useState("");
  const [loader, setLoader] = useState(false);
  const [discountLoader, setDiscountLoader] = useState(false);
  const [validCoupon, setValidCoupon] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [couponValue, setCoupon] = useState("");
  const [discountError, setDiscountError] = useState("");
  const { language, token } = useSelector(selectUser);
  const { state } = useLocation();
  let eventSlug = state?.eventSlug;
  const navigate = useNavigate();
  let timeout;
  const stripe = useStripe();
  const elements = useElements();


  const startTimer = (durationInSeconds) => {
    let remainingTime = durationInSeconds;
    function updateTimer() {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      setTimer(formattedTime);
      if (remainingTime > 0) {
        remainingTime--;
        timeout = setTimeout(updateTimer, 1000);
      } else {
        clearTimeout(timeout);
        navigate(-1);
      }
    }
    updateTimer();
  };
// For CardElement payments, call THIS:
const confirmCardPayment = async () => {
  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      // Immediate error means payment failed
      console.error("Payment failed:", error);
      toast.error(error.message || "Payment failed");
      navigate("/order-failure");
      return;
    }

    // ✅ No error — treat as success, even if still processing
    toast.success("Payment confirmed!");
    navigate("/order-success");
  } catch (err) {
    console.error("Unexpected error confirming payment:", err);
    toast.error("Something went wrong. Please try again.");
    navigate("/order-failure");
  }
};


  const confirmStripePayment = async () => {
    try {
      const returnUrl = `${window.location.origin}/order-success`;
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: returnUrl },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        navigate("/order-failure");
      }
    } catch (err) {
      console.error(err);
      navigate("/order-failure");
    }
  };

  const handleCardSubmit = async () => {
    if (couponValue && !validCoupon) {
      setIsSubmit(true);
      return;
    }

    setLoader(true);
    try {
      await checkoutStripe(
        {
          event: eventSlug?.data?.id,
          tickets: eventSlug?.ticketsData,
          coupon: couponValue,
          pid: PID,
          payment_method: "stripe",
        },
        token
      );

      // await confirmStripePayment();
      await confirmCardPayment();
    } catch (err) {
      console.error(err);
      navigate("/order-failure");
    } finally {
      setLoader(false);
      setIsSubmit(false);
    }
  };

  const handleExpressConfirm = async () => {
    try {
      await checkoutStripe(
        {
          event: eventSlug?.data?.id,
          tickets: eventSlug?.ticketsData,
          coupon: couponValue,
          pid: PID,
          payment_method: "stripe",
        },
        token
      );

      await confirmStripePayment();
    } catch (err) {
      console.error(err);
      navigate("/order-failure");
    }
  };

const handleCheckDiscount = async () => {
  setIsSubmit(false);

  if (!couponValue?.trim()) return;

  setDiscountLoader(true);
  try {
    await checkDiscount(
      {
        event: eventSlug?.data?.id,
        tickets: eventSlug?.ticketsData,
        coupon: couponValue,
      },
      token
    );

    setValidCoupon(true);
    setDiscountLoader(false);

    // 🔥 Notify parent wrapper (PaymentSummaryWrapper)
    // so it can re-create a new PaymentIntent with the discount applied
    if (typeof onCouponApplied === "function") {
      onCouponApplied(couponValue);
    }

  } catch (error) {
    const response = error?.response;
    setValidCoupon(false);
    setDiscountLoader(false);
    setDiscountError(
      response?.data?.message?.coupon?.[0] ??
      response?.data?.message ??
      "Invalid or expired coupon"
    );
  }
};


  const onHandleChange = (e) => {
    setCoupon(e?.target?.value?.trim());
    setDiscountError(false);
    setIsSubmit(false);
    setValidCoupon(false);
  };

  let totalQuantity = 0;
  eventSlug?.ticketsData?.forEach((item) => {
    totalQuantity += item.quantity;
  });
  const isArabic = language === "ar";

  return (
    <Box sx={Style.checkOutModal}>
      {/* Header */}
      <Typography
        sx={{
          position: "relative",
          width: "calc(100% - 40px)",
          maxWidth: "470px",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "0px",
          color: "#fff",
          m: "40px 0 20px",
        }}
      >
        <Typography component={"span"} sx={{ position: "absolute", left: 0 }}>
          <ArrowBackIcon
            onClick={() => navigate("/")}
            style={{ ...Style.icon, fontSize: "30px" }}
          />
        </Typography>
        <Typography component={"span"} sx={Style.checkOutHeading(isArabic)}>
          {t("buy_ticket_modal.checkout")}
        </Typography>
      </Typography>

      {/* Timer */}
      <Box sx={Style.timerBox}>
        <Typography sx={Style.timerPara(isArabic)}>
          {t("payment_summary_page.please_complete")}
        </Typography>
        <Typography sx={Style.timerTime(isArabic)}>{timer}</Typography>
      </Box>

      {/* Summary Box */}
      <Box sx={Style.paymentBox}>
        <Box sx={Style.grayBox}>
          <Typography sx={Style.paymentHead(isArabic)}>
            {t("payment_summary_page.payment_summary")}
          </Typography>
          <Box sx={Style.paymentChildBox(isArabic)}>
            <Typography sx={Style.paymentChildHead(isArabic)}>
              {t("payment_summary_page.event")}
            </Typography>
            <Box sx={Style.locationBox}>
              <Typography sx={Style.paymentChildInfo(isArabic)}>
                {eventSlug?.data?.translation?.[language]?.name}
              </Typography>
              <Typography sx={Style.paymentChildTime(isArabic)}>
                {dayjs(eventSlug?.data?.event_date)?.format("DD/MM/YYYY")},{" "}
                {dayjs(eventSlug?.data?.event_time, "HH:mm:ss").format("h:mm A")}
              </Typography>
            </Box>
          </Box>
          <CustomDivider sx={Style.divider} />
          {/* <Box sx={Style.paymentChildBox(isArabic)}>
            <Typography sx={Style.paymentChildHead(isArabic)}>
              {t("payment_summary_page.ticket_no")}
            </Typography>
            <Typography sx={Style.paymentChildInfo(isArabic)}>
              {totalQuantity}
            </Typography>
          </Box>
          <CustomDivider sx={Style.divider} /> */}
          <Box sx={Style.paymentChildBox(isArabic)}>
            <Typography sx={Style.paymentChildHead(isArabic)}>
              {t("payment_summary_page.amount")}
            </Typography>
            <Typography component={"span"} sx={Style.paymentAmountBox(isArabic)}>
              <Typography sx={Style.paymentAmount(isArabic)}>
                {/* {eventSlug?.totalPrice} */}
                {summary?.subtotal ?? 0}
              </Typography>{" "}
              {
                currencyJson?.[eventSlug?.data?.tickets?.[0]?.currency]?.[
                  language
                ]
              }
            </Typography>
          </Box>
          <Box sx={Style.paymentChildBox(isArabic)}>
            <Typography sx={Style.paymentChildHead(isArabic)}>
              {t("payment_summary_page.ticket_no")}
            </Typography>
            <Typography sx={Style.paymentChildInfo(isArabic)}>
              {totalQuantity}
            </Typography>
          </Box>
         <Box sx={Style.paymentChildBox(isArabic)}>
          <Typography sx={Style.paymentChildHead(isArabic)}>
            {t("payment_summary_page.amount_fees_per")}
          </Typography>
          <Typography component={"span"} sx={Style.paymentAmountBox(isArabic)}>
            <Typography sx={Style.paymentAmount(isArabic)}>
              {eventSlug?.data.process_fees}
            </Typography>{" "}
            {
              currencyJson?.[eventSlug?.data?.tickets?.[0]?.currency]?.[language]
            }
          </Typography>
        </Box>

{/* ✅ Coupon Info Box (only if applied) */}
{summary?.coupon_code && (
  <Box
    sx={{
      ...Style.paymentChildBox(isArabic),
      backgroundColor: "#000",
      border: "1px solid #222",
      width:"94% !important",
      borderRadius: "8px",
      padding: "10px 14px",
      mt: 2,
      color: "#fff",
    }}
  >
    <Typography sx={{ fontWeight: 600, color: "#fff" }}>
      Coupon applied:{" "}
      <span style={{ color: "#fff", fontWeight: 400 }}>
        {summary.coupon_code}
      </span>
    </Typography>
    <Typography sx={{ fontSize: "14px", color: "#ccc", mt: 0.5 }}>
      You saved {summary?.coupon} {summary?.currency}
    </Typography>
  </Box>
)}

          
        </Box>
              {/* Coupon */}
        <Typography sx={Style.Heading(isArabic)}>
          {t("payment_summary_page.discount_code_coupon")}
        </Typography>
       {!summary?.coupon_code && (
  <Box sx={Style.discount(isArabic)}>
    <Input
      id="input-with-icon-adornment"
      sx={Style.discountInput(isArabic)}
      onChange={(e) => onHandleChange(e)}
      value={couponValue}
      endAdornment={
        <InputAdornment>
          <IconButton>
            <DoneIcon color={validCoupon ? "success" : "disabled"} />
          </IconButton>
        </InputAdornment>
      }
    />
    <CustomButton
      onClick={handleCheckDiscount}
      sx={Style.discountButton(isArabic)}
      color={"secondary"}
      buttonText={t("payment_summary_page.apply")}
      loading={discountLoader}
      disable={discountLoader}
    />
  </Box>
)}

        {((isSubmit && !validCoupon) || discountError) && (
          <Typography sx={Style.discountMessage(isArabic)}>
            {discountError
              ? discountError
              : t("payment_summary_page.discountMessage")}
          </Typography>
        )}

        {/* Confirm Info */}
        <Typography sx={Style.confirm(isArabic)}>
          {t("payment_summary_page.by_tapping")}
        </Typography>
        <Typography sx={Style.terms(isArabic)}>
          {t("payment_summary_page.terms_condition")}
        </Typography>
        {/* Stripe Express + Card */}
             <Box sx={Style.paymentBox}>
          {!showCard ? (
            <>
              <Typography sx={{ color: "#fff", mb: 2, fontWeight: 500 }}>
                Express Checkout
              </Typography>
              <ExpressCheckoutElement onConfirm={handleExpressConfirm} />
              <CustomButton
                sx={{ mt: 2 }}
                buttonText="Pay with Card"
                color="secondary"
                onClick={() => setShowCard(true)}
              />
            </>
          ) : (
              <Box sx={{ width: "100%" }}>
                <Typography sx={{ color: "#fff", mb: 1 }}>Card Payment</Typography>
              <Box
                sx={{
                  background: "#333",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: { color: "#fff", fontSize: "16px" },
                      invalid: { color: "#ff6b6b" },
                    },
                  }}
                />
                <CustomButton
                onClick={handleCardSubmit}
                  type="submit"
                  sx={Style.confirmButton(isArabic)}
                  buttonText="Confirm Payment"
                  loading={loader}
                  disable={loader}
                />
              </Box>
            </Box>
          )}
        </Box>
        
      </Box>
    </Box>
  );
};

export default PaymentSummary;