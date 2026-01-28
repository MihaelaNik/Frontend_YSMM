import "../styles/Contacts.css";
import logo from "../assets/logo.png";

function Contacts() {
  return (
    <div className="contacts-page">
      {/* HERO */}
      <section className="contacts-hero">
        <div className="contacts-hero-inner">
          <img src={logo} alt="YSMM Logo" className="contacts-logo" />
          <h1>Контакти</h1>
          <p>
            Свържете се с нас – обслужване на клиенти, офис информация и партньорства.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="contacts-section">
        <div className="contacts-grid-single">
          <div className="contacts-info">
            <h2>Информация за контакт</h2>

            <div className="info-item">
              <span>📍</span>
              <div>
                <b>Централен офис</b>
                <p>гр. София, бул. „Витоша“ 1</p>
              </div>
            </div>

            <div className="info-item">
              <span>📞</span>
              <div>
                <b>Телефон</b>
                <p>+359 888 123 456</p>
              </div>
            </div>

            <div className="info-item">
              <span>✉️</span>
              <div>
                <b>Email</b>
                <p>contact@ysmm.bg</p>
              </div>
            </div>

            <div className="info-item">
              <span>🕘</span>
              <div>
                <b>Работно време</b>
                <p>Понеделник – Петък: 09:00 – 18:00</p>
              </div>
            </div>

            <div className="contacts-extra">
              <div className="extra-card">
                <div className="k">📦 За пратки</div>
                <div className="v">
                  За информация относно пратка използвайте My-YSMM или посетете най-близкия офис.
                </div>
              </div>

              <div className="extra-card">
                <div className="k">🏢 Офиси</div>
                <div className="v">
                  Мрежа от офиси в цялата страна за удобно изпращане и получаване.
                </div>
              </div>

              <div className="extra-card">
                <div className="k">🤝 Партньорства</div>
                <div className="v">
                  За бизнес клиенти и договори: business@ysmm.bg
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="contacts-footer">
        <p>YSMM Logistics – винаги близо до вас.</p>
      </footer>
    </div>
  );
}

export default Contacts;

