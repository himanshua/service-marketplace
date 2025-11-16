import Link from "next/link";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <nav className="nav-links">
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login" className="login-btn">Login</Link>
        </nav>
      </div>
    </header>
  );
}