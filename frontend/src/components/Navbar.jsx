import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // CSS за Navbar

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="brand">
        <img src="src\assets\logo.png" width="45" alt="Logo" />
        <h2 className="name">YSMM</h2>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <button onClick={() => { navigate("/"); setMenuOpen(false); }}>Начало</button>
        <button onClick={() => { navigate("/about"); setMenuOpen(false); }}>За компанията</button>
        <button onClick={() => { navigate("/services"); setMenuOpen(false); }}>Услуги</button>
        <button onClick={() => { navigate("/offices"); setMenuOpen(false); }}>Нашите офиси</button>
        <button onClick={() => { navigate("/contacts"); setMenuOpen(false); }}>Контакти</button>

        <button
          className="login-btn"
          onClick={() => { navigate("/login"); setMenuOpen(false); }}
        >
          My-YSMM
        </button>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </div>
  );
}

export default Navbar;

