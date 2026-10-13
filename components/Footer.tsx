import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";

// Replace the handles and links with your real accounts
const socials = [
  { name: "Instagram", handle: "@yourhandle", href: "https://instagram.com/yourhandle", Icon: FaInstagram },
  { name: "Facebook", handle: "@yourhandle", href: "https://facebook.com/yourhandle", Icon: FaFacebookF },
  { name: "X", handle: "@yourhandle", href: "https://x.com/yourhandle", Icon: FaXTwitter },
  { name: "WhatsApp", handle: "+000 000 000 0000", href: "https://wa.me/0000000000000", Icon: FaWhatsapp },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Dark overlay so the text stays readable */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        {/* Brand heading */}
        <div className="text-center mb-12">
          <h3 className="text-5xl md:text-6xl font-extrabold tracking-tight text-orange-600">
            Maestro Originals
          </h3>
          <p className="mt-3 text-sm text-gray-300">
            Handmade shoes, made to last.
          </p>
        </div>

        {/* Info columns */}
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-[1fr_1fr_2fr]">
          <div>
            <h4 className="mb-3 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white">About us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Help</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Follow us</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {socials.map(({ name, handle, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-300 transition-colors hover:text-orange-500"
                  >
                    <Icon className="text-lg" aria-label={name} />
                    <span>{handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-6 text-center text-xs text-gray-400">
          © 2026 Maestro Originals. All rights reserved.
        </div>
      </div>
    </footer>
  );
}