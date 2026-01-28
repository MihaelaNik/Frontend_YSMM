import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home2">
      {/* HERO */}
      <section className="home2-hero">
        <div className="home2-hero-inner">
          <div className="home2-hero-left">
            <div className="home2-badge">Национална куриерска мрежа</div>

            <h1 className="home2-title">
              Доставяме <span>бързо</span>, <span>сигурно</span> и навреме
            </h1>

            <p className="home2-subtitle">
              YSMM Logistics предлага надеждни куриерски услуги в цялата страна –
              до офис или до точен адрес, с пълна прозрачност и контрол.
            </p>

            <div className="home2-cta">
              <button className="home2-btn" onClick={() => navigate("/login")}>
                My-YSMM
              </button>
              <button
                className="home2-btn secondary"
                onClick={() => navigate("/register")}
              >
                Стани клиент
              </button>
            </div>

            <div className="home2-stats">
              <div className="home2-stat">
                <div className="num">15+</div>
                <div className="label">офиса в страната</div>
              </div>
              <div className="home2-stat">
                <div className="num">24/7</div>
                <div className="label">онлайн проследяване</div>
              </div>
              <div className="home2-stat">
                <div className="num">99%</div>
                <div className="label">успешни доставки</div>
              </div>
            </div>
          </div>

          <div className="home2-hero-right">
            <div className="home2-logo-card">
              <img className="home2-logo" src={logo} alt="YSMM Logo" />
              <div className="home2-logo-text">
                <div className="t1">YSMM Logistics</div>
                <div className="t2">Fast • Secure • Reliable</div>
              </div>
            </div>

            <div className="home2-floating">
              <div className="chip">📦 Изпращане на пратки</div>
              <div className="chip">🔍 Проследяване в реално време</div>
              <div className="chip">🏢 До офис / 📍 До адрес</div>
            </div>
          </div>
        </div>

        <div className="home2-bg-shape s1" />
        <div className="home2-bg-shape s2" />
        <div className="home2-bg-shape s3" />
      </section>

      {/* HOW IT WORKS */}
      <section className="home2-section">
        <div className="home2-container">
          <h2 className="home2-h2">Как работим</h2>

          <div className="home2-steps">
            <div className="home2-step">
              <div className="icon">📝</div>
              <h3>Подаване на пратка</h3>
              <p>Създавате пратка онлайн или на място в офис.</p>
            </div>

            <div className="home2-step">
              <div className="icon">🚚</div>
              <h3>Обработка и транспорт</h3>
              <p>Пратката се обработва и транспортира през нашата мрежа.</p>
            </div>

            <div className="home2-step">
              <div className="icon">✅</div>
              <h3>Доставка</h3>
              <p>Доставяме до офис или до адрес в договорения срок.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="home2-section alt">
        <div className="home2-container home2-two">
          <div>
            <h2 className="home2-h2">За YSMM Logistics</h2>
            <p className="home2-p">
              YSMM Logistics е куриерска компания, ориентирана към качество,
              сигурност и коректно обслужване. Нашата цел е да осигурим
              надеждни доставки както за индивидуални клиенти, така и за бизнес партньори.
            </p>

            <div className="home2-mini">
              <div className="mini-card">
                <div className="mini-title">🔐 Сигурност</div>
                <div className="mini-text">
                  Всяка пратка се обработва с внимание и проследимост.
                </div>
              </div>
              <div className="mini-card">
                <div className="mini-title">📊 Контрол</div>
                <div className="mini-text">
                  Ясен статус и информация за всяка доставка.
                </div>
              </div>
            </div>
          </div>

          <div className="home2-sidecard">
            <div className="side-top">
              <div className="dot" />
              <div className="side-title">Статус на пратките</div>
            </div>
            <div className="side-row"><span className="pill pending">Чакаща</span></div>
            <div className="side-row"><span className="pill transit">В транспорт</span></div>
            <div className="side-row"><span className="pill delivered">Доставена</span></div>
            <div className="side-row"><span className="pill returned">Връщане</span></div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="home2-section">
        <div className="home2-container">
          <h2 className="home2-h2">Нашите услуги</h2>

          <div className="home2-cards">
            <div className="home2-card">
              <h3>🏢 Доставка до офис</h3>
              <p>Икономично и удобно решение за получаване от наш офис.</p>
            </div>
            <div className="home2-card">
              <h3>📍 Доставка до адрес</h3>
              <p>Комфортна доставка до дома или офиса на получателя.</p>
            </div>
            <div className="home2-card">
              <h3>💰 Наложен платеж</h3>
              <p>Възможност за плащане при получаване.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="home2-section alt">
        <div className="home2-container">
          <h2 className="home2-h2">Контакти</h2>

          <div className="home2-contact">
            <div className="contact-card">
              <div className="k">📍 Централен офис</div>
              <div className="v">гр. София, бул. „Витоша“ 1</div>
            </div>
            <div className="contact-card">
              <div className="k">📞 Телефон</div>
              <div className="v">+359 888 123 456</div>
            </div>
            <div className="contact-card">
              <div className="k">✉️ Email</div>
              <div className="v">contact@ysmm.bg</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="home2-footer">
        © {new Date().getFullYear()} YSMM Logistics. Всички права запазени.
      </footer>
    </div>
  );
}

export default Home;


