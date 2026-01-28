import { useState } from "react";
import "../styles/Offices.css";

function Offices() {
  const [city, setCity] = useState("");
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleShowAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/offices/listOffices");
      const data = await res.json();
      setOffices(data);
    } catch {
      setError("Неуспешно зареждане на офисите");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:5000/offices/searchByCity?city=${city}`
      );
      const data = await res.json();
      setOffices(data);
    } catch {
      setError("Грешка при търсене");
      setOffices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offices-page">
      <div className="offices-card">
        <h1>Нашите офиси</h1>

        <div className="search-box">
       <input
            type="text"
            placeholder="Въведете град..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
            handleSearch();
            }
          }}
          />
          <button onClick={handleSearch}>Търси</button>
        </div>

        <button className="show-all-btn" onClick={handleShowAll}>
          Покажи всички офиси
        </button>

        {loading && <p>Зареждане...</p>}
        {error && <p className="error">{error}</p>}


        {offices.length > 0 ? (
          <ul className="office-list">
            {offices.map((office) => (
              <li key={office.id}>
                <strong>{office.office_name}</strong><br />
                {office.address}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>Няма намерени офиси.</p>
        )}

        {/* {offices.length > 0 && (
          <ul className="office-list">
            {offices.map((office) => (
              <li key={office.id}>
                <strong>{office.office_name}</strong>
                 {office.address}
              </li>
            ))}
          </ul>
        )  */}
      </div>
    </div>
  );
}

export default Offices;

