import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Clock, Menu, X } from "lucide-react";
import { TextRoll } from "./ui";

const NAV_LINKS = ["Projects", "Studio", "Journal", "Connect"];

function londonTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function Navbar() {
  const [time, setTime] = useState(londonTime);
  const [open, setOpen] = useState(false);

  // Live clock — tick every second.
  useEffect(() => {
    const id = setInterval(() => setTime(londonTime()), 1000);
    return () => clearInterval(id);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-20 mx-auto w-full max-w-[1440px] p-2 sm:p-3">
      <nav className="flex items-center justify-between rounded-full bg-white p-[5px]">
        {/* LEFT — logo + links */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 sm:h-10 sm:w-10"
            aria-label="Axion Studio home"
          >
            <span className="text-[10px] font-bold tracking-tight text-white sm:text-[11px]">
              AX
            </span>
          </a>
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="text-[14px] text-gray-900 transition-colors duration-300 hover:text-gray-500"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — status, clock, CTA (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="hidden text-[13px] text-gray-600 lg:inline">
            Taking on projects for Q1 2026
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-gray-600">
            <Clock size={14} />
            {time} in London
          </span>
          <a
            href="#"
            className="group flex items-center gap-3 rounded-full bg-gray-900 py-2 pl-5 pr-2 text-[13px] font-medium text-white"
          >
            <TextRoll text="Book a strategy call" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <ArrowRight
                size={14}
                className="text-gray-900 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
              />
            </span>
          </a>
        </div>

        {/* MOBILE — toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white md:hidden"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY — portalled to <body> so its z-50 isn't trapped
          inside the header's (z-20) stacking context. */}
      {createPortal(
        <div
          className={`fixed inset-0 z-50 md:hidden ${
            open ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Bottom sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[13px] text-gray-600">
            <Clock size={14} />
            {time} in London
          </span>

          <ul className="mt-6 flex flex-col gap-1">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-[28px] font-medium leading-[32px] text-gray-900"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#"
            onClick={() => setOpen(false)}
            className="group mt-6 flex items-center justify-between rounded-full bg-[#F26522] py-2 pl-6 pr-2 text-[14px] font-medium text-white transition-colors hover:bg-[#e05a1a]"
          >
            <TextRoll text="Start a project" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <ArrowRight
                size={16}
                className="text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
              />
            </span>
          </a>
        </div>
      </div>,
        document.body
      )}
    </header>
  );
}
