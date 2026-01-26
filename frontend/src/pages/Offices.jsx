import { useState } from "react";
import "../styles/Offices.css";

function Offices() {
  const [city, setCity] = useState("");          // Град, който се търси
  const [offices, setOffices] = useState([]);    // Резултати от backend
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      // Примерен URL – замени с реалния бекенд
      const response = await fetch(`http://localhost:5000/offices?city=${city}`);
      if (!response.ok) throw new Error("Грешка при зареждане на данните");

      const data = await response.json();
      setOffices(data);
    } catch (err) {
      setError(err.message);
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
          />
          <button onClick={handleSearch}>Търси</button>
        </div>

        {loading && <p>Зареждане...</p>}
        {error && <p className="error">{error}</p>}

        {offices.length > 0 ? (
          <ul className="office-list">
            {offices.map((office) => (
              <li key={office.id}>
                <strong>{office.name}</strong> – {office.address}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>Няма намерени офиси.</p>
        )}
      </div>
    </div>
  );
}

export default Offices;
