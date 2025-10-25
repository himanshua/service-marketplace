"use client";

import { useEffect, useState } from "react";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [userId, setUserId] = useState("");

  const fetchServices = () => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.services) setServices(data.services);
        else setError(data.message || "Failed to fetch services.");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  // Delete a service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/admin/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setServices(services.filter(s => s._id !== id));
    } else {
      alert(data.message || "Failed to delete service.");
    }
  };

  // Start editing a service
  const startEdit = (service) => {
    setEditId(service._id);
    setEditTitle(service.title);
    setEditDesc(service.description);
  };

  // Save edited service
  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/admin/${editId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setServices(services.map(s => (s._id === editId ? data.service : s)));
      setEditId(null);
      setEditTitle("");
      setEditDesc("");
    } else {
      alert(data.message || "Failed to edit service.");
    }
  };

  const fetchServicesByUser = async () => {
    const res = await fetch(`/api/services?provider=${userId}`);
    const data = await res.json();
    setServices(data);
  };

  if (loading) return <main>Loading...</main>;
  if (error) return <main>Error: {error}</main>;

  return (
    <main>
      <h1>Admin Service Management</h1>
      <div>
        <h2>View Services by User</h2>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        <button onClick={fetchServicesByUser}>Fetch Services</button>
        <ul>
          {services.map(s => (
            <li key={s._id}>{s.title} - {s.category}</li>
          ))}
        </ul>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s._id}>
              <td>
                {editId === s._id ? (
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                ) : (
                  s.title
                )}
              </td>
              <td>
                {editId === s._id ? (
                  <input
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                  />
                ) : (
                  s.description
                )}
              </td>
              <td>{s.owner}</td>
              <td>{s.approved ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleDelete(s._id)}>Delete</button>
                {editId === s._id ? (
                  <>
                    <button onClick={handleEdit}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(s)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}