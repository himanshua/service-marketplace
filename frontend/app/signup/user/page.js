"use client";
import { useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import { MdErrorOutline } from "react-icons/md";
import React from "react";

export default function UserSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Role is fixed for this signup variant; no need for state
  const role = "usernormal";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
    };

    if (data.name.length === 0) {
      setNameError("Name cannot be empty");
      nameInputRef.current.focus();
      return;
    }
    setNameError("");

    if (data.email.length === 0) {
      setEmailError("Email cannot be empty");
      emailInputRef.current.focus();
      return;
    }
    const parts = data.email.split("@");
    if (
      parts.length !== 2 ||
      parts[0].length === 0 ||
      parts[1].length === 0 ||
      !parts[1].includes(".")
    ) {
      setEmailError("Please enter a valid email");
      emailInputRef.current.focus();
      return;
    }
    setEmailError("");

    if (data.password.length === 0) {
      setPasswordError("Password cannot be empty");
      passwordInputRef.current.focus();
      return;
    }
    if (data.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      passwordInputRef.current.focus();
      return;
    }
    if (!/[A-Z]/.test(data.password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      passwordInputRef.current.focus();
      return;
    }
    if (!/[a-z]/.test(data.password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      passwordInputRef.current.focus();
      return;
    }
    if (!/[0-9]/.test(data.password)) {
      setPasswordError("Password must contain at least one number");
      passwordInputRef.current.focus();
      return;
    }
    if (!/[!@#$%^&*]/.test(data.password)) {
      setPasswordError("Password must contain at least one special character");
      passwordInputRef.current.focus();
      return;
    }
    if (/\s/.test(data.password)) {
      setPasswordError("Password must not contain spaces");
      passwordInputRef.current.focus();
      return;
    }
    setPasswordError("");

    // Only set loading true after validation passes
    setLoading(true);
    try {
      const res = await fetch(`${API_Base}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
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
      }
      if (res.status === 400) {
        setEmailError(data.message || "User already exists");
        emailInputRef.current.focus();
        return;
      }
    } catch (err) {
      setMessage("⚠️ Network error: " + err.message);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <main className="form-container">
      <h1>User Signup</h1>
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
              setName(e.target.value);
              if (e.target.value === "") setNameError("Name cannot be empty");
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
            id="email"
            ref={emailInputRef}
            className={emailError ? "form-input error-input" : "form-input"}
            placeholder="Email"
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);

              // Real-time validation
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
                  setEmailError(""); // Clear error if valid
                }
              }
            }}
            value={email || ""}
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
              setPassword(e.target.value);
              if (e.target.value === "") setPasswordError("Password cannot be empty");
              else setPasswordError("");
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
