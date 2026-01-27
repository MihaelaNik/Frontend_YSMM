import { useNavigate } from "react-router-dom";
import "../styles/Services.css";
import logo from "../assets/logo.png";

function Services() {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      {/* HERO */}
      <section className="services-hero">
        <div className="services-hero-inner">
          <img src={logo} alt="YSMM Logo" className="services-logo" />
          <h1>Услуги</h1>
          <p>
            Доставка до офис или до адрес, проследяване и удобни опции за плащане.
          </p>

          <div className="services-cta">
            <button className="services-btn" onClick={() => navigate("/login")}>
              My-YSMM
            </button>
            <button
              className="services-btn secondary"
              onClick={() => navigate("/offices")}
            >
              Офиси
            </button>
          </div>
        </div>
      </section>

      {/* MAIN SERVICES */}
      <section className="services-section">
        <h2>Основни услуги</h2>

        <div className="services-grid">
          <div className="service-card">
            <h3>🏢 Доставка до офис</h3>
            <p>
              Икономично решение за изпращане и получаване. Пратката се получава
              от избран офис на YSMM.
            </p>
            <div className="service-badges">
              <span className="badge green">По-ниска цена</span>
              <span className="badge">Удобно получаване</span>
            </div>
          </div>

          <div className="service-card">
            <h3>📍 Доставка до адрес</h3>
            <p>
              Доставка “до врата” – подходяща за дом или офис. Възможност за
              вземане от адрес и/или доставка до адрес.
            </p>
            <div className="service-badges">
              <span className="badge green">Максимално удобство</span>
              <span className="badge">До посочен адрес</span>
            </div>
          </div>

          <div className="service-card">
            <h3>🔍 Проследяване на пратка</h3>
            <p>
              Следете движението и статуса на вашата пратка с идентификатор
              през My-YSMM.
            </p>
            <div className="service-badges">
              <span className="badge green">24/7</span>
              <span className="badge">Статус в реално време</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXTRA OPTIONS */}
      <section className="services-section light">
        <h2>Допълнителни опции</h2>

        <div className="services-grid">
          <div className="service-card">
            <h3>💰 Наложен платеж</h3>
            <p>
              Плащане при получаване. Подходящо за онлайн продажби и пратки между клиенти.
            </p>
          </div>

          <div className="service-card">
            <h3>📦 Грижа за пратките</h3>
            <p>
              Внимателна обработка и транспортиране с фокус върху сигурността.
            </p>
          </div>

          <div className="service-card">
            <h3>🌱 Еко доставка</h3>
            <p>
              Оптимизация на маршрути и дигитални документи за по-малък въглероден отпечатък.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING (informative) */}
      <section className="services-section">
        <h2>Ориентировъчно ценообразуване</h2>
        <p className="services-note">
          Цената зависи от теглото и начина на доставка (до офис/до адрес).
          Точната цена се изчислява при създаване на пратка в My-YSMM.
        </p>

        <div className="pricing">
          <div className="pricing-card">
            <div className="pricing-title">До офис</div>
            <div className="pricing-text">По-изгодна тарифа</div>
            <div className="pricing-line">• Цена на кг</div>
            <div className="pricing-line">• Без такса “до адрес”</div>
          </div>

          <div className="pricing-card">
            <div className="pricing-title">До адрес</div>
            <div className="pricing-text">Най-удобна доставка</div>
            <div className="pricing-line">• Цена на кг</div>
            <div className="pricing-line">• Доп. такса за вземане/доставка</div>
          </div>
        </div>

        <div className="services-cta-row">
          <button className="services-btn small" onClick={() => navigate("/login")}>
            Изчисли цена / Създай пратка
          </button>
          <button className="services-btn small secondary" onClick={() => navigate("/offices")}>
            Намери офис
          </button>
        </div>
      </section>

      <footer className="services-footer">
        <p>YSMM Logistics – доставка, на която можеш да разчиташ.</p>
      </footer>
    </div>
  );
}

export default Services;
