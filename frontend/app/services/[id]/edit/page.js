"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/services/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Service not found");
        setService(data);
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push(`/services/${id}`);
    } else {
      const data = await res.json();
      setErr(data.message || "Failed to update service");
    }
  }

  if (loading) return <main style={{ padding: 20 }}>Loading…</main>;
  if (err) return <main style={{ padding: 20, color: "crimson" }}>{err}</main>;

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "40px auto" }}>
      <h1>Edit Service</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </label>
        <br />
        <label>
          Description:
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        </label>
        <br />
        <label>
          Price:
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        </label>
        <br />
        <label>
          Category:
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}