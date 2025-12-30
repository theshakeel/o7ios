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
import { checkoutSub, checkDiscount } from "../../services/checkout";
import { selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import { Style } from "./style";
import toast from "react-hot-toast";
import { currencyJson } from "../../lib/helper";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
// import mixpanel from "mixpanel-browser";

const ChatPayment = ({ onBack }) => {
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
    const [systemSettings, setSystemSettings] = useState(null); 
  
  const { state } = useLocation();
  let eventSlug = state?.eventSlug;
  const navigate = useNavigate();
  let timeout;
useEffect(() => {
      fetch("https://admin.o7events.com/api/system-settings") 
      .then((res) => res.json())
      .then((system) => 
        { 
          setSystemSettings(system)
        }
      ) 
      .catch((err) => console.error("Error fetching subs:", err));       
  }, []);
  // useEffect(() => {
  //   mixpanel?.track("payment-summary", {
  //     email: user?.email,
  //     name: user?.name || "anonymous",
  //   });
  // }, []);
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
        timeout = setTimeout(updateTimer, 1000); // Update every second
      } else {
        clearTimeout(timeout);
        navigate(-1);
      }
    }

    updateTimer(); // Start the timer initially
  };

  const handleCheckout = async () => {
    if (couponValue && !validCoupon) {
      setIsSubmit(true);
    }
    if (!couponValue || (couponValue && validCoupon)) {
      setLoader(true);
      await checkoutSub(
        {
          total:systemSettings.chatprice.price,
          user: user.id,
          currency:systemSettings.chatprice.currency,
          payment_method: select.method,
        },
        token
      )
        .then(({ data }) => {
          toast.success("Redirecting...");
          window.open(data?.link, "_self");
          setLoader(false);
          setIsSubmit(false);
        })
        .catch((err) => {
          setLoader(false);
          navigate("/order-failure");
          setIsSubmit(false);
        });
    } else {
      setValidCoupon(false);
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
        .then((data) => {
          console.log(data, "new world");
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
  return systemSettings ? (
    <Box sx={Style.checkOutModal}>


      <Box sx={Style.paymentBox}>
        <Box sx={Style.grayBox}>
          <Typography sx={Style.paymentHead(isArabic)}>
            {t('payment_summary_page.please_complete_chat', { price: `${systemSettings.chatprice.price} ${systemSettings.chatprice.currency}` })}
          </Typography>
          
        </Box>

        <Box sx={Style.selectBox(isArabic)}>
          <Typography sx={Style.Heading(isArabic)}>
            {t("payment_summary_page.select_payment")}
          </Typography>
          {paymentMethods?.map((val, index) => (
            <Box
              key={index}
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
  ) : null;
};
export default ChatPayment;
