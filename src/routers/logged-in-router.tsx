import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/userMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { Order } from "../pages/order";
import { AddDish } from "../pages/owner/add-dish";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const clientRoutes = [
  {
    path: "/",
    element: <Restaurants />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/category/:slug",
    element: <Category />,
  },
  {
    path: "/restaurants/:id",
    element: <Restaurant />,
  },
];

const commonRoutes = [
  { path: "/confirm", element: <ConfirmEmail /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/orders/:id", element: <Order /> },
];

const restaurantRoutes = [
  { path: "/", element: <MyRestaurants /> },
  { path: "/add-restaurant", element: <AddRestaurant /> },
  { path: "/restaurants/:id", element: <MyRestaurant /> },
  { path: "/restaurants/:restaurantId/add-dish", element: <AddDish /> },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {data.me.role === "Owner" &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
