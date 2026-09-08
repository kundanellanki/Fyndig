'use client';

import { useRef, useState } from 'react';
import { contact, telHref, waHref } from '@/data/company';
import { submitContact, apiConfigured } from '@/lib/api';
import { projectTypes } from '@/data/services';
import Icon from './Icon';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

const initial = { name: '', email: '', phone: '', companyName: '', projectType: '', message: '' };

/**
 * Section 19/20 — Contact.
 *
 * Submission order, so an enquiry is never lost:
 *   1. If NEXT_PUBLIC_API_URL is set, POST to the backend. It stores the
 *      enquiry first and queues the notification email separately, so a mail
 *      outage cannot lose a lead.
 *   2. If the backend is not configured or is unreachable, fall back to the
 *      local Next.js route.
 *   3. If that has no mail provider either, open a pre-filled email in the
 *      visitor's own mail app.
 *
 * A hidden honeypot field and the render timestamp let the backend drop bots
 * without showing a captcha to a human.
 */
export default function Contact() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  // Bots fill every field and submit instantly; humans do neither.
  const honeypot = useRef('');
  const startedAt = useRef(Date.now());

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = 'Please enter a valid email address.';
    if (values.phone.trim() && !/^[\d\s+()-]{6,}$/.test(values.phone.trim())) e.phone = 'Please enter a valid phone number.';
    if (values.message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildMailto = () => {
    const subject = `New enquiry — ${values.projectType || 'General'} — ${values.name}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone || '—'}`,
      `Company: ${values.companyName || '—'}`,
      `Project type: ${values.projectType || '—'}`,
      '',
      values.message,
    ].join('\n');
    return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');

    // The API field is `company`; the form state calls it `companyName` because
    // browsers autofill an input named "company" with the wrong thing.
    const { companyName, ...rest } = values;
    const payload = {
      ...rest,
      company: companyName,
      website: honeypot.current,
      startedAt: startedAt.current,
    };

    // 1. The backend, when one is configured.
    if (apiConfigured) {
      const result = await submitContact(payload);
      if (result?.ok) {
        setStatus('sent');
        setValues(initial);
        return;
      }
      if (result && !result.ok && result.fieldErrors) {
        setErrors(result.fieldErrors);
        setStatus('idle');
        return;
      }
      if (result && !result.ok) {
        // Rate limited or refused — say so rather than silently opening mail.
        setErrors({ message: result.message ?? 'Please try again in a moment.' });
        setStatus('idle');
        return;
      }
      // result === null: unreachable. Fall through to the local route.
    }

    // 2. The bundled Next.js route.
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { delivered?: boolean };
      if (res.ok && data.delivered) {
        setStatus('sent');
        setValues(initial);
        return;
      }
    } catch {
      /* fall through */
    }

    // 3. The visitor's own mail app.
    window.location.href = buildMailto();
    setStatus('mailto');
  };

  return (
    <section id="contact" className="sheet section">
      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Details */}
        <div>
          <p className="eyebrow" data-reveal="fade">
            Contact
          </p>
          <h2 className="h-section mt-5" data-reveal="blur">
            Let&apos;s Build Something Together.
          </h2>
          <p className="lead mt-6" data-reveal>
            Have an idea, problem, or project you&apos;d like to explore? Let&apos;s create something meaningful.
          </p>

          <dl className="mt-10 space-y-7" data-reveal data-reveal-stagger>
            <div className="flex gap-4">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-soft">
                <Icon name="Mail" className="h-[18px] w-[18px]" />
              </span>
              <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Email</dt>
                <dd className="mt-1.5">
                  <a href={`mailto:${contact.email}`} className="text-[0.9375rem] text-white transition-colors hover:text-accent-soft">
                    {contact.email}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-soft">
                <Icon name="Phone" className="h-[18px] w-[18px]" />
              </span>
              <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Phone</dt>
                <dd className="mt-1.5 space-y-1">
                  {contact.phones.map((p) => (
                    <a
                      key={p}
                      href={telHref(p)}
                      className="block text-[0.9375rem] text-white transition-colors hover:text-accent-soft"
                    >
                      {p}
                    </a>
                  ))}
                </dd>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-soft">
                <Icon name="MessageCircle" className="h-[18px] w-[18px]" />
              </span>
              <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">WhatsApp</dt>
                <dd className="mt-1.5 flex flex-wrap gap-2">
                  {contact.whatsapp.map((p) => (
                    <a
                      key={p}
                      href={waHref(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-pill rounded-full px-3 py-1.5 text-[0.8125rem] text-mist transition-colors hover:text-white"
                    >
                      {p}
                    </a>
                  ))}
                </dd>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-soft">
                <Icon name="Clock" className="h-[18px] w-[18px]" />
              </span>
              <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Working Hours</dt>
                <dd className="mt-1.5 text-[0.9375rem] text-mist">{contact.workingHours}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Form */}
        <div className="card p-7 sm:p-9" data-reveal="right">
          {status === 'sent' || status === 'mailto' ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent-soft">
                <Icon name="Check" className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-light text-white">
                {status === 'sent' ? 'Message sent' : 'Your email is ready'}
              </h3>
              <p className="lead mt-3 max-w-sm text-[0.9375rem]">
                {status === 'sent'
                  ? "Thanks for reaching out — we'll get back to you shortly."
                  : `We opened a pre-filled email to ${contact.email}. Send it and we'll get back to you shortly.`}
              </p>
              <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-8 h-10 px-5 text-sm">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="relative space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full Name" required error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    className="field"
                    placeholder="Your name"
                    value={values.name}
                    onChange={set('name')}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                  />
                </Field>

                <Field id="email" label="Email" required error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field"
                    placeholder="you@company.com"
                    value={values.email}
                    onChange={set('email')}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>

                <Field id="phone" label="Phone" error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="field"
                    placeholder="+91 00000 00000"
                    value={values.phone}
                    onChange={set('phone')}
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>

                <Field id="companyName" label="Company">
                  <input
                    id="companyName"
                    name="companyName"
                    className="field"
                    placeholder="Company name"
                    value={values.companyName}
                    onChange={set('companyName')}
                    autoComplete="organization"
                  />
                </Field>
              </div>

              <Field id="projectType" label="Project Type">
                <select id="projectType" name="projectType" className="field" value={values.projectType} onChange={set('projectType')}>
                  <option value="">Select a project type</option>
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="message" label="Message" required error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  className="field"
                  rows={5}
                  placeholder="Tell us about the problem you'd like to solve."
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={Boolean(errors.message)}
                />
              </Field>

              {/* Honeypot: off-screen, not hidden, so bots that check for
                  display:none still fill it in. Never shown to a person. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    honeypot.current = e.target.value;
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Start a Conversation'}
                <Icon name="ArrowRight" className="h-4 w-4" />
              </button>

              <p className="text-center text-[0.75rem] leading-relaxed text-steel">
                Prefer email? Write to{' '}
                <a href={`mailto:${contact.email}`} className="text-mist underline underline-offset-4 hover:text-white">
                  {contact.email}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.6875rem] uppercase tracking-[0.18em] text-steel">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-2 text-[0.75rem] text-ember">
          {error}
        </p>
      ) : null}
    </div>
  );
}
