"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { fadeUp, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

/* Dark ember bloom — warm charcoal-red glow up top, distinct from the Stats
   band's cooler red, fading to the page colour below. */
const CONTACT_GRADIENT = [
  "#4a1410",
  "#36100c",
  "#220a08",
  "#150706",
  "#0B0B0D",
  "#0B0B0D",
  "#0B0B0D",
];
const CONTACT_STOPS = [0, 10, 24, 40, 58, 80, 100];

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

interface ApiResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

const inputBase =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-steel-400 backdrop-blur-sm transition-colors duration-200 focus:border-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60 aria-[invalid=true]:border-accord-red aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-accord-red/40";

const labelBase =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-steel-300";

export default function Contact() {
  const { contact } = siteConfig;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Only flag the specific field(s) actually at fault — never blanket-mark every
  // required input when one is wrong (screen readers would mis-announce the rest).
  const errored = status === "error";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameInvalid = errored && form.name.trim().length === 0;
  const emailInvalid = errored && !emailRe.test(form.email.trim());
  const messageInvalid = errored && form.message.trim().length === 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        setFeedback(data.message ?? "Thanks — we'll be in touch shortly.");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setFeedback(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error. Please check your connection and retry.");
    }
  }

  const details = [
    {
      icon: MapPin,
      label: "Visit Us",
      body: (
        <address className="not-italic leading-relaxed text-steel-300">
          {contact.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ),
    },
    {
      icon: Phone,
      label: "Call Us",
      body: (
        <a
          href={contact.phoneHref}
          className="text-steel-300 transition-colors hover:text-accord-red"
        >
          {contact.phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: "Email Us",
      body: (
        <a
          href={contact.emailHref}
          className="break-all text-steel-300 transition-colors hover:text-accord-red"
        >
          {contact.email}
        </a>
      ),
    },
  ];

  return (
    <section
      id="contact"
      className="section noise relative overflow-hidden"
    >
      {/* Live breathing ember gradient (base layer) */}
      <AnimatedGradientBackground
        Breathing
        startingGap={80}
        breathingRange={12}
        animationSpeed={0.028}
        topOffset={0}
        gradientColors={CONTACT_GRADIENT}
        gradientStops={CONTACT_STOPS}
      />

      {/* Dot-grid texture layered over the gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.6] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="relative z-10">
        <SectionHeading
          number="07"
          invert
          eyebrow="Get In Touch"
          title="Let's talk petrochemicals"
          intro="Tell us what you need — sourcing, indenting, export or end-to-end logistics. Our Mumbai desk responds fast."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — contact details + map */}
          <div>
            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="grid gap-4 sm:grid-cols-2"
            >
              {details.map(({ icon: Icon, label, body }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="group glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accord-red/40 hover:shadow-[0_18px_44px_-20px_rgba(225,27,34,0.55)]"
                >
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accord-red/15 text-accord-red ring-1 ring-inset ring-accord-red/20 transition-colors duration-300 group-hover:bg-accord-red group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
                    {label}
                  </h3>
                  <div className="mt-1.5 text-sm">{body}</div>
                </motion.div>
              ))}

              {/* WhatsApp chip */}
              <motion.a
                variants={fadeUp}
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card flex items-center gap-3 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accord-red/40 hover:shadow-[0_18px_44px_-20px_rgba(225,27,34,0.55)]"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accord-red/15 text-accord-red ring-1 ring-inset ring-accord-red/20 transition-colors duration-300 group-hover:bg-accord-red group-hover:text-white">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
                    WhatsApp
                  </span>
                  <span className="mt-0.5 block text-sm text-steel-300 transition-colors group-hover:text-accord-red">
                    Chat with our desk
                  </span>
                </span>
              </motion.a>
            </motion.div>

            {/* Google Map */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              transition={{ delay: 0.1 }}
              className="glass-card mt-6 overflow-hidden border-white/10"
            >
              <iframe
                title="Accord Chemical Corporation — Mumbai office location"
                aria-label="Google Map showing Accord Chemical Corporation's office in Borivali East, Mumbai"
                src="https://www.google.com/maps?q=Borivali%20East%20Mumbai%20400066&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 sm:h-72"
              />
            </motion.div>
          </div>

          {/* RIGHT — form card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            transition={{ delay: 0.05 }}
            className="glass-card p-6 sm:p-8"
          >
            <form noValidate onSubmit={handleSubmit}>
              <motion.div
                variants={stagger(0.07)}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="grid gap-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <motion.div variants={fadeUp}>
                    <label htmlFor="name" className={labelBase}>
                      Name <span className="text-accord-red">*</span>
                    </label>
                    <input
                      id="name"
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
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label htmlFor="company" className={labelBase}>
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Company name"
                      className={inputBase}
                    />
                  </motion.div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <motion.div variants={fadeUp}>
                    <label htmlFor="email" className={labelBase}>
                      Email <span className="text-accord-red">*</span>
                    </label>
                    <input
                      id="email"
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
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label htmlFor="phone" className={labelBase}>
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 ..."
                      className={inputBase}
                    />
                  </motion.div>
                </div>

                <motion.div variants={fadeUp}>
                  <label htmlFor="message" className={labelBase}>
                    Message <span className="text-accord-red">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    aria-invalid={messageInvalid}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about the products, volumes and destinations you need…"
                    className={cn(inputBase, "resize-y")}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-accord-red px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_-10px_rgba(225,27,34,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accord-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden />
                          Send Message
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </motion.div>

                {/* Inline status feedback */}
                {(status === "success" || status === "error") && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium",
                      status === "success"
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                        : "border-accord-red/30 bg-accord-red/15 text-red-200"
                    )}
                  >
                    {status === "success" ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-300"
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
              </motion.div>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
