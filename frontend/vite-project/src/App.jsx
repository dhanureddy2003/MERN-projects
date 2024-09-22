// App.js
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar";
import RightPanel from "./components/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
function App() {
  const location = useLocation();
  const { data: user } = useQuery({ queryKey: ["user"] });
  return (
    <div className="main-div flex overflow-x-hidden h-screen">
      {user && !(location.pathname === "/signup" || location.pathname === "/login") && (
        <SideBar />
      )}
      <Outlet />
      {user && !(location.pathname === "/signup" || location.pathname === "/login") && (
        <RightPanel />
      )}
      <Toaster />
    </div>
  );
}

export default App;
