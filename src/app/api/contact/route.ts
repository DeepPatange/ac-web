import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Shape of the JSON body we accept from the Contact form. */
interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

/** Basic, pragmatic email check — not RFC-perfect, just sane. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json().catch(() => null);

    if (body === null || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const data = body as Partial<Record<keyof ContactPayload, unknown>>;

    if (!isNonEmptyString(data.name)) {
      return NextResponse.json(
        { ok: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(data.email) || !EMAIL_RE.test(data.email.trim())) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(data.message)) {
      return NextResponse.json(
        { ok: false, error: "Please include a short message." },
        { status: 400 }
      );
    }

    const payload: ContactPayload = {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
      phone: isNonEmptyString(data.phone) ? data.phone.trim() : undefined,
      company: isNonEmptyString(data.company) ? data.company.trim() : undefined,
    };

    // TODO: integrate SMTP / Resend / Nodemailer here.
    // e.g. await resend.emails.send({
    //   from: "website@accordchemicals.com",
    //   to: siteConfig.contact.email,
    //   replyTo: payload.email,
    //   subject: `New enquiry from ${payload.name}`,
    //   text: payload.message,
    // });
    // Until a provider is wired up, log so enquiries are never silently lost.
    console.log("[contact] new enquiry:", payload);

    return NextResponse.json(
      { ok: true, message: "Thanks — we'll be in touch shortly." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
