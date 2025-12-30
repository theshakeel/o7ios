import React, { useEffect } from "react";
import TicketStatus from "../../components/TicketStatus";
// import { selectUser } from "../../store/slice/user";
// import { useSelector } from "react-redux";
// import mixpanel from "mixpanel-browser";

const OrderSuccess = () => {
  // const user = useSelector(selectUser);
  
  return <TicketStatus success={true} />;
};

export default OrderSuccess;
