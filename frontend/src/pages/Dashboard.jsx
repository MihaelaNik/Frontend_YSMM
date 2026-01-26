import { Navigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toString().toLowerCase();

  return (
    <div style={{ padding: "32px" }}>
      <h1>Добре дошли</h1>

      {role === "client" && <p>Тук можете да следите и изпращате пратки.</p>}
      {role === "employee" && <p>Тук можете да управлявате логистичната система.</p>}
    </div>
  );
}

export default Dashboard;


