/**
 * Accord Chemical Corporation — central content + config.
 * Single source of truth. Section components import from here so copy stays
 * consistent and the client can edit content in one place.
 *
 * Number canon (do not contradict anywhere):
 *   110,000+ MT annually · $168M / ₹1,400 Cr (FY 2022-23) · 58+ countries ·
 *   186+ active clients · tenure computed via yearsInBusiness().
 *
 * Client-input slots (empty until the client supplies real data — sections
 * must render nothing for empty slots, never placeholders or invented facts):
 *   credibility.memberships / logos / testimonial · contactMeta.gstin / iec /
 *   hours · productListPdf · siteConfig.social.* · legal.cin / gst.
 */

export const FOUNDING_YEAR = 2009;

/** Tenure, computed — never hardcode a year count anywhere in copy. */
export function yearsInBusiness(): number {
  return new Date().getFullYear() - FOUNDING_YEAR;
}

export const siteConfig = {
  name: "Accord Chemical Corporation",
  legalName: "Accord Chemicals Private Limited",
  tagline: "Petrochemicals traded across 58 countries — from Mumbai, since 2009.",
  established: FOUNDING_YEAR,
  description:
    "Mumbai-based petrochemical trading house — imports, exports and indenting of commodity and specialty petrochemicals, moving 110,000+ metric tons a year between 58+ countries and India since 2009.",
  /**
   * Paste a PUBLISHED Spline runtime URL here (ends in .splinecode) to render
   * the client's real Spline hero. While empty, the custom WebGL logistics
   * scene is shown instead. See README → "Wiring the Spline scene".
   * e.g. "https://prod.spline.design/XXXXXXXX/scene.splinecode"
   */
  splineSceneUrl: "",
  contact: {
    addressLines: [
      "Kanakia Western Edge II,",
      "A-405, Western Express Highway,",
      "Behind Metro Store, Borivali East,",
      "Mumbai, Maharashtra 400066.",
    ],
    phone: "+91-7710005176",
    phoneHref: "tel:+917710005176",
    email: "info@accordchemicals.com",
    emailHref: "mailto:info@accordchemicals.com",
    whatsappHref: "https://wa.me/917710005176",
    /** Exact Google Business listing — dark map card links here. */
    mapHref: "https://www.google.com/maps/search/?api=1&query=Kanakia+Western+Edge+II%2C+Borivali+East%2C+Mumbai",
  },
  /**
   * Social profiles — EMPTY until the client supplies real URLs.
   * Footer renders an icon only when its value is a non-empty string.
   */
  social: {
    facebook: "",
    linkedin: "",
  },
  /** Relationship unconfirmed — footer renders "Site by {poweredBy}". */
  poweredBy: "Itarsia India Limited",
  /** Legal registration slots — render only when confirmed by the client. */
  legal: {
    cin: "",
    gst: "",
  },
} as const;

/** Nav — labels and order mirror the page's section order EXACTLY. */
export const nav = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "/about-us" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Industries Served", href: "/industries-served" },
  { label: "Career", href: "/career" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact-us" },
] as const;

/**
 * CTA vocabulary — the ONLY conversion verbs allowed anywhere on the page.
 * Sections import these; never write CTA labels inline.
 */
export const cta = {
  /** Primary conversion verb — navbar, hero primary, products, per-family Enquire. */
  primary: { label: "Request a quote", href: "#contact" },
  /** Secondary — hero ghost CTA. */
  secondary: { label: "Explore products", href: "#products" },
  /** Relationship verb — footer red-field band button ONLY. */
  desk: { label: "Talk to our desk", href: "#contact" },
  /** Contact form submit label. */
  submit: "Send enquiry",
  /** Per-family enquire label (Products grid rows). */
  enquire: "Enquire",
} as const;

/** Hero overlay copy — Spline scene + text overlay ONLY. */
export const hero = {
  eyebrow: "Mumbai · Est. 2009 · 58+ countries",
  headline: "Pioneering Petrochemical Excellence Since 2009",
  /** The words rendered in accord-red within the headline (accent → end). */
  headlineAccent: "Since 2009",
  subtext:
    "Accord Chemical Corporation, established in 2009, is a company actively engaged in Trading, Indenting, Distribution, Imports & Exports of various petrochemicals.",
  trustChip: "Trusted since 2009 · 186+ clients",
} as const;

/** 01 — About: "One desk from indent to delivery." */
export const aboutCopy = {
  eyebrow: "About Us",
  heading: "One desk from indent to delivery.",
  body: [
    "Accord Chemical Corporation is among the top petrochemical distribution companies in India — engaged in the import, export and indenting of various petrochemicals. Headquartered in Mumbai with branch offices in Ahmedabad and Gandhidham, Gujarat, it has, since 2009, built a colossal distribution network across India and international markets, led by an ardent team of qualified professionals on a foundation of trust and transparency.",
    "From 4,500 metric tons in its first year, the desk now moves 110,000+ metric tons a year across 58+ countries. What clients buy is certainty — consistent quality, cost-effectiveness, velocity and competence: producer-direct relationships, transparent indent pricing, and in-house clearing, storage, insurance and logistics, so one call covers the consignment. In 2014, the group established Accord Chemcorp Pvt. Ltd., broadening its sourcing and product portfolio to serve industrial applications more comprehensively.",
  ],
  pillars: [
    {
      title: "Producer-direct",
      desc: "Direct relationships with producers worldwide — producer pricing, transparent terms, no middle inventory.",
    },
    {
      title: "110,000+ MT a year",
      desc: "From 4,500 tonnes in year one to 110,000+ metric tons annually — growth you can audit, not adjectives.",
    },
    {
      title: "End-to-end",
      desc: "Clearing, storage, survey, insurance and inland logistics handled in-house — one desk accountable to your gate.",
    },
  ],
  /** Verbatim from accordchemicals.com. */
  vision:
    "To evolve into a top-notch, globally recognised petrochemical trading company, with insistent growth and outstanding performance.",
  mission:
    "To consistently deliver customer delight, elite-quality products and innovative services — committed to employee well-being, safety, and the growth of every stakeholder, alongside our socio-economic responsibility.",
} as const;

/**
 * Headline metrics — the About proof band. The page's ONLY count-ups.
 * Each stat appears exactly once here; other sections reference in prose only.
 */
export const stats: Stat[] = [
  { value: 110000, suffix: "+", label: "Metric tons a year" },
  { value: 168, prefix: "$", suffix: "M", label: "Revenue, FY 2022-23", sublabel: "₹1,400 Cr" },
  { value: 58, suffix: "+", label: "Countries" },
  { value: 186, suffix: "+", label: "Active clients" },
];

export interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  /** Optional secondary mono line under the stat (e.g. INR equivalent). */
  sublabel?: string;
}

/** 02 — What we do (Verticals). */
export const verticalsIntro =
  "Four ways petrochemicals move through Accord — from producer to plant gate.";

export const verticals = [
  {
    id: "import",
    title: "Import & Distribution",
    blurb:
      "We import on our own account and hold duty-paid stock in India — so you buy in INR, in the quantity you need, when you need it.",
    icon: "Import",
  },
  {
    id: "indenting",
    title: "Indenting",
    blurb:
      "Direct contracts between producer and buyer at producer pricing — transparent commission, no middle inventory.",
    icon: "Handshake",
  },
  {
    id: "exports",
    title: "Exports",
    blurb:
      "Indian-origin petrochemicals shipped to buyers on five continents — documentation, inspection and freight handled end to end.",
    icon: "Globe",
  },
  {
    id: "services",
    title: "Comprehensive Services",
    blurb:
      "Customs clearing, bonded storage, survey, marine insurance and inland logistics — one desk accountable for the whole consignment.",
    icon: "Wrench",
  },
] as const;

/**
 * CredibilityStrip — one line, mono voice. Memberships, logos and the
 * testimonial are CLIENT-INPUT slots: render nothing while empty/null.
 * Never invent certifications, logos or quotes.
 */
export const credibility: Credibility = {
  line: "IEC-registered exporter · COA supplied with every consignment · Est. 2009, Mumbai",
  memberships: [],
  logos: [],
  testimonial: null,
};

export interface Credibility {
  line: string;
  /** e.g. ["CHEMEXCIL", "FIEO"] — only when the client confirms. */
  memberships: string[];
  /** Client/principal logos — only with permission. { name, src } */
  logos: { name: string; src: string }[];
  /** One attributed quote — only when the client supplies it. */
  testimonial: { quote: string; name: string; role: string } | null;
}

/** 03 — Products. */
export const productsIntro =
  "Eight product families, sourced producer-direct and delivered on spec — with COA on every lot.";

/**
 * Product-list PDF — CLIENT-INPUT slot. The "Download product list (PDF)"
 * link renders only when this is a non-empty path/URL.
 */
export const productListPdf = "";

/** Product families — slug feeds the enquiry pre-fill (#contact?product=<slug>). */
export const products = [
  {
    name: "Acrylates & Monomers",
    slug: "acrylates-monomers",
    desc: "Building-block acrylates and monomers for coatings, adhesives and polymers.",
  },
  {
    name: "Aromatics & Hydrocarbons",
    slug: "aromatics-hydrocarbons",
    desc: "Benzene, toluene, xylene and solvent-grade hydrocarbon streams.",
  },
  {
    name: "Amines",
    slug: "amines",
    desc: "Ethanolamines and specialty amines for gas treating and surfactants.",
  },
  {
    name: "Chlorinated Solvents & Chemicals",
    slug: "chlorinated-solvents",
    desc: "High-purity chlorinated solvents for cleaning and synthesis.",
  },
  {
    name: "Glycols & Glycol Ethers",
    slug: "glycols-glycol-ethers",
    desc: "MEG, DEG and glycol ethers for antifreeze, resins and formulations.",
  },
  {
    name: "OXO Alcohols",
    slug: "oxo-alcohols",
    desc: "2-EH, n-butanol and iso-butanol for plasticisers and esters.",
  },
  {
    name: "Specialty Acrylates",
    slug: "specialty-acrylates",
    desc: "Functional and multi-functional acrylates for UV-cure systems.",
  },
  {
    name: "Custom Sourcing",
    slug: "custom-sourcing",
    desc: "Don't see your molecule? We source niche and campaign-quantity chemicals through our producer network — send the spec.",
  },
] as const;

/** 04 — Industries. */
export const industriesIntro =
  "Ten downstream industries buy through Accord — from paints and coatings to pharma and personal care.";

/** Flat list — feeds the single slow ticker row (texture only). */
export const industries = [
  "Paints & Coatings",
  "Adhesives & Sealants",
  "Pharmaceuticals",
  "Textiles",
  "Construction",
  "Personal Care",
  "Agrochemicals",
  "Plastics & Polymers",
  "Automotive",
  "Inks & Printing",
] as const;

/**
 * Industry → product-family mapping grid. `families` entries are exact
 * `products[].name` values — never invent families outside the eight.
 */
export const industriesDetail: IndustryDetail[] = [
  {
    name: "Paints & Coatings",
    icon: "Paintbrush",
    families: ["Acrylates & Monomers", "Glycols & Glycol Ethers", "Aromatics & Hydrocarbons"],
  },
  {
    name: "Adhesives & Sealants",
    icon: "Link",
    families: ["Acrylates & Monomers", "Specialty Acrylates", "Aromatics & Hydrocarbons"],
  },
  {
    name: "Pharmaceuticals",
    icon: "Pill",
    families: ["Chlorinated Solvents & Chemicals", "Glycols & Glycol Ethers", "Amines"],
  },
  {
    name: "Textiles",
    icon: "Shirt",
    families: ["Glycols & Glycol Ethers", "Amines", "Aromatics & Hydrocarbons"],
  },
  {
    name: "Construction",
    icon: "HardHat",
    families: ["Acrylates & Monomers", "Specialty Acrylates", "Glycols & Glycol Ethers"],
  },
  {
    name: "Personal Care",
    icon: "Sparkles",
    families: ["Glycols & Glycol Ethers", "Amines", "Custom Sourcing"],
  },
  {
    name: "Agrochemicals",
    icon: "Sprout",
    families: ["Amines", "Chlorinated Solvents & Chemicals", "Aromatics & Hydrocarbons"],
  },
  {
    name: "Plastics & Polymers",
    icon: "Hexagon",
    families: ["Glycols & Glycol Ethers", "OXO Alcohols", "Acrylates & Monomers"],
  },
  {
    name: "Automotive",
    icon: "Car",
    families: ["Glycols & Glycol Ethers", "OXO Alcohols", "Specialty Acrylates"],
  },
  {
    name: "Inks & Printing",
    icon: "Printer",
    families: ["Specialty Acrylates", "Glycols & Glycol Ethers", "Aromatics & Hydrocarbons"],
  },
];

export interface IndustryDetail {
  name: string;
  icon: string;
  families: string[];
}

/** 05 — Growth → "The record". */
export const growthCopy = {
  eyebrow: "Track record",
  heading: "The record",
  intro:
    "From 4,500 tonnes and $0.9M in our first year to 110,000 tonnes and $168M — every year on the record.",
  caption: "FY 2009-10 to 2022-23, latest audited.",
} as const;

/**
 * Growth story — real audited data from the client's "Quantum of Volume in
 * MTS and Revenue" chart. volumeKT = thousand metric tons, revenueUSD = USD
 * millions, revenueINR = INR crore. DO NOT EDIT — swap in FY 2023-24 /
 * 2024-25 rows only when the client delivers them.
 */
export const growth = [
  { year: "2009-10", volumeKT: 4.5, revenueUSD: 0.92, revenueINR: 4.23 },
  { year: "2010-11", volumeKT: 6.9, revenueUSD: 14.44, revenueINR: 67.36 },
  { year: "2011-12", volumeKT: 10.9, revenueUSD: 18.92, revenueINR: 100.3 },
  { year: "2012-13", volumeKT: 15.1, revenueUSD: 24.82, revenueINR: 145.28 },
  { year: "2013-14", volumeKT: 26.0, revenueUSD: 36.07, revenueINR: 220.0 },
  { year: "2014-15", volumeKT: 37.6, revenueUSD: 48.41, revenueINR: 314.65 },
  { year: "2015-16", volumeKT: 36.6, revenueUSD: 40.94, revenueINR: 274.28 },
  { year: "2016-17", volumeKT: 41.8, revenueUSD: 65.83, revenueINR: 427.9 },
  { year: "2017-18", volumeKT: 56.2, revenueUSD: 70.44, revenueINR: 498.04 },
  { year: "2018-19", volumeKT: 76.9, revenueUSD: 85.95, revenueINR: 593.06 },
  { year: "2019-20", volumeKT: 71.45, revenueUSD: 71.45, revenueINR: 500.12 },
  { year: "2020-21", volumeKT: 93.2, revenueUSD: 86.31, revenueINR: 647.35 },
  { year: "2021-22", volumeKT: 90.2, revenueUSD: 138.9, revenueINR: 1155.23 },
  { year: "2022-23", volumeKT: 110.2, revenueUSD: 168.3, revenueINR: 1400.01 },
] as const;

/** 06 — GlobalPresence → "58 countries. One desk." */
export const presenceCopy = {
  eyebrow: "Presence",
  heading: "58 countries. One desk.",
  intro:
    "Producers in Houston, Rotterdam, Shanghai and Singapore; buyers from São Paulo to Sydney — every lane cleared through Mumbai.",
} as const;

/** 07 — Process: "How a consignment moves." Quiet, mono numerals. */
export const processCopy = {
  eyebrow: "Process",
  heading: "How a consignment moves",
} as const;

export const process: ProcessStep[] = [
  {
    step: "01",
    title: "Enquire",
    desc: "Send us the product, grade, volume and destination.",
  },
  {
    step: "02",
    title: "Quote",
    desc: "Indent or import pricing within one business day.",
  },
  {
    step: "03",
    title: "Contract",
    desc: "LC, DA or DP terms — COA and pre-shipment survey on every lot.",
  },
  {
    step: "04",
    title: "Deliver",
    desc: "Customs cleared, insured and tracked to your gate.",
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

/** 08 — Contact. */
export const contactCopy = {
  eyebrow: "Contact",
  heading: "Tell us what you need moved.",
  intro:
    "Tell us the product, volume and destination — sourcing, indenting, export or logistics. Quotes within one business day.",
} as const;

/**
 * Contact small print — CLIENT-INPUT slots. Each renders only when the
 * client confirms its value; empty strings render nothing.
 * e.g. gstin: "27XXXXX…", iec: "XXXXXXXXXX", hours: "Mon–Sat 9:30–18:30 IST"
 */
export const contactMeta = {
  gstin: "",
  iec: "",
  hours: "",
} as const;

/** Footer — quiet, plus the red-field CTA band (the page's final flourish). */
export const footerCopy = {
  ctaHeadline: "Ready to move your next consignment?",
  oneLiner:
    "Mumbai-based petrochemical trading house — imports, exports and indenting across 58+ countries since 2009.",
  /** Itarsia relationship unconfirmed — render as a plain credit line. */
  byline: `Site by ${siteConfig.poweredBy}`,
  productsCollapsedLabel: "View all products",
  backToTop: "Back to top",
} as const;

export type Vertical = (typeof verticals)[number];
export type Product = (typeof products)[number];
export type GrowthPoint = (typeof growth)[number];
export type Industry = (typeof industries)[number];
export type NavItem = (typeof nav)[number];
