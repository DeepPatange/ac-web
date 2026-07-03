/**
 * Accord Chemical Corporation — central content + config.
 * Single source of truth. Section components import from here so copy stays
 * consistent and the client can edit content in one place.
 */

export const siteConfig = {
  name: "Accord Chemical Corporation",
  legalName: "Accord Chemicals Private Limited",
  tagline: "Pioneering Petrochemical Excellence Since 2009",
  established: 2009,
  description:
    "Accord Chemical Corporation, established in 2009, is actively engaged in Trading, Indenting, Distribution, Imports & Exports of various petrochemicals.",
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
  },
  social: {
    facebook: "#",
    linkedin: "#",
  },
  poweredBy: "Itarsia India Limited",
} as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Services", href: "#verticals" },
  { label: "Industries", href: "#industries" },
  { label: "Growth", href: "#growth" },
  { label: "Contact", href: "#contact" },
] as const;

/** Core business verticals */
export const verticals = [
  {
    id: "import",
    title: "Import & Distribution",
    blurb:
      "Seamless international transactions, leveraging a network of global partners to move petrochemicals across borders reliably.",
    icon: "Import",
  },
  {
    id: "indenting",
    title: "Indenting",
    blurb:
      "Direct sales from overseas suppliers to customers in India — ensuring timely, efficient delivery while optimising supply-chain operations.",
    icon: "Handshake",
  },
  {
    id: "exports",
    title: "Exports",
    blurb:
      "Consistent exports to more than five continents across the globe for a broad range of petrochemicals.",
    icon: "Globe",
  },
  {
    id: "services",
    title: "Comprehensive Services",
    blurb:
      "Clearing, storage, survey, insurance and logistics — guiding clients seamlessly at every critical juncture.",
    icon: "Wrench",
  },
] as const;

/** Headline metrics */
export const stats = [
  { value: 186, suffix: "+", label: "Satisfied Customers" },
  { value: 58, suffix: "+", label: "Overseas Countries" },
  { value: 20, suffix: "+", label: "Indian States & UTs" },
  { value: 18600, suffix: "+", label: "Annual Volume (Metric Tons)" },
] as const;

/** Product families */
export const products = [
  {
    name: "Acrylates & Monomers",
    desc: "Building-block acrylates and monomers for coatings, adhesives and polymers.",
  },
  {
    name: "Aromatics & Hydrocarbons",
    desc: "Benzene, toluene, xylene and solvent-grade hydrocarbon streams.",
  },
  {
    name: "Amines",
    desc: "Ethanolamines and specialty amines for gas treating and surfactants.",
  },
  {
    name: "Chlorinated Solvents & Chemicals",
    desc: "High-purity chlorinated solvents for cleaning and synthesis.",
  },
  {
    name: "Glycols & Glycol Ethers",
    desc: "MEG, DEG and glycol ethers for antifreeze, resins and formulations.",
  },
  {
    name: "OXO Alcohols",
    desc: "2-EH, n-butanol and iso-butanol for plasticisers and esters.",
  },
  {
    name: "Specialty Acrylates",
    desc: "Functional and multi-functional acrylates for UV-cure systems.",
  },
  {
    name: "Others",
    desc: "A wide basket of specialty and commodity petrochemicals on demand.",
  },
] as const;

/** Industries served */
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
 * Growth story — reconstructed from the client's "Quantum of Volume in MTS and
 * Revenue" chart. volumeKT = thousand metric tons, revenueUSD = USD millions,
 * revenueINR = INR crore.
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

export const aboutCopy = {
  eyebrow: "Who We Are",
  heading: "India's trusted name in petrochemical trade",
  body: [
    "Accord Chemical Corporation stands out as one of the largest petrochemical distribution companies — leading in the import, export and indenting of diverse petrochemicals from our Mumbai headquarters.",
    "With an expansive nationwide presence and partners across 58+ countries, we excel at meeting the dynamic demands of the industry: dependable supply, transparent dealing and end-to-end logistics.",
  ],
  pillars: [
    { title: "Established 2009", desc: "Over 15 years of uninterrupted, trusted trade." },
    { title: "Global Network", desc: "Sourcing & selling across five continents." },
    { title: "End-to-End", desc: "From customs clearing to last-mile delivery." },
  ],
} as const;

export type Vertical = (typeof verticals)[number];
export type Product = (typeof products)[number];
export type GrowthPoint = (typeof growth)[number];
export type Stat = (typeof stats)[number];
