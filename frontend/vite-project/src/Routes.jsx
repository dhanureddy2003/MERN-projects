import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import App from "./App";
import Home from "./pages/home/Home";
import Notification from "./pages/notifications/Notification";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./pages/search/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <ProtectedRoute element={<Home />} /> },
      {
        path: "/notifications",
        element: <ProtectedRoute element={<Notification />} />,
      },
      { path: "/search", element: <ProtectedRoute element={<Search />} /> },
      {
        path: "/profile/:username",
        element: <ProtectedRoute element={<Profile />} />,
      },
      
      { path: "/login", element: <Login /> },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);
export default router;
