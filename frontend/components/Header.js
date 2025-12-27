import Link from "next/link";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <nav className="nav-links">
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a href="mailto:himanshu@aheadterra.com" style={{ marginLeft: 12, color: "#1976d2", textDecoration: "none" }}>himanshu@aheadterra.com</a>
          <Link href="/login" className="login-btn">Login</Link>
        </nav>
      </div>
    </header>
  );
}