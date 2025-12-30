import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Home,
  EventDetails,
  MyTickets,
  OrderFailure,
  OrderSuccess,
  OrderSuccessSub,
  MyFavorites,
  Search,
  RedeemTickets,
} from "./screens";
import PaymentSummaryWrapper from "./screens/PaymentSummaryWrapper";
import { selectUser } from "./store/slice/user";
import { useSelector } from "react-redux";
import DynamicPage from "./screens/DynamicPage";
import EmployeeLogin from "./screens/EmployeeLogin";

const AppRoutes = () => {
  const { token, email } = useSelector(selectUser);
  const isEmployee = localStorage.getItem("isEmployee");
  const navigate = useNavigate();
  useEffect(() => {
    if(isEmployee)
    navigate("/redeem-tickets");
  }, [isEmployee]);
  const appRoutes = [
    !isEmployee && { path: "/", element: <Home /> },
    !isEmployee && {
      path: "/event-details/:id",
      element: <EventDetails />,
    },
    !token && {
      path: "/employee",
      element: <EmployeeLogin />,
      isPrivate: false,
    },
    !isEmployee && {
      path: "/payment-summary",
      element: <PaymentSummaryWrapper />,
      isPrivate: true,
    },
    
    !isEmployee && {
      path: "/my-tickets",
      element: <MyTickets />,
      isPrivate: true,
    },
    {
      path: "/search",
      element: <Search />,
      isPrivate: false,
    },
    !isEmployee && {
      path: "/my-favorites",
      element: <MyFavorites />,
      isPrivate: true,
    },
    !isEmployee && {
      path: "/order-success",
      element: <OrderSuccess />,
      isPrivate: true,
    },
    !isEmployee && {
      path: "/order-success-subscription",
      element: <OrderSuccessSub />,
      isPrivate: true,
    },
    !isEmployee && {
      path: "/order-failure",
      element: <OrderFailure />,
      isPrivate: true,
    },
    !isEmployee && {
      path: "/:page_slug",
      element: <DynamicPage />,
    },
    isEmployee && {
      path: "/redeem-tickets",
      element: <RedeemTickets />,
    },
  ];

  return (
    <Routes>
      {appRoutes.map((val, index) => (
        <Route
          key={index}
          exact
          path={val?.path}
          element={
            !val?.isPrivate ? (
              val?.element
            ) : token ? (
              val?.element
            ) : (
              <Navigate to={"/"} replace />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
