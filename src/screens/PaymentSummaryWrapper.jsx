import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSummary from "./PaymentSummary";
import PaymentSummaryPlain from "./PaymentSummary/PaymentSummaryPlain.jsx";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { createPaymentIntentAPI } from "../services/checkout";
import { selectUser } from "../store/slice/user";

const stripePromise = loadStripe("pk_live_51S5vZsJ0qH1UUVsoU8Ek8UT8wI0jSNGJHKTWGb3UQDHQmJBcIEm2QHkwg8mD79HV71LdaYpSJXZVINK5Ebosqnpw00Ej9CaS2L");

const PaymentSummaryWrapper = () => {
  const location = useLocation();
  const { token } = useSelector(selectUser);

  const eventSlug = location.state?.eventSlug;
  const initialCoupon = location.state?.couponValue ?? "";

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [summary, setSummary] = useState(null); // ✅ store summary
  const [activeCoupon, setActiveCoupon] = useState(initialCoupon);

  const isStripeCurrency =
    eventSlug?.data?.tickets?.[0]?.currency?.toUpperCase() === "GBP";

  // ✅ Function to create a new PaymentIntent
  const createPaymentIntent = useCallback(
    async (coupon = "") => {
      if (!eventSlug || !isStripeCurrency) return;
      try {
        const response = await createPaymentIntentAPI(
          {
            event: eventSlug.data.id,
            tickets: eventSlug.ticketsData,
            coupon, // include latest coupon
          },
          token
        );

        const data = response.data;
        setClientSecret(data.client_secret);
        setPaymentIntentId(data.payment_intent_id);
        setSummary(data.summary); // ✅ keep summary available
      } catch (err) {
        console.error("Error creating PaymentIntent:", err);
      }
    },
    [eventSlug, token, isStripeCurrency]
  );

  // ✅ Create initial PaymentIntent
  useEffect(() => {
    createPaymentIntent(activeCoupon);
  }, [createPaymentIntent, activeCoupon]);

  // ✅ Render logic
  if (isStripeCurrency) {
    if (!clientSecret) return <div>Loading payment checkout...</div>;

    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentSummary
          clientSecret={clientSecret}
          PID={paymentIntentId}
          summary={summary} // ✅ now correctly passed
          isStripeCurrency={true}
          onCouponApplied={(coupon) => {
            setActiveCoupon(coupon);
            setClientSecret(null); // force refresh during new intent fetch
          }}
        />
      </Elements>
    );
  }

  return (
    <PaymentSummaryPlain eventSlug={eventSlug} couponValue={activeCoupon} />
  );
};

export default PaymentSummaryWrapper;