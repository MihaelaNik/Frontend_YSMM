import { Navigate, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toString().toLowerCase();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-title">
          Добре дошли{user.first_name ? `, ${user.first_name}` : ""}!
        </h1>

        {/* ================= CLIENT ================= */}
        {role === "client" && (
          <>
            <p className="dashboard-text">
              От тук можете да управлявате вашите пратки, да проследявате
              текущия им статус и да поддържате актуална информацията
              във вашия профил.
            </p>

            <div className="dashboard-info-grid">
              <div
                className="info-card clickable"
                onClick={() => navigate("/my-packages")}
              >
                <div className="icon">📦</div>
                <h3>Моите пратки</h3>
                <p>Преглед на всички изпратени и получени пратки.</p>
              </div>

              <div
                className="info-card clickable"
                onClick={() => navigate("/my-profile")}
              >
                <div className="icon">👤</div>
                <h3>Моят профил</h3>
                <p>Актуализация на лични данни и адрес за доставка.</p>
              </div>
            </div>
          </>
        )}

        {/* ================= EMPLOYEE ================= */}
        {role === "employee" && (
          <>
            <p className="dashboard-text">
              Административен панел за управление на логистичната система.
            </p>

            <div className="dashboard-info-grid">
              <div
                className="info-card clickable"
                onClick={() => navigate("/packages")}
              >
                <div className="icon">📦</div>
                <h3>Всички пратки</h3>
                <p>Преглед и управление на всички пратки.</p>
              </div>

              <div
                className="info-card clickable"
                onClick={() => navigate("/register-package")}
              >
                <div className="icon">➕</div>
                <h3>Регистрация</h3>
                <p>Създаване на нови пратки.</p>
              </div>

              <div
                className="info-card clickable"
                onClick={() => navigate("/reports")}
              >
                <div className="icon">📊</div>
                <h3>Справки</h3>
                <p>Отчети и статистики.</p>
              </div>
            </div>
          </>
        )}

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <p className="dashboard-text">
              Административен панел за управление на системата на YSMM.
            </p>

            <div className="dashboard-info-grid">
              <div
                className="info-card clickable"
                onClick={() => navigate("/admin/employees")}
              >
                <div className="icon">👨‍💼</div>
                <h3>Служители</h3>
                <p>CRUD операции за служители.</p>
              </div>

              <div
                className="info-card clickable"
                onClick={() => navigate("/admin/offices")}
              >
                <div className="icon">🏢</div>
                <h3>Офиси</h3>
                <p>Управление на офисите.</p>
              </div>

              <div
                className="info-card clickable"
                onClick={() => navigate("/admin/revenue")}
              >
                <div className="icon">📈</div>
                <h3>Приходи</h3>
                <p>Приходи за избран период.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

