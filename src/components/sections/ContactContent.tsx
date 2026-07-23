"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { TextRoll } from "@/components/ui/RollButton";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  contactCopy,
  contactMeta,
  cta,
  process as processSteps,
  products,
  siteConfig,
} from "@/lib/site";

/* ============================================================================
   /contact-us — the dedicated contact desk. Hero → desk details (dotted map,
   phone, email, WhatsApp) + enquiry form → "what happens next".
   The form is the SAME contract as the home Contact section: it POSTs to
   /api/contact and folds the selected product family into the message.
   ========================================================================== */

const MUMBAI = { lat: 19.076, lng: 72.8777 };

/** Same equirectangular projection the Presence / Contact maps use (800×400). */
function projectPoint(lat: number, lng: number): { x: number; y: number } {
  return {
    x: (lng + 180) * (800 / 360),
    y: (90 - lat) * (400 / 180),
  };
}

const PIN = projectPoint(MUMBAI.lat, MUMBAI.lng);

/* The dotted world base is pre-generated at build time into
   public/world-dots.svg (see scripts/generate-world-map.mjs) — never generate
   it at runtime, it costs ~635 ms of main thread before hydration. */

/* -------------------------------------------------------------------------- */
/*  Form                                                                      */
/* -------------------------------------------------------------------------- */

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  /** Product-family slug from site.ts `products`; "" = general enquiry. */
  product: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  message: "",
};

interface ApiResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

function isKnownSlug(slug: string): boolean {
  return products.some((p) => p.slug === slug);
}

/**
 * Reads ?product=<slug> (the Products grid links here as
 * /contact-us?product=<slug>) and lifts it into the form. Renders nothing —
 * it exists only so `useSearchParams` sits inside its own <Suspense>
 * boundary, which keeps the rest of the page statically prerendered.
 */
function ProductParam({ onSlug }: { onSlug: (slug: string) => void }) {
  const slug = useSearchParams().get("product");

  useEffect(() => {
    if (slug && isKnownSlug(slug)) onSlug(slug);
  }, [slug, onSlug]);

  return null;
}

const inputBase =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-steel-400 transition-colors duration-200 focus:border-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60 aria-[invalid=true]:border-accord-red aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-accord-red/40";

const labelBase =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-steel-300";

/* Informational-tile hover (brief §4.4): border brightens + a 1px red rule
   draws along the top edge. No translate. */
const infoTile =
  "group glass-card relative overflow-hidden p-6 transition-colors duration-300 hover:border-white/20";

function TopRule() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-500 ease-out group-hover:scale-x-100"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[8%] -top-[16%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.18),transparent_62%)]"
      />
      <Container className="relative pb-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-steel-400"
        >
          <Link href="/" className="transition-colors hover:text-accord-red">
            Home
          </Link>
          <span className="px-2 text-steel-500">/</span>
          <span className="text-steel-300">Contact Us</span>
        </nav>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-3xl"
        >
          <motion.p
            variants={fadeSoft}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red"
          >
            {contactCopy.eyebrow}
          </motion.p>
          <motion.h1 variants={fadeSoft} className="type-hero text-white">
            Contact Us
          </motion.h1>
          <motion.p
            variants={fadeSoft}
            className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            {contactCopy.intro}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desk details + enquiry form                                               */
/* -------------------------------------------------------------------------- */

function ContactDesk() {
  const { contact } = siteConfig;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* Pre-fill the product select from ?product=<slug> — stable so the
     <ProductParam> effect only fires when the slug itself changes. */
  const selectProduct = useCallback((slug: string) => {
    setForm((prev) => ({ ...prev, product: slug }));
  }, []);

  // Only flag the specific field(s) actually at fault — never blanket-mark
  // every required input when one is wrong.
  const errored = status === "error";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameInvalid = errored && form.name.trim().length === 0;
  const emailInvalid = errored && !emailRe.test(form.email.trim());
  const messageInvalid = errored && form.message.trim().length === 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    const productName =
      products.find((p) => p.slug === form.product)?.name ?? "";

    // /api/contact only forwards { name, email, phone, company, message } —
    // fold the selected family into the message so it is never lost, and send
    // `product` alongside for when the route grows a dedicated field.
    const message = productName
      ? `Product family: ${productName}\n\n${form.message}`
      : form.message;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          message,
          product: productName || undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (res.ok && data?.ok) {
        setStatus("success");
        setFeedback(data.message ?? "Thanks — we'll be in touch shortly.");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setFeedback(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error. Please check your connection and retry.");
    }
  }

  /* Small print — CLIENT-INPUT slots; each fragment renders only when the
     client has confirmed a value. */
  const smallPrint: string[] = [
    contactMeta.gstin ? `GSTIN ${contactMeta.gstin}` : "",
    contactMeta.iec ? `IEC ${contactMeta.iec}` : "",
    contactMeta.hours,
  ].filter((s) => s.length > 0);

  const details: { icon: typeof MapPin; label: string; body: ReactNode }[] = [
    {
      icon: Phone,
      label: "Call us",
      body: (
        <a
          href={contact.phoneHref}
          className="font-mono text-sm tracking-wide text-steel-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60"
        >
          {contact.phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: "Email us",
      body: (
        <a
          href={contact.emailHref}
          className="break-all text-sm text-steel-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60"
        >
          {contact.email}
        </a>
      ),
    },
  ];

  return (
    <section className="section-quiet">
      <Suspense fallback={null}>
        <ProductParam onSlug={selectProduct} />
      </Suspense>

      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            Our desk
          </p>
          <h2 className="type-section text-balance text-white">
            {contactCopy.heading}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:mt-14 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* LEFT — desk details + dark map card */}
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex flex-col gap-4"
          >
            {/* Dark dotted-map card — single Mumbai pin, links to the exact
                Google Business listing. */}
            <motion.a
              variants={fadeSoft}
              href={contact.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open our Mumbai office (${contact.addressLines[0].replace(/,\s*$/, "")}) in Google Maps`}
              className={cn(
                infoTile,
                "block p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60"
              )}
            >
              <TopRule />
              <div className="relative aspect-[2/1] w-full overflow-hidden">
                <Image
                  src="/world-dots.svg"
                  alt=""
                  aria-hidden
                  width={1056}
                  height={495}
                  draggable={false}
                  unoptimized
                  className="pointer-events-none h-full w-full select-none object-cover [mask-image:linear-gradient(to_bottom,transparent,white_12%,white_88%,transparent)]"
                />
                {/* Static pin — solid node + pre-rendered halo, no loops */}
                <svg
                  aria-hidden
                  viewBox="0 0 800 400"
                  preserveAspectRatio="xMidYMid meet"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <circle
                    cx={PIN.x}
                    cy={PIN.y}
                    r={16}
                    fill="rgba(225,27,34,0.12)"
                  />
                  <circle
                    cx={PIN.x}
                    cy={PIN.y}
                    r={7}
                    fill="rgba(225,27,34,0.35)"
                  />
                  <circle cx={PIN.x} cy={PIN.y} r={3} fill="#E11B22" />
                </svg>
                {/* Pin label */}
                <span
                  aria-hidden
                  className="absolute left-[70.2%] top-[39.4%] -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-md border border-white/10 bg-ink-900/90 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white"
                >
                  MUMBAI HQ
                </span>
              </div>

              {/* Caption row */}
              <div className="flex items-start justify-between gap-4 border-t border-white/[0.07] p-5 sm:p-6">
                <div className="min-w-0">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accord-red/[0.14] text-accord-red ring-1 ring-inset ring-accord-red/25">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    Visit us
                  </span>
                  <address className="text-sm not-italic leading-relaxed text-steel-300">
                    {contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <span className="mt-3 block font-mono text-[10px] tracking-widest text-steel-400">
                    19.0760° N / 72.8777° E
                  </span>
                </div>
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-steel-300 transition-colors duration-300 group-hover:border-accord-red/50 group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </motion.a>

            {/* Phone / email tiles */}
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, body }) => (
                <motion.div key={label} variants={fadeSoft} className={infoTile}>
                  <TopRule />
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accord-red/[0.14] text-accord-red ring-1 ring-inset ring-accord-red/25">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    {label}
                  </h3>
                  <div className="mt-1.5">{body}</div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp row — brand-red glyph (platform green stays banned) */}
            <motion.a
              variants={fadeSoft}
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                infoTile,
                "flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60"
              )}
            >
              <TopRule />
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accord-red/[0.14] text-accord-red ring-1 ring-inset ring-accord-red/25">
                <MessageCircle className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  WhatsApp
                </span>
                <span className="mt-0.5 block text-sm text-steel-300 transition-colors group-hover:text-white">
                  {contact.phone}
                </span>
              </span>
            </motion.a>
          </motion.div>

          {/* RIGHT — enquiry form */}
          <motion.div
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            transition={{ delay: 0.1 }}
            className="glass-strong p-6 sm:p-8"
          >
            <h3 className="type-card text-white">Send an enquiry</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
              Fields marked <span className="text-accord-red">*</span> are
              required.
            </p>

            <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelBase}>
                    Name <span className="text-accord-red">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={nameInvalid}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="contact-company" className={labelBase}>
                    Company
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Company name"
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className={labelBase}>
                    Email <span className="text-accord-red">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={emailInvalid}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelBase}>
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 ..."
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Product / enquiry type — pre-fills from ?product=<slug> */}
              <div>
                <label htmlFor="contact-product" className={labelBase}>
                  Product / enquiry type
                </label>
                <div className="relative">
                  <select
                    id="contact-product"
                    name="product"
                    value={form.product}
                    onChange={(e) => update("product", e.target.value)}
                    className={cn(
                      inputBase,
                      "cursor-pointer appearance-none pr-10"
                    )}
                  >
                    <option value="" className="bg-ink-900 text-white">
                      General enquiry
                    </option>
                    {products.map((p) => (
                      <option
                        key={p.slug}
                        value={p.slug}
                        className="bg-ink-900 text-white"
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className={labelBase}>
                  Message <span className="text-accord-red">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  aria-invalid={messageInvalid}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Product, grade, volume and destination…"
                  className={cn(inputBase, "resize-y")}
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-accord-red py-2.5 pl-6 pr-2 text-[14px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(225,27,34,0.7)] transition-all duration-300 hover:-translate-y-1 hover:bg-accord-redDark hover:shadow-[0_16px_40px_-12px_rgba(225,27,34,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? (
                  <span className="inline-flex h-8 items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </span>
                ) : (
                  <>
                    <TextRoll text={cta.submit} />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="text-accord-red transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
                      />
                    </span>
                  </>
                )}
              </button>

              {/* Inline status feedback — no green outside the contact pill */}
              {(status === "success" || status === "error") && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm",
                    status === "success"
                      ? "border-white/15 bg-white/[0.06] text-steel-100"
                      : "border-accord-red/30 bg-accord-red/15 text-red-200"
                  )}
                >
                  {status === "success" ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-white"
                      aria-hidden
                    />
                  ) : (
                    <AlertCircle
                      className="h-4 w-4 shrink-0 text-accord-red"
                      aria-hidden
                    />
                  )}
                  {feedback}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Small print — renders only for confirmed client values */}
        {smallPrint.length > 0 && (
          <motion.p
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-12 text-center font-mono text-xs tracking-widest text-steel-400"
          >
            {smallPrint.join(" · ")}
          </motion.p>
        )}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  What happens next — the same four steps a consignment follows              */
/* -------------------------------------------------------------------------- */

function WhatHappensNext() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            After you hit send
          </p>
          <h2 className="type-section text-balance text-white">
            What happens next
          </h2>
        </div>

        <motion.ol
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map(({ step, title, desc }) => (
            <motion.li
              key={step}
              variants={fadeSoft}
              className="group glass-card relative overflow-hidden p-6 transition-colors duration-300 hover:border-white/25"
            >
              <TopRule />
              <span className="font-mono text-sm tracking-widest text-steel-500">
                {step}
              </span>
              <h3 className="type-card mt-4 text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                {desc}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function ContactContent() {
  return (
    <>
      <ContactHero />
      <ContactDesk />
      <WhatHappensNext />
    </>
  );
}
