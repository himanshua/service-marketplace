"use client";
// (All state handled inside shared hook)
import useSignupForm from "../hooks/useSignupForm";
import "./page.css";
import { MdErrorOutline } from "react-icons/md";
import React from "react";

export default function UserSignup() {
  const {
    name,
    email,
    password,
    message,
    loading,
    emailError,
    passwordError,
    nameError,
    setName,
    setEmail,
    setPassword,
    setEmailError,
    setNameError,
    nameInputRef,
    emailInputRef,
    passwordInputRef,
    handleSubmit,
    validatePassword,
  } = useSignupForm({ role: "usernormal" });

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
            id="email"
            ref={emailInputRef}
            className={emailError ? "form-input error-input" : "form-input"}
            placeholder="Email"
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (value.length === 0) setEmailError("Email cannot be empty");
              else if (!value.includes("@")) setEmailError("Please enter a valid email");
              else setEmailError("");
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
              const value = e.target.value;
              setPassword(value);
              // basic live feedback using shared validator
              const err = validatePassword(value);
              setPasswordError(err);
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
