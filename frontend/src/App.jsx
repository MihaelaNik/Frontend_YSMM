import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";

import Home from "./pages/Home";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import Offices from "./pages/Offices";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";

function Layout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // всички страници след login (dashboard зона)
  const isAuthArea =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/my-profile") ||
    location.pathname.startsWith("/my-packages") ||
    location.pathname.startsWith("/send-package") ||
    location.pathname.startsWith("/packages") ||
    location.pathname.startsWith("/clients") ||
    location.pathname.startsWith("/employees") ||
    location.pathname.startsWith("/reports") ||
    location.pathname.startsWith("/register-package");

  return (
    <>
      {/* PUBLIC NAVBAR */}
      {!isAuthArea && <Navbar />}

      {/* DASHBOARD NAVBAR */}
      {isAuthArea && user && <DashboardNavbar />}

      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offices" element={<Offices />} />

        {/* after login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;



