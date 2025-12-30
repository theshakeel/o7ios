import React, { useEffect } from "react";
import TicketStatus from "../../components/TicketStatus";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../store/slice/user";
// import mixpanel from "mixpanel-browser";

const OrderFailure = () => {
  // const user = useSelector(selectUser);

  return <TicketStatus success={false} />;
};

export default OrderFailure;
