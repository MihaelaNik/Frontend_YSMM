import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/MyProfile.css";

function MyProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toString().toLowerCase();
  if (role !== "client") return <Navigate to="/dashboard" />;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [client, setClient] = useState(null);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadClient = async () => {
      setError("");
      setSuccess("");

      try {
        const res = await fetch("http://localhost:5000/clients/myClient", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Грешка при зареждане на профила.");
        }

        setClient(data);
        setCountry(data.country || "");
        setCity(data.city || "");
        setAddress(data.address || "");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, []);

  const saveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/clients/updateAddress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ country, city, address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Грешка при запис на адреса.");
      }

      setSuccess("Адресът е обновен успешно.");

      // обновяваме текущия адрес на екрана
      setClient((prev) => ({
        ...prev,
        country,
        city,
        address,
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">Зареждане...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Моят профил</h2>

        {error && <p className="profile-error">{error}</p>}
        {success && <p className="profile-success">{success}</p>}

        {client && (
          <div className="profile-info">
            <p><b>Име:</b> {client.name}</p>
            <p><b>Email:</b> {client.email || "-"}</p>
            <p><b>Телефон:</b> {client.phone}</p>
          </div>
        )}

        {/* ТЕКУЩ АДРЕС */}
        <div className="current-address">
          <h3>Текущ адрес</h3>

          {client?.country || client?.city || client?.address ? (
            <p>
              {client.country && <span>{client.country}, </span>}
              {client.city && <span>{client.city}, </span>}
              {client.address && <span>{client.address}</span>}
            </p>
          ) : (
            <p className="no-address">Няма въведен адрес</p>
          )}
        </div>

        {/* ПРОМЯНА НА АДРЕС */}
        <h3>Промяна на адрес</h3>

        <form className="profile-form" onSubmit={saveAddress}>
          <div>
            <label>Държава</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Bulgaria"
            />
          </div>

          <div>
            <label>Град</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Sofia"
            />
          </div>

          <div className="full-width">
            <label>Адрес</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ул. ... №..."
            />
          </div>

          <button
            className="profile-save-btn"
            type="submit"
            disabled={saving}
          >
            {saving ? "Запис..." : "Запази адрес"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyProfile;

