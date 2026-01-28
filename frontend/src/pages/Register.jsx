import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // update state при писане в полетата
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // проверка за съвпадение на паролите
    if (form.password !== form.passwordConfirm) {
      setError("Паролите не съвпадат");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Backend сървърът не отговаря правилно. Моля проверете дали сървърът работи на порт 5000.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Грешка при регистрация");
      }

      setSuccess("Успешна регистрация! Можете да влезете.");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.name === "TypeError") {
        setError("Не може да се свърже със сървъра. Моля проверете дали backend сървърът работи на порт 5000.");
      } else if (err.message.includes("Unexpected token")) {
        setError("Backend сървърът не отговаря правилно. Проверете дали сървърът работи.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Регистрация</h1>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Име</label>
          <input
            type="text"
            name="first_name"
            placeholder="Въведете име"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <label>Фамилия</label>
          <input
            type="text"
            name="last_name"
            placeholder="Въведете фамилия"
            value={form.last_name}
            onChange={handleChange}
            required
          />

          <label>Потребителско име</label>
          <input
            type="text"
            name="username"
            placeholder="Въведете потребителско име"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Въведете email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Телефон</label>
          <input
            type="text"
            name="phone"
            placeholder="Въведете телефон"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Парола</label>
          <input
            type="password"
            name="password"
            placeholder="Въведете парола"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Повторете паролата</label>
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Повторете паролата"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-submit">
            Регистрация
          </button>
        </form>

        <p className="login-text">
          Вече имате акаунт?{" "}
          <Link to="/login" className="login-link">
            Вход
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

