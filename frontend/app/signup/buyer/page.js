"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";

// Minimal styling reuse: we assume global CSS or parent styles; could import a shared CSS if needed.
export default function BuyerSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const router = useRouter();
  const API_Base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const validatePassword = (val) => {
    if (val.length === 0) return "Password cannot be empty";
    if (val.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(val)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(val)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(val)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(val)) return "Password must contain at least one special character";
    if (/\s/.test(val)) return "Password must not contain spaces";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedName.length === 0) {
      setNameError("Name cannot be empty");
      nameInputRef.current?.focus();
      return;
    }
    setNameError("");

    if (trimmedEmail.length === 0) {
      setEmailError("Email cannot be empty");
      emailInputRef.current?.focus();
      return;
    }
    const parts = trimmedEmail.split("@");
    if (
      parts.length !== 2 ||
      parts[0].length === 0 ||
      parts[1].length === 0 ||
      !parts[1].includes(".")
    ) {
      setEmailError("Please enter a valid email");
      emailInputRef.current?.focus();
      return;
    }
    setEmailError("");

    const pwdErr = validatePassword(trimmedPassword);
    if (pwdErr) {
      setPasswordError(pwdErr);
      passwordInputRef.current?.focus();
      return;
    }
    setPasswordError("");

    setLoading(true);
    try {
      const res = await fetch(`${API_Base}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          role: "buyer",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.message || "❌ Signup failed");
        if (res.status === 400) {
          setEmailError(data.message || "User already exists");
          emailInputRef.current?.focus();
        }
      }
    } catch (err) {
      setMessage("⚠️ Network error: " + err.message);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <main className="form-container">
      <h1>Buyer Signup</h1>
      {loading && <div className="loading-spinner">Signing up...</div>}
      {message.startsWith("✅") && <div className="success-message">{message}</div>}
      {message.startsWith("❌") || message.startsWith("⚠️") ? (
        <div className="top-error-message">{message}</div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Name</label>
          <input
            type="text"
            ref={nameInputRef}
            placeholder="Name"
            className={nameError ? "form-input error-input" : "form-input"}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              if (value === "") setNameError("Name cannot be empty");
              else setNameError("");
            }}
            value={name}
          />
          <span className="error" aria-live="polite">
            {nameError && (
              <MdErrorOutline
                style={{ verticalAlign: "middle", color: "#d32f2f", marginRight: "4px" }}
              />
            )}
            {nameError && <span className="visually-hidden">Error:</span>}
            {nameError}
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">Email</label>
          <input
            type="text"
            ref={emailInputRef}
            placeholder="Email"
            className={emailError ? "form-input error-input" : "form-input"}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (value.length === 0) {
                setEmailError("Email cannot be empty");
              } else {
                const parts = value.split("@");
                if (
                  parts.length !== 2 ||
                  parts[0].length === 0 ||
                  parts[1].length === 0 ||
                  !parts[1].includes(".")
                ) {
                  setEmailError("Please enter a valid email");
                } else {
                  setEmailError("");
                }
              }
            }}
            value={email}
          />
          <span className="error" aria-live="polite">
            {emailError && (
              <MdErrorOutline
                style={{ verticalAlign: "middle", color: "#d32f2f", marginRight: "4px" }}
              />
            )}
            {emailError && <span className="visually-hidden">Error:</span>}
            {emailError}
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">Password</label>
          <input
            type="password"
            ref={passwordInputRef}
            placeholder="Password"
            className={passwordError ? "form-input error-input" : "form-input"}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordError(validatePassword(value));
            }}
            value={password}
          />
          <ul className="password-requirements">
            <li>At least 8 characters long</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character (!@#$%^&*)</li>
            <li>No spaces</li>
          </ul>
          <span className="error" aria-live="polite">
            {passwordError && (
              <MdErrorOutline
                style={{ verticalAlign: "middle", color: "#d32f2f", marginRight: "4px" }}
              />
            )}
            {passwordError && <span className="visually-hidden">Error:</span>}
            {passwordError}
          </span>
        </div>

        <button className="form-submit" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
