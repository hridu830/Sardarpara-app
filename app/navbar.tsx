"use client";

import { useState } from "react";

const LINKS = [
  { href: "#dashboard", label: "ড্যাশবোর্ড" },
  { href: "#members", label: "সদস্যগণ" },
  { href: "#incomes", label: "চাঁদা / আয়" },
  { href: "#expenses", label: "ব্যয়ের হিসাব" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#dashboard" className="brand">
          <span className="brand-mark" aria-hidden="true">
            স
          </span>
          <span className="brand-text">সর্দারপাড়া আমলে সালেহ যুব সংঘ</span>
        </a>

        <button
          className="menu-toggle"
          aria-label="মেনু খুলুন"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${open ? "open" : ""}`}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="site-nav-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
