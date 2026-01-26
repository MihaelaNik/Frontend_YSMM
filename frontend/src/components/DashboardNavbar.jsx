import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) return null;

  // РОЛЯТА ИДВА ОТ user_type (или fallback ако backend върне role)
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
        <button
          onClick={() => {
            navigate("/dashboard");
            setMenuOpen(false);
          }}
        >
          Начало
        </button>

        {/* ===== КЛИЕНТ ===== */}
        {role === "client" && (
       <>
    <button onClick={() => { navigate("/send-package"); setMenuOpen(false); }}>
      Нова пратка
    </button>

    <button onClick={() => { navigate("/my-packages"); setMenuOpen(false); }}>
      Моите пратки
    </button>

    <button onClick={() => { navigate("/my-profile"); setMenuOpen(false); }}>
      Моят профил
    </button>
  </>
)}

        

        {/* ===== СЛУЖИТЕЛ ===== */}
        {role === "employee" && (
          <>
            <button
              onClick={() => {
                navigate("/packages");
                setMenuOpen(false);
              }}
            >
              Всички пратки
            </button>

            <button
              onClick={() => {
                navigate("/register-package");
                setMenuOpen(false);
              }}
            >
              Регистрация на пратка
            </button>

            <button
              onClick={() => {
                navigate("/clients");
                setMenuOpen(false);
              }}
            >
              Клиенти
            </button>

            <button
              onClick={() => {
                navigate("/employees");
                setMenuOpen(false);
              }}
            >
              Служители
            </button>

            <button
              onClick={() => {
                navigate("/reports");
                setMenuOpen(false);
              }}
            >
              Справки
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



