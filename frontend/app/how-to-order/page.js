import Link from "next/link";
import HomeRow from "../HomeRow";

export default function HowToOrder() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow
          label="How to order Jyotishavidya Readings"
          imgSrc="/images/Earth_flag.jpg"
          imgAlt="How to order Jyotishavidya Readings"
          imgStyle={{
            width: "100%",
            maxWidth: 340,
            height: 220,
            maxHeight: 220,
            objectFit: "contain",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>How to order Jyotishavidya Readings</h2>
          <p>
            Offered by Himanshu Tiwari. Most readings are delivered within 2–6 days after payment is received.
            <br /><br />
            <b>Note:</b> Jyotishavidya readings are provided for educational purposes to students of the vidya. No warranty is expressed or implied.
          </p>
          <p>
            To order, please visit&nbsp;
            <a
              href="https://aheadterra.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 600 }}
            >
              aheadterra.com
            </a>
            &nbsp;or email&nbsp;
            <a
              href="mailto:himanshu,inperson@gmail.com"
              style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 600 }}
            >
              Himanshu Tiwari
            </a>
            &nbsp;with the following required information:
          </p>
          <ul>
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
        </HomeRow>
      </div>
    </main>
  );
}
