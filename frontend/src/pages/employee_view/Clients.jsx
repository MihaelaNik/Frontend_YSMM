import { useEffect, useState } from "react";
import "../../styles/Clients.css";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/clients/listClients", {
          credentials: "include", // IMPORTANT (sessions)
        });

        if (res.status === 401) throw new Error("Трябва да влезете в системата.");
        if (res.status === 403) throw new Error("Нямате права (само за служители).");
        if (!res.ok) throw new Error("Грешка при зареждане на клиентите.");

        const data = await res.json();
        setClients(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleDelete = async (id) => {
  const ok = window.confirm("Сигурни ли сте, че искате да изтриете клиента?");
  if (!ok) return;

  try {
    setLoading(true);
    setError(null);

    const res = await fetch(`http://localhost:5000/clients/deleteClient/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      throw new Error(data.error || data.message || data.raw || "Грешка при изтриване");
    }

    setClients((prev) => prev.filter((c) => c.id !== id));
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="clients-page">
      <div className="clients-card">
        <h2>Клиенти</h2>

        {loading && <p>Зареждане...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && clients.length === 0 && <p>Няма клиенти.</p>}

        {clients.length > 0 && (
          <div className="clients-table-wrap">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Име</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Държава</th>
                  <th>Град</th>
                  <th>Адрес</th>
                  <th>Действия</th>

                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.email || "-"}</td>
                    <td>{c.country || "-"}</td>
                    <td>{c.city || "-"}</td>
                    <td>{c.address || "-"}</td>
                    <td>
                      <button
                      className="danger-btn"
                      onClick={() => handleDelete(c.id)}
                    >
                      Изтрий
                    </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;
