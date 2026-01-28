import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) return null;

  // ролята
  const role = (user.user_type || user.role || "").toString().toLowerCase();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="brand">
        <img src="src/assets/logo.png" width="45" alt="Logo" />
        <h2 className="name">YSMM</h2>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* ОБЩО */}
        <button
          onClick={() => {
            navigate("/dashboard");
            setMenuOpen(false);
          }}
        >
          Начало
        </button>

        {/* ===== CLIENT ===== */}
        {role === "client" && (
          <>
            <button onClick={() => { navigate("/my-packages"); setMenuOpen(false); }}>
              Моите пратки
            </button>

            <button onClick={() => { navigate("/my-profile"); setMenuOpen(false); }}>
              Моят профил
            </button> 
          </>
        )}

        {/* ===== EMPLOYEE ===== */}
        {role === "employee" && (
          <>
            <button onClick={() => { navigate("/packages"); setMenuOpen(false); }}>
             Пратки
            </button>

            <button onClick={() => { navigate("/register-package"); setMenuOpen(false); }}>
              Регистрация на пратки
            </button>

            <button onClick={() => { navigate("/clients"); setMenuOpen(false); }}>
              Клиенти
            </button>
          </>
            
        )}
         {/* ===== COURIER ===== */}
        {role === "courier" && (
          <>
            <button onClick={() => { navigate("/courier-packages"); setMenuOpen(false); }}>
             Пратки
            </button>

          </>
            
        )}

        {/* ===== ADMIN ===== */}
        {role === "admin" && (
          <>
            <button onClick={() => { navigate("/admin/offices"); setMenuOpen(false); }}>
              Офиси
            </button>

            <button onClick={() => { navigate("/admin/employees"); setMenuOpen(false); }}>
              Служители
            </button>


            <button onClick={() => { navigate("/admin/revenue"); setMenuOpen(false); }}>
              Приходи
            </button>
          </>
        )}

        <button className="login-btn" onClick={logout}>
          Изход
        </button>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </div>
  );
}

export default DashboardNavbar;

