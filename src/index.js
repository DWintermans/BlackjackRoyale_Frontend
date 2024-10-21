import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import Login from "./pages/login";
import Game from "./pages/game";
import Index from "./pages/index";
import ProtectedRoute from "./components/ProtectedRoute";

const RedirectIfLoggedIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
      if (!!localStorage.getItem('jwt')) {
          navigate('/'); 
      }
  }, [navigate]);

  return null; 
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: (
      <RedirectIfLoggedIn />,
      <Login />
    )
  },
  {
    path: "/game",
    element: (
      <ProtectedRoute element={<Game />} />
    ),
  },
  {
    path: "/game/:groupID",
    element: (
      <ProtectedRoute element={<Game />} />
    ),
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);