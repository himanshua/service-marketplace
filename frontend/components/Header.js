import Link from "next/link";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link href="/" className="logo">
          <img src="/images/logo.png" alt="Terra Logo" height={40} />
        </Link>
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