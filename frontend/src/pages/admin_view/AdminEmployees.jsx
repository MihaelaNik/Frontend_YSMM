import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/AdminOffices.css";

function AdminEmployees() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toLowerCase();
  if (role !== "admin") return <Navigate to="/dashboard" />;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: "",
    password: "",
  });

  // 🔹 зареждане на служителите
  const loadEmployees = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/employees/getEmployee", {
      credentials: "include",
    });
    const data = await res.json();
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // 🔹 submit (add / update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.role_id) {
      alert("Моля, попълнете всички полета.");
      return;
    }

    if (!editingId && !form.password.trim()) {
      alert("Паролата е задължителна при добавяне на служител.");
      return;
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

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Грешка при запис.");
      return;
    }

    setForm({
      name: "",
      email: "",
      role_id: "",
      password: "",
    });
    setEditingId(null);
    loadEmployees();
  };

  // 🔹 edit
  const editEmployee = (emp) => {
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      role_id: emp.role_id || "",
      password: "",
    });
    setEditingId(emp.id);
  };

  // 🔹 delete
  const deleteEmployee = async (id) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете служителя?")) return;

    const res = await fetch("http://localhost:5000/employees/deleteEmployee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Грешка при изтриване.");
      return;
    }

    loadEmployees();
  };

  if (loading) {
    return <div className="admin-page">Зареждане...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Управление на служители</h1>

      <form className="office-form" onSubmit={handleSubmit}>
        <input
          placeholder="Име"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          placeholder="Role ID"
          type="number"
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          required
        />

        {!editingId ? (
          <input
            placeholder="Парола"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        ) : (
          <input
            placeholder="Парола (не се променя)"
            type="password"
            disabled
            style={{ opacity: 0.5, cursor: "not-allowed" }}
          />
        )}

        <button type="submit">
          {editingId ? "Запази промените" : "Добави служител"}
        </button>
      </form>

      <table className="office-table">
        <thead>
          <tr>
            <th>Име</th>
            <th>Email</th>
            <th>Role ID</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email || "-"}</td>
              <td>{e.role_id || "-"}</td>
              <td>
                <button onClick={() => editEmployee(e)}>✏️</button>
                {/*<button onClick={() => deleteEmployee(e.id)}>🗑️</button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table> 
    </div>
  );
}

export default AdminEmployees;
