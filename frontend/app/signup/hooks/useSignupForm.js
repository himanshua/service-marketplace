"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Reusable validation helpers
export function validateEmail(value) {
  if (value.length === 0) return "Email cannot be empty";
  const parts = value.split("@");
  if (
    parts.length !== 2 ||
    parts[0].length === 0 ||
    parts[1].length === 0 ||
    !parts[1].includes(".")
  ) {
    return "Please enter a valid email";
  }
  return "";
}

export function validatePassword(val) {
  if (val.length === 0) return "Password cannot be empty";
  if (val.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(val)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(val)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(val)) return "Password must contain at least one number";
  if (!/[!@#$%^&*]/.test(val)) return "Password must contain at least one special character";
  if (/\s/.test(val)) return "Password must not contain spaces";
  return "";
}

export default function useSignupForm({ role }) {
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

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const validateAll = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedName.length === 0) {
      setNameError("Name cannot be empty");
      nameInputRef.current?.focus();
      return false;
    }
    setNameError("");

    const emailErr = validateEmail(trimmedEmail);
    if (emailErr) {
      setEmailError(emailErr);
      emailInputRef.current?.focus();
      return false;
    }
    setEmailError("");

    const pwdErr = validatePassword(trimmedPassword);
    if (pwdErr) {
      setPasswordError(pwdErr);
      passwordInputRef.current?.focus();
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateAll()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_Base}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
        resetFields();
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

  return {
    // state
    name,
    email,
    password,
    message,
    loading,
    emailError,
    passwordError,
    nameError,
    // setters
    setName,
    setEmail,
    setPassword,
    setEmailError,
    setPasswordError,
    setNameError,
    // refs
    nameInputRef,
    emailInputRef,
    passwordInputRef,
    // handlers
    handleSubmit,
    validatePassword,
    validateEmail,
  };
}
