"use client";

import { useState } from "react";

const EMAIL = "you@example.com"; // your real email

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  const field =
    "w-full rounded-lg border bg-transparent px-4 py-3 outline-none placeholder:text-gray-500";

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-2 text-center font-serif text-4xl md:text-5xl">
        Contact us
      </h1>
      <p className="mb-8 text-center opacity-70">
        Questions or custom orders? Send us a message.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input className={field} placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input className={field} type="email" placeholder="Your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea className={field} rows={5} placeholder="Your message" required value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="w-full rounded-full bg-orange-600 py-3 font-medium text-white">
          Send message
        </button>
      </form>
    </main>
  );
}