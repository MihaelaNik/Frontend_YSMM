import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/AdminOffices.css";

function AdminOffices() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toLowerCase();
  if (role !== "admin") return <Navigate to="/dashboard" />;

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    office_name: "",
    country: "Bulgaria",
    city: "",
    address: "",
  });

  // 🔹 зареждане на офисите
  const loadOffices = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/offices/listOffices", {
      credentials: "include",
    });
    const data = await res.json();
    setOffices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOffices();
  }, []);

  // 🔹 submit (add / update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/offices/updateOffices/${editingId}`
      : "http://localhost:5000/offices/createOffices";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Грешка при запис.");
      return;
    }

    setForm({
      office_name: "",
      country: "Bulgaria",
      city: "",
      address: "",
    });
    setEditingId(null);
    loadOffices();
  };

  // 🔹 edit
  const editOffice = (office) => {
    setForm({
      office_name: office.office_name,
      country: office.country,
      city: office.city,
      address: office.address,
    });
    setEditingId(office.id);
  };

  // 🔹 delete
  const deleteOffice = async (id) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете офиса?")) return;

    const res = await fetch(
      `http://localhost:5000/offices/deleteOffices/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      alert("Грешка при изтриване.");
      return;
    }

    loadOffices();
  };

  if (loading) {
    return <div className="admin-page">Зареждане...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Управление на офиси</h1>

      <form className="office-form" onSubmit={handleSubmit}>
        <input
          placeholder="Име на офис"
          value={form.office_name}
          onChange={(e) =>
            setForm({ ...form, office_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Държава"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />

        <input
          placeholder="Град"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />

        <input
          placeholder="Адрес"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />

        <button type="submit">
          {editingId ? "Запази промените" : "Добави офис"}
        </button>
      </form>

      <table className="office-table">
        <thead>
          <tr>
            <th>Име</th>
            <th>Град</th>
            <th>Адрес</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((o) => (
            <tr key={o.id}>
              <td>{o.office_name}</td>
              <td>{o.city}</td>
              <td>{o.address}</td>
              <td>
                <button onClick={() => editOffice(o)}>✏️</button>
                <button onClick={() => deleteOffice(o.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOffices;
