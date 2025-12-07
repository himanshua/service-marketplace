"use client";
// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\app\createpage\CreatePageClient.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePageClient() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    title: "",
    leftType: "image",
    leftContent: "",
    rightType: "html",
    rightContent: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("Page created!");
      router.push(`/pages/${form.slug}`);
    } else {
      setMessage("Error creating page");
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Create New Page</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input name="slug" placeholder="Page Slug (e.g. vedic-astrology)" value={form.slug} onChange={handleChange} required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <label>
          Left Side Type:
          <select name="leftType" value={form.leftType} onChange={handleChange}>
            <option value="image">Image</option>
            <option value="html">Text/HTML</option>
          </select>
        </label>
        <textarea name="leftContent" placeholder="Left Content (image URL or HTML)" value={form.leftContent} onChange={handleChange} rows={3} />
        <label>
          Right Side Type:
          <select name="rightType" value={form.rightType} onChange={handleChange}>
            <option value="image">Image</option>
            <option value="html">Text/HTML</option>
          </select>
        </label>
        <textarea name="rightContent" placeholder="Right Content (image URL or HTML)" value={form.rightContent} onChange={handleChange} rows={6} />
        <button type="submit">Create Page</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}