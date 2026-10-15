import Link from "next/link";
import type { IconType } from "react-icons";
import { FaBoxOpen, FaClock, FaTruck, FaWallet } from "react-icons/fa6";

// Sample policy for the demo site. Set your real details before launch.
const SHOW_DEMO_NOTICE = true;
const PROCESSING_TIME = "1 to 3 business days";
const DELIVERY_TIME = "2 to 5 business days";
const MADE_TO_ORDER_TIME = "7 to 14 business days";
const DELIVERY_FEE = "Free"; // keep in line with your checkout page
const DELIVERY_AREAS = "Nationwide";

const highlights: { Icon: IconType; label: string; value: string }[] = [
  { Icon: FaBoxOpen, label: "Order processing", value: PROCESSING_TIME },
  { Icon: FaTruck, label: "Delivery time", value: DELIVERY_TIME },
  { Icon: FaWallet, label: "Delivery fee", value: DELIVERY_FEE },
];

const steps = [
  { title: "Place your order", text: "Choose your shoes, check out securely, and you'll see your order in your account." },
  { title: "We prepare it", text: "Your pair is checked, packed carefully, and handed to our delivery partner." },
  { title: "On its way", text: "We contact you with delivery updates so you know when to expect it." },
  { title: "Delivered", text: "Try your shoes on at home. If anything isn't right, see our returns policy." },
];

const faqs = [
  {
    q: "Where do you deliver?",
    a: `We deliver ${DELIVERY_AREAS.toLowerCase()}. If you're unsure whether we reach your area, contact us before ordering.`,
  },
  {
    q: "How long will my order take?",
    a: `Orders are processed in ${PROCESSING_TIME}, then delivered in ${DELIVERY_TIME}. Made-to-order pairs take longer, around ${MADE_TO_ORDER_TIME}, because they are crafted after you order.`,
  },
  {
    q: "How much does delivery cost?",
    a: `Delivery fee: ${DELIVERY_FEE.toLowerCase()}. The total you see at checkout is the total you pay.`,
  },
  {
    q: "How will I know where my order is?",
    a: "We update you by phone or WhatsApp using the contact details on your account. You can also see your order status on the Orders page.",
  },
  {
    q: "What if nobody is home when it arrives?",
    a: "The delivery partner will try to reach you by phone. Please keep your phone number up to date in your account so they can find you.",
  },
  {
    q: "My order is late or hasn't arrived. What should I do?",
    a: "Please contact us with your order number and we'll look into it straight away.",
  },
];

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">Shipping &amp; delivery</h1>
        <p className="mt-4 opacity-70">Everything you need to know about getting your shoes.</p>
       
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

      {/* How it works */}
      <section className="mb-14">
        <h2 className="mb-8 text-center font-serif text-3xl">How delivery works</h2>
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

      {/* Questions */}
      <section className="mb-14">
        <h2 className="mb-6 text-center font-serif text-3xl">Delivery questions</h2>
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
        <h2 className="mb-3 font-serif text-3xl">Need help with a delivery?</h2>
        <p className="mx-auto mb-6 max-w-xl opacity-80">
          Tell us your order number and we&apos;ll check it for you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-500">
            Contact us
          </Link>
          <Link href="/returns" className="rounded-full border px-6 py-3 font-semibold transition-colors hover:bg-gray-500/20">
            Returns policy
          </Link>
        </div>
      </section>
    </main>
  );
}