import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  metadataBase: new URL("https://aheadterra.com"),
  title: "Terra – Psychic & Jyotishvidya Readings",
  description: "Get your unique reading from Himanshu Tiwari.",
  openGraph: {
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    url: "https://aheadterra.com",
    siteName: "Terra",
    images: [
      {
        url: "https://aheadterra.com/images/himanshu-tiwari-og.jpg",
        width: 1200,
        height: 630,
        alt: "Himanshu Tiwari – Terra Psychic Reading",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    images: ["https://aheadterra.com/images/himanshu-tiwari-og.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{
            padding: "10px 20px",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#1976d2",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Terra
          </span>
          <Link href="/">Home</Link>
          <span> | </span>
          <Link href="/services">Services</Link>
          {user ? (
            <>
              <span>|</span>
              <span>Welcome, {user.name} ({user.role})</span>
              <span>|</span>
              <Link href="/profile">Dashboard</Link>
              {user.role === "useradmin" && (
                <>
                  <span>|</span>
                  <Link href="/services/create">Create Service</Link>
                  <span>|</span>
                  <Link href="/admin/services">Admin Services</Link>
                  <span>|</span>
                  <Link href="/admin/">Admin Dashboard</Link>
                </>
              )}
              <span>|</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <span>|</span>
              <Link href="/login">Login</Link>
              <span>|</span>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </nav>
        {loading ? <main style={{ padding: 20 }}>Loading…</main> : children}
      </body>
    </html>
  );
}


