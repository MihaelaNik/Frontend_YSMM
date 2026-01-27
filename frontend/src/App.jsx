import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";

import Home from "./pages/Home";
import AboutCompany from "./pages/AboutCompany";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import Offices from "./pages/Offices";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/client_view/MyProfile";
import MyPackages from "./pages/client_view/MyPackages";
import AdminOffices from "./pages/admin_view/AdminOffices";
import AdminEmployees from "./pages/admin_view/AdminEmployees";
import AdminRevenue from "./pages/admin_view/AdminRevenue";


function Layout() {
  const location = useLocation();

  
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const isAuthArea =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/my-profile") ||
    location.pathname.startsWith("/my-packages") ||
    location.pathname.startsWith("/packages") ||
    location.pathname.startsWith("/clients") ||
    location.pathname.startsWith("/employees") ||
    location.pathname.startsWith("/reports") ||
    location.pathname.startsWith("/register-package") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isAuthArea && <Navbar />}
      {isAuthArea && user && <DashboardNavbar />}

      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutCompany />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offices" element={<Offices />} />

        {/* after login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-packages" element={<MyPackages />} />

        {/* admin */}
        <Route path="/admin/offices" element={<AdminOffices />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/revenue" element={<AdminRevenue />} />

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




