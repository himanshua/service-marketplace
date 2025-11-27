import Link from "next/link";

export default function HowToOrder() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <div className="home-content-col" style={{ background: "#fff", padding: "32px 24px", borderRadius: 12, maxWidth: 700, margin: "32px auto" }}>
          <h1 style={{ color: "#1976d2", marginBottom: 16 }}>How to order Jyotishavidya Readings</h1>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>offered by Himanshu Tiwari</h2>
          <p style={{ fontSize: "1.1rem", marginBottom: 16 }}>
            Most readings are delivered within 2–6 days after payment is received.
          </p>
          <p style={{ color: "#b71c1c", fontWeight: 500, marginBottom: 16 }}>
            Please note: Jyotishavidya readings are provided for educational purposes to students of the vidya. No warranty is expressed or implied.
          </p>
          <p style={{ marginBottom: 16 }}>
            To order, please email&nbsp;
            <a
              href="mailto:himanshu,inperson@gmail.com"
              style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 600 }}
            >
              Himanshu Tiwari
            </a>
            &nbsp;with the following required information:
          </p>
          <ul style={{ marginBottom: 24, fontSize: "1.05rem" }}>
            <li>
              <b>Your name and gender</b> as you would like it to appear on the printed charts
            </li>
            <li>
              <b>BIRTH-DATE</b> – format <code>DD-MMM-YYYY</code> (example: <code>24-Apr-2001</code>)
            </li>
            <li>
              <b>BIRTH-TIME</b> – format <code>HH:MM</code> (please specify AM or PM <i>and</i> 24-hour format, e.g., <code>8:20pm = 20:20</code>).<br />
              Time must be accurate to the minute. Ideally, use the time from an official birth certificate.
            </li>
            <li>
              <b>BIRTH-PLACE</b> – name of your city, town, or village <i>and</i> its Google coordinates<br />
              (example: Bengaluru, Karnataka, India 12°59′N 77°35′E)
            </li>
            <li>
              <b>Five to ten questions</b> you would like answered from a Jyotisha perspective.<br />
              Please compose thoughtful, specific, and meaningful questions. Avoid self-criticism and focus on what is most important to you.
            </li>
          </ul>
          <Link href="/" style={{ color: "#1976d2", textDecoration: "underline" }}>
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
