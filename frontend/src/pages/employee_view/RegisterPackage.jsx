import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegisterPackage.css";

const API = "http://localhost:5000";

function RegisterPackage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [clients, setClients] = useState([]);
  const [offices, setOffices] = useState([]);

  const [form, setForm] = useState({
    date_pack_start: "",
    sender_id: "",
    receiver_id: "",
    sender_office_id: "",
    receiver_office_id: "",
    description: "",
    weight: "",
    homeSender: 0,
    homeReceiver: 0,
  });

  useEffect(() => {
    const loadCreateData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/packages/createPackages`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Неуспешно зареждане на данни за пратка.");

        const data = await res.json();
        setClients(data.dataCustomer || []);
        setOffices(data.dataOffices || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadCreateData();
  }, []);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    // minimal validation
    if (!form.date_pack_start || !form.sender_id || !form.receiver_id || !form.sender_office_id) {
      setError("Моля попълнете: дата, изпращач, получател, офис изпращач.");
      return;
    }
    if (!form.weight || Number(form.weight) <= 0) {
      setError("Моля въведете валидно тегло.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/packages/addPackages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date_pack_start: form.date_pack_start,
          sender_id: Number(form.sender_id),
          receiver_id: Number(form.receiver_id),
          sender_office_id: Number(form.sender_office_id),
          receiver_office_id: form.receiver_office_id ? Number(form.receiver_office_id) : 0,
          description: form.description || null,
          weight: Number(form.weight),
          homeSender: Number(form.homeSender),
          homeReceiver: Number(form.homeReceiver),
        }),
      });

      const text = await res.text();
      let body = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { raw: text };
      }

      if (!res.ok) throw new Error(body.error || body.raw || "Грешка при създаване на пратка.");

      setSuccess(`Пратката е създадена успешно (ID: ${body.id}).`);
      // go to all packages after a moment
      setTimeout(() => navigate("/packages"), 600);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="regpack-page">
      <div className="regpack-card">
        <h2>Регистрация на пратка</h2>

        {loading && <p>Зареждане...</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form className="regpack-form" onSubmit={submit}>
          <label>
            Дата
            <input
              type="date"
              value={form.date_pack_start}
              onChange={(e) => update("date_pack_start", e.target.value)}
            />
          </label>

          <label>
            Изпращач (клиент)
            <select value={form.sender_id} onChange={(e) => update("sender_id", e.target.value)}>
              <option value="">-- избери --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </label>

          <label>
            Получател (клиент)
            <select value={form.receiver_id} onChange={(e) => update("receiver_id", e.target.value)}>
              <option value="">-- избери --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </label>

          <label>
            Офис изпращач
            <select
              value={form.sender_office_id}
              onChange={(e) => update("sender_office_id", e.target.value)}
            >
              <option value="">-- избери --</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.office_name} ({o.city})
                </option>
              ))}
            </select>
          </label>

          <label>
            Офис получател
            <select
              value={form.receiver_office_id}
              onChange={(e) => update("receiver_office_id", e.target.value)}
            >
              <option value="">-- (няма/неизвестен) --</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.office_name} ({o.city})
                </option>
              ))}
            </select>
          </label>

          <label>
            Описание
            <input
              type="text"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="например: дрехи, документи..."
            />
          </label>

          <label>
            Тегло (кг)
            <input
              type="number"
              step="0.001"
              value={form.weight}
              onChange={(e) => update("weight", e.target.value)}
            />
          </label>

          <label>
            Взимане от адрес (изпращач)
            <select
              value={form.homeSender}
              onChange={(e) => update("homeSender", e.target.value)}
            >
              <option value={0}>Не</option>
              <option value={1}>Да</option>
            </select>
          </label>

          <label>
            Доставка до адрес (получател)
            <select
              value={form.homeReceiver}
              onChange={(e) => update("homeReceiver", e.target.value)}
            >
              <option value={0}>Не</option>
              <option value={1}>Да</option>
            </select>
          </label>

          <button className="save-btn" type="submit" disabled={loading}>
            Създай пратка
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPackage;
