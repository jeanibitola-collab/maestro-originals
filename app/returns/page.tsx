import Link from "next/link";
import type { IconType } from "react-icons";
import { FaCircleCheck, FaCircleXmark, FaClock, FaRotateLeft, FaWallet } from "react-icons/fa6";

// Sample policy for the demo site. Set your real details before launch.
const SHOW_DEMO_NOTICE = true;
const RETURN_DAYS = 7;
const REFUND_TIME = "5 to 10 business days";

const highlights: { Icon: IconType; label: string; value: string }[] = [
  { Icon: FaClock, label: "Return window", value: `${RETURN_DAYS} days from delivery` },
  { Icon: FaRotateLeft, label: "Condition", value: "Unworn, with original packaging" },
  { Icon: FaWallet, label: "Refunds", value: `Within ${REFUND_TIME}` },
];

const steps = [
  { title: "Contact us", text: `Tell us your order number and the shoe you want to return within ${RETURN_DAYS} days of delivery.` },
  { title: "Pack it up", text: "Place the shoes back in their original box or packaging, unworn and in the condition you received them." },
  { title: "Send it back", text: "We'll tell you how to get the pair back to us, and confirm when it arrives." },
  { title: "Get your refund", text: `After we inspect the shoes, your refund is processed within ${REFUND_TIME}.` },
];

const eligible = [
  "Unworn shoes in their original packaging",
  "Shoes that arrived damaged or faulty",
  "The wrong style or size was sent",
  "Requested within the return window",
];

const notEligible = [
  "Shoes that have been worn outdoors or show wear",
  "Items without their original packaging",
  "Requests made after the return window",
  "Custom or made-to-order pairs, unless faulty",
];

const faqs = [
  {
    q: "Can I exchange for a different size?",
    a: "Yes. Contact us within the return window and we'll arrange an exchange, subject to the size being in stock. If it isn't, we'll offer you a refund.",
  },
  {
    q: "Who pays for return delivery?",
    a: "If the shoes were faulty or we sent the wrong item, we cover the return. For other returns, the customer covers the delivery back to us.",
  },
  {
    q: "How will I get my refund?",
    a: `Refunds go back to the payment method you used at checkout, within ${REFUND_TIME} after we receive and inspect the shoes. Your bank may take a little longer to show it.`,
  },
  {
    q: "My shoes arrived damaged. What now?",
    a: "We're sorry about that. Contact us right away with your order number and a photo, and we'll replace or refund them.",
  },
  {
    q: "How do I check on my return?",
    a: "Contact us with your order number and we'll tell you where it is in the process.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">Returns &amp; refunds</h1>
        <p className="mt-4 opacity-70">Not quite right? Here&apos;s how we make it easy.</p>
       
      </header>

      {/* At a glance */}
      <section className="mb-14 grid gap-4 sm:grid-cols-3">
        {highlights.map(({ Icon, label, value }) => (
          <div key={label} className="rounded-xl border p-6 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/15 text-xl text-orange-600">
              <Icon />
            </span>
            <p className="text-sm opacity-60">{label}</p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>

      {/* How to return */}
      <section className="mb-14">
        <h2 className="mb-8 text-center font-serif text-3xl">How to return an item</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title}>
              <p className="mb-1 text-sm font-bold text-orange-600">Step {i + 1}</p>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm opacity-80">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligible or not */}
      <section className="mb-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h3 className="mb-4 text-lg font-semibold">What we can take back</h3>
          <ul className="space-y-3">
            {eligible.map((t) => (
              <li key={t} className="flex gap-3">
                <FaCircleCheck className="mt-1 shrink-0 text-green-500" />
                <span className="opacity-80">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border p-6">
          <h3 className="mb-4 text-lg font-semibold">What we can&apos;t take back</h3>
          <ul className="space-y-3">
            {notEligible.map((t) => (
              <li key={t} className="flex gap-3">
                <FaCircleXmark className="mt-1 shrink-0 text-red-500" />
                <span className="opacity-80">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Questions */}
      <section className="mb-14">
        <h2 className="mb-6 text-center font-serif text-3xl">Returns questions</h2>
        <div className="divide-y rounded-xl border">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span className="text-orange-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 opacity-80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="rounded-2xl border p-10 text-center">
        <h2 className="mb-3 font-serif text-3xl">Ready to start a return?</h2>
        <p className="mx-auto mb-6 max-w-xl opacity-80">
          Send us your order number and we&apos;ll guide you through the rest.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-500">
            Contact us
          </Link>
          <Link href="/shipping" className="rounded-full border px-6 py-3 font-semibold transition-colors hover:bg-gray-500/20">
            Shipping info
          </Link>
        </div>
      </section>
    </main>
  );
}