import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/AdminEmployees.css";

function AdminEmployees() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toString().toLowerCase();
  if (role !== "admin") return <Navigate to="/dashboard" />;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: "",
    password: "",
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", email: "", role_id: "", password: "" });
  };

  const loadEmployees = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/employees/getEmployee", {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка при зареждане.");

      setEmployees(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!form.name.trim()) throw new Error("Моля, въведете име.");
      if (!form.email.trim()) throw new Error("Моля, въведете email.");
      if (!String(form.role_id).trim()) throw new Error("Моля, въведете role_id.");

      // create (исква password)
      if (!editingId && !form.password.trim()) {
        throw new Error("Паролата е задължителна при добавяне на служител.");
      }

      const url = editingId
        ? "http://localhost:5000/employees/updateEmployee"
        : "http://localhost:5000/employees/addEmployee";

      const payload = editingId
        ? { id: editingId, name: form.name, email: form.email, role_id: form.role_id }
        : { name: form.name, email: form.email, role_id: form.role_id, password: form.password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка при запис.");

      setSuccess(editingId ? "Служителят е обновен." : "Служителят е добавен.");
      resetForm();
      loadEmployees();
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (emp) => {
    setError("");
    setSuccess("");
    setEditingId(emp.id);
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      role_id: emp.role_id ?? "",
      password: "", // не се пипа при edit
    });
  };

  return (
    <div className="admin-page">
      <h1>Служители</h1>

      {error && <p className="admin-msg error">{error}</p>}
      {success && <p className="admin-msg success">{success}</p>}

      <div className="admin-grid">
        {/* FORM */}
        <div className="admin-card">
          <h3 className="admin-card-title">
            {editingId ? "Редакция на служител" : "Нов служител"}
          </h3>

          <form className="admin-form" onSubmit={submitForm}>
            <label>Име</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Иван Иванов"
            />

            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="employee@ysmm.bg"
            />

            <label>Role ID</label>
            <input
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: e.target.value })}
              placeholder="например: 1"
            />

            {!editingId && (
              <>
                <label>Парола (само при добавяне)</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="********"
                />
              </>
            )}

            <div className="admin-actions">
              <button type="submit" className="primary">
                {editingId ? "Запази" : "Добави"}
              </button>

              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  Откажи
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="admin-card">
          <h3 className="admin-card-title">Списък</h3>

          {loading ? (
            <div className="admin-loading">Зареждане...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Име</th>
                  <th>Email</th>
                  <th>Role ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty">
                      Няма служители за показване.
                    </td>
                  </tr>
                ) : (
                  employees.map((e) => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.email || "-"}</td>
                      <td>{e.role_id}</td>
                      <td className="right">
                        <button className="icon-btn" onClick={() => startEdit(e)}>
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          
        </div>
      </div>
    </div>
  );
}

export default AdminEmployees;

