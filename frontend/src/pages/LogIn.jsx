import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/LogIn.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Грешка при вход");

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard"); // redirect след успешен вход
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Вход в системата</h1>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" placeholder="Въведете email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Парола</label>
          <input type="password" placeholder="Въведете парола" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="login-submit">
            Вход
          </button>
        </form>

        <div className="register-section">
          <span>Нямате акаунт?</span>
          <Link to="/register" className="register-link">
            Регистрирайте се
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;


