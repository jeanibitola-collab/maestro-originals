"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FaClock, FaEnvelope, FaLocationDot, FaPhone, FaWhatsapp } from "react-icons/fa6";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// Fill in your real details. Leave a line as "" to hide it.
const PHONE: string = "+234 812 298 7435"; // e.g. "+234 801 234 5678"
const WHATSAPP: string = "2348122987435"; // digits only, with country code, e.g. "2348012345678"
const EMAIL: string = "olakunlerotimi09@gmail.com"; // e.g. "hello@yourdomain.com"
const ADDRESS: string = "Fusam plaza, Double Dollar junction near British, Jos Nigeria"; // e.g. "12 Example Street, Lagos"
const HOURS: string = "Mon to Sat, 24hrs"; // e.g. "Mon to Sat, 9am to 6pm"
type Detail = { Icon: IconType; label: string; value: string; href?: string };

const details = (
  [
    WHATSAPP && { Icon: FaWhatsapp, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${WHATSAPP}` },
    PHONE && { Icon: FaPhone, label: "Phone", value: PHONE, href: `tel:${PHONE.replace(/\s+/g, "")}` },
    EMAIL && { Icon: FaEnvelope, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    ADDRESS && { Icon: FaLocationDot, label: "Visit us", value: ADDRESS },
    HOURS && { Icon: FaClock, label: "Opening hours", value: HOURS },
  ] as (Detail | "" | false)[]
).filter((d): d is Detail => Boolean(d));

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState(""); // hidden spam trap
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Fill in the details for signed-in customers
  useEffect(() => {
    if (!user) return;
    setName((n) => n || user.displayName || "");
    setEmail((e) => e || user.email || "");
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (trap) {
      setSent(true); // a bot filled the hidden field, so pretend it worked
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("We couldn't send your message. Please try again, or contact us another way.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "w-full rounded-lg border bg-transparent px-4 py-3 outline-none placeholder:text-gray-500 focus:border-orange-600";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">Contact us</h1>
        <p className="mt-3 opacity-70">Questions, custom orders, or help with an order? We&apos;d love to hear from you.</p>
      </header>

      <div className={`grid gap-8 ${details.length > 0 ? "md:grid-cols-2" : "mx-auto max-w-xl"}`}>
        {details.length > 0 && (
          <div className="space-y-4">
            {details.map(({ Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-600/15 text-xl text-orange-600">
                    <Icon />
                  </span>
                  <span>
                    <span className="block text-sm opacity-60">{label}</span>
                    <span className="block font-medium">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-gray-500/10"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 rounded-xl border p-4">
                  {content}
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-xl border p-6">
          {sent ? (
            <div className="py-8 text-center">
              <h2 className="mb-2 text-2xl font-semibold">Thank you!</h2>
              <p className="mb-6 opacity-80">Your message has been sent. We&apos;ll get back to you soon.</p>
              <button
                onClick={() => setSent(false)}
                className="rounded-full border px-6 py-2 font-medium hover:bg-gray-500/20"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <input className={field} placeholder="Your name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
              <input className={field} type="email" placeholder="Your email" required maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea className={field} rows={6} placeholder="Your message" required maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} />

              {/* Hidden from people, but bots fill it in */}
              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                disabled={sending}
                className="w-full rounded-full bg-orange-600 py-3 font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}