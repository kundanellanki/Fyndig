import { NextResponse } from 'next/server';

/**
 * ---------------------------------------------------------------------------
 * POST /api/contact
 * ---------------------------------------------------------------------------
 * Validates the enquiry and, if a mail provider is configured, delivers it.
 *
 * OUT OF THE BOX no provider is configured, so this route replies
 * `{ delivered: false }` and the browser falls back to opening a pre-filled
 * email to the company address — the form always works, with zero setup.
 *
 * TO DELIVER SERVER-SIDE
 * ----------------------
 * Option A — Zoho SMTP (matches fyndig@zohomail.in):
 *   1. npm install nodemailer
 *   2. Add to .env.local:
 *        SMTP_HOST=smtp.zoho.in
 *        SMTP_PORT=465
 *        SMTP_USER=fyndig@zohomail.in
 *        SMTP_PASS=<app-specific password from Zoho>
 *        CONTACT_TO=fyndig@zohomail.in
 *   3. Uncomment the nodemailer block below.
 *
 * Option B — Resend:
 *   1. npm install resend
 *   2. Add RESEND_API_KEY and CONTACT_TO to .env.local
 *   3. Send with resend.emails.send({...}) in place of the block below.
 * ---------------------------------------------------------------------------
 */

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  /** Named to match the backend API. `companyName` is accepted too. */
  company?: string;
  companyName?: string;
  projectType?: string;
  message?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ delivered: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !isEmail(email) || message.length < 10) {
    return NextResponse.json({ delivered: false, error: 'Please complete the required fields.' }, { status: 422 });
  }

  const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!configured) {
    // Nothing to send with — tell the client to use the mailto fallback.
    return NextResponse.json({ delivered: false, reason: 'not-configured' }, { status: 200 });
  }

  /* -------------------------------------------------------------------------
  // Uncomment after `npm install nodemailer` and setting the env vars above.

  const nodemailer = (await import('nodemailer')).default;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"fyndig website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO ?? process.env.SMTP_USER,
    replyTo: email,
    subject: `New enquiry — ${body.projectType || 'General'} — ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${body.phone || '—'}`,
      `Company: ${body.company || body.companyName || '—'}`,
      `Project type: ${body.projectType || '—'}`,
      '',
      message,
    ].join('\n'),
  });

  return NextResponse.json({ delivered: true }, { status: 200 });
  ------------------------------------------------------------------------- */

  return NextResponse.json({ delivered: false, reason: 'not-configured' }, { status: 200 });
}
