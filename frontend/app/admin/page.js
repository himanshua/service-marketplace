"use client";

import { useEffect, useState } from "react";

const ROLES = ["usernormal", "userexpert", "useradmin"];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
        else setError(data.message || "Failed to fetch users.");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const startEdit = (user) => {
    setEditId(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleSave = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setUsers(users.map(u => (u._id === id ? { ...u, name: editName, email: editEmail } : u)));
      setEditId(null);
    } else {
      alert(data.message || "Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/users/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setUsers(users.filter(u => u._id !== id));
    } else {
      alert(data.message || "Failed to delete user.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/users/${id}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setUsers(users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
    } else {
      alert(data.message || "Failed to change role.");
    }
  };

  if (loading) return <main>Loading...</main>;
  if (error) return <main>Error: {error}</main>;

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>
                {editId === u._id ? (
                  <input value={editName} onChange={e => setEditName(e.target.value)} />
                ) : u.name}
              </td>
              <td>
                {editId === u._id ? (
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                ) : u.email}
              </td>
              <td>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u._id, e.target.value)}
                  disabled={editId === u._id}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td>
                {editId === u._id ? (
                  <>
                    <button onClick={() => handleSave(u._id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}