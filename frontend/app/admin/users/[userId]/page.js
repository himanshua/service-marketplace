"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function EditUserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
          setRole(data.user.role);
        } else {
          setError(data.message || "User not found");
        }
        setLoading(false);
      });
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, role }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setSuccess("✅ User updated!");
    } else {
      setError(data.message || "Failed to update user.");
    }
  };

  if (loading) return <main>Loading...</main>;
  if (error) return <main>Error: {error}</main>;

  return (
    <main>
      <nav style={{ marginBottom: 24 }}>
        <Link href="/admin/services" style={{ marginRight: 16 }}>Admin Services</Link>
        <Link href="/admin/">Admin Dashboard</Link>
      </nav>
      <h1>Edit User</h1>
      <form onSubmit={handleSave}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          style={{ marginRight: 8 }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{ marginRight: 8 }}
        />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ marginRight: 8 }}>
          <option value="usernormal">usernormal</option>
          <option value="userexpert">userexpert</option>
          <option value="useradmin">useradmin</option>
        </select>
        <button type="submit">Save</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </main>
  );
}