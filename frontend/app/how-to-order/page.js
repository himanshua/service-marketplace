"use client";
import Link from "next/link";
import HomeRow from "../HomeRow";

export default function HowToOrder() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow
          imgSrc="images/Ganesha.jpeg"
          imgAlt="Welcome"
        >
          <h2>Beej Mantra</h2>
          <p>
            Aum Hreem Hraum Suryayeh Namah, Aum Hreem Shreem Chandraya Namah, Aum Eim Hreem Shreem Mangalayeh Namah, Aum Aim Streem Bam Budhayeh Namah, Aum Hreem Brahm Brihaspatayeh Namah, Aum Hreem Shreem Shukrayeh Namah, Aum Hreem Shreem Sam Sanneshcharayeh Namah, Aum Eim Hreem Rahuvey Namah, Aum Eim Hreem Ketuvey Namah.
          </p>
        </HomeRow>
      </div>
    </main>
  );
}