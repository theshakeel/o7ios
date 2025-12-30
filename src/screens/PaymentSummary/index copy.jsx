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
import {
  checkout,
  checkDiscount,
  checkoutStripe,
} from "../../services/checkout";
import { selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import { Style } from "./style";
import toast from "react-hot-toast";
import { currencyJson } from "../../lib/helper";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

// Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


const PaymentSummary = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const paymentMethods = [
    {
      name: t("payment_summary_page.credit_card"),
      width: "70px",
      height: "16px",
      method: "card",
      image: IMAGES.visa,
      id: 1,
    },
    {
      name: t("payment_summary_page.knet"),
      width: "30px",
      height: "24px",
      method: "knet",
      image: IMAGES.knet,
      id: 2,
    },
    {
      name: t("payment_summary_page.google_pay"),
      width: "60px",
      height: "40px",
      method: "google_apple_pay",
      image: IMAGES.googlePay,
      id: 3,
    },
    {
      name: t("payment_summary_page.apple_pay"),
      width: "60px",
      height: "40px",
      method: "google_apple_pay",
      image: IMAGES.applePay,
      id: 4,
    },
  ];

  const [select, setSelect] = useState({ method: "card", id: 1 });
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

  useEffect(() => {
    // Start timer on mount
    startTimer(900); // 15 mins
  }, []);

  const handleCheckout = async () => {
    if (couponValue && !validCoupon) {  
      setIsSubmit(true);
      return;
    }

    setLoader(true);

    const isKWD =
      eventSlug?.data?.tickets?.[0]?.currency?.toUpperCase() === "GBP";
console.log("the data is", isKWD, eventSlug)
    try {
      if (isKWD) {
        // ✅ Stripe Elements Flow
        const { data } = await checkoutStripe(
          {
            event: eventSlug?.data?.id,
            tickets: eventSlug?.ticketsData,
            coupon: couponValue,
            payment_method:"stripe"
          },
          token
        );
        console.log("the response from stripe checkout ", data)
        const clientSecret = data?.client_secret;
        if (!clientSecret) throw new Error("No clientSecret returned.");

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: user?.name || "Customer",
                email: user?.email || "",
              },
            },
          }
        );

        if (error) {
          console.error(error);
          toast.error(error.message || "Payment failed");
          navigate("/order-failure");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          toast.success("Payment successful!");
          navigate("/order-success");
        }
      } else {
        // ✅ Your existing checkout (Tap)
        const { data } = await checkout(
          {
            event: eventSlug?.data?.id,
            tickets: eventSlug?.ticketsData,
            payment_method: select.method,
            coupon: couponValue,
          },
          token
        );
        toast.success("Redirecting...");
        window.open(data?.link, "_self");
      }
    } catch (err) {
      console.error(err);
      navigate("/order-failure");
    } finally {
      setLoader(false);
      setIsSubmit(false);
    }
  };

  const handleCheckDiscount = async () => {
    setIsSubmit(false);
    if (couponValue) {
      setDiscountLoader(true);
      await checkDiscount(
        {
          event: eventSlug?.data?.id,
          tickets: eventSlug?.ticketsData,
          coupon: couponValue,
        },
        token
      )
        .then(() => {
          setValidCoupon(true);
          setDiscountLoader(false);
        })
        .catch(({ response }) => {
          setValidCoupon(false);
          setDiscountLoader(false);
          setDiscountError(
            response?.data?.message?.coupon?.[0]
              ? response?.data?.message?.coupon?.[0]
              : response?.data?.message
          );
        });
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
  const isKWD = eventSlug?.data?.tickets?.[0]?.currency?.toUpperCase() === "GBP";

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

        {/* Payment Summary */}
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
                  {dayjs(eventSlug?.data?.event_time, "HH:mm:ss").format(
                    "h:mm A"
                  )}
                </Typography>
              </Box>
            </Box>
            <CustomDivider sx={Style.divider} />
            <Box sx={Style.paymentChildBox(isArabic)}>
              <Typography sx={Style.paymentChildHead(isArabic)}>
                {t("payment_summary_page.ticket_no")}
              </Typography>
              <Typography sx={Style.paymentChildInfo(isArabic)}>
                {totalQuantity}
              </Typography>
            </Box>
            <CustomDivider sx={Style.divider} />
            <Box sx={Style.paymentChildBox(isArabic)}>
              <Typography sx={Style.paymentChildHead(isArabic)}>
                {t("payment_summary_page.amount")}
              </Typography>
              <Typography component={"span"} sx={Style.paymentAmountBox(isArabic)}>
                <Typography sx={Style.paymentAmount(isArabic)}>
                  {eventSlug?.totalPrice}
                </Typography>{" "}
                {
                  currencyJson?.[eventSlug?.data?.tickets?.[0]?.currency]?.[
                    language
                  ]
                }
              </Typography>
            </Box>
          </Box>

          {/* Coupon + Payment */}
          <Box sx={Style.selectBox(isArabic)}>
            <Typography sx={Style.Heading(isArabic)}>
              {t("payment_summary_page.select_payment")}
            </Typography>

            {!isKWD &&
              paymentMethods.map((val) => (
                <Box
                  key={val.id}
                  sx={
                    select.id === val.id
                      ? Style.selectOrangeBox(isArabic)
                      : Style.selectGrayBox(isArabic)
                  }
                  onClick={() => setSelect({ method: val.method, id: val.id })}
                >
                  <Box sx={Style.flex(isArabic)}>
                    {select.id === val.id ? (
                      <CheckCircleIcon style={Style.orangeIcon} />
                    ) : (
                      <CircleIcon style={Style.grayIcon} />
                    )}
                    <Typography
                      sx={{
                        fontFamily: isArabic ? "Cairo, sans-serif" : "Inter",
                      }}
                    >
                      {val.name}
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    src={val.image}
                    height={val.height}
                    width={val.width}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              ))}

            {/* Stripe Card Form (for KWD events) */}
            {isKWD && (
              <Box sx={{ p: 2, background: "#222", borderRadius: "12px", mt: 2 }}>
                <Typography sx={{ color: "#fff", mb: 1 }}>
                  Enter Card Details
                </Typography>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#fff",
                        "::placeholder": { color: "#aaa" },
                      },
                      invalid: { color: "#ff4d4f" },
                    },
                  }}
                />
              </Box>
            )}

            {/* Coupon */}
            <Typography sx={Style.Heading(isArabic)}>
              {t("payment_summary_page.discount_code_coupon")}
            </Typography>
            <Box sx={Style.discount(isArabic)}>
              <Input
                id="input-with-icon-adornment"
                sx={Style.discountInput(isArabic)}
                onChange={onHandleChange}
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
            {((isSubmit && !validCoupon) || discountError) && (
              <Typography sx={Style.discountMessage(isArabic)}>
                {discountError
                  ? discountError
                  : t("payment_summary_page.discountMessage")}
              </Typography>
            )}
            <Typography sx={Style.confirm(isArabic)}>
              {t("payment_summary_page.by_tapping")}
            </Typography>
            <Typography sx={Style.terms(isArabic)}>
              {t("payment_summary_page.terms_condition")}
            </Typography>
            <CustomButton
              onClick={handleCheckout}
              sx={Style.confirmButton(isArabic)}
              color={"secondary"}
              buttonText={t("payment_summary_page.confirm")}
              loading={loader}
              disable={loader}
            />
          </Box>
        </Box>
      </Box>
  );
};

export default PaymentSummary;
