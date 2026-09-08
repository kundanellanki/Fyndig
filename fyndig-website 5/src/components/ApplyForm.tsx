'use client';

/**
 * Job application form.
 *
 * Posts name, contact details and a CV to the backend. If no backend is
 * configured (NEXT_PUBLIC_API_URL unset) the form is not rendered at all and
 * Careers falls back to the pre-filled email link — better a working mailto
 * than a form that silently goes nowhere.
 */

import { useRef, useState } from 'react';
import { submitApplication } from '@/lib/api';
import Icon from './Icon';

type Status = 'idle' | 'sending' | 'sent';

const MAX_CV_BYTES = 8 * 1024 * 1024;
const ACCEPTED = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export default function ApplyForm({ slug, title }: { slug: string; title: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cvName, setCvName] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const startedAt = useRef(Date.now());

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Client-side checks first, so an obvious mistake never costs a round trip.
    const next: Record<string, string> = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const cv = data.get('cv');

    if (name.length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Please enter a valid email address.';
    if (cv instanceof File && cv.size > MAX_CV_BYTES) next.cv = 'That file is over 8 MB.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    data.set('startedAt', String(startedAt.current));
    setStatus('sending');

    const result = await submitApplication(slug, data);

    if (result?.ok) {
      setStatus('sent');
      form.reset();
      setCvName('');
      return;
    }
    if (result && !result.ok) {
      setErrors(result.fieldErrors ?? { form: result.message ?? 'Something went wrong. Please try again.' });
    } else {
      setErrors({ form: 'We could not reach the server. Please email your CV instead.' });
    }
    setStatus('idle');
  };

  if (status === 'sent') {
    return (
      <div className="card mt-6 p-7 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent-soft">
          <Icon name="Check" className="h-5 w-5" strokeWidth={2} />
        </span>
        <h4 className="mt-4 font-display text-xl font-light text-white">Application received</h4>
        <p className="mt-2 text-[0.875rem] text-mist">
          Thanks for applying for {title}. We read every application and will be in touch if it looks like a fit.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name} required>
          <input name="name" className="field" placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input name="email" type="email" className="field" placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input name="phone" type="tel" className="field" placeholder="+91 00000 00000" autoComplete="tel" />
        </Field>
        <Field label="Portfolio / GitHub / LinkedIn" error={errors.links}>
          <input name="links" className="field" placeholder="https://…" />
        </Field>
      </div>

      <Field label="Why this role" error={errors.message}>
        <textarea name="message" rows={4} className="field" placeholder="A few lines about you and why this role." />
      </Field>

      <Field label="CV (PDF or Word, up to 8 MB)" error={errors.cv}>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-ink-950/40 px-4 py-3 transition-colors hover:border-accent/40">
          <Icon name="ArrowUpRight" className="h-4 w-4 rotate-[-45deg] text-accent-soft" />
          <span className="text-[0.875rem] text-mist">{cvName || 'Choose a file'}</span>
          <input
            name="cv"
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            onChange={(e) => setCvName(e.target.files?.[0]?.name ?? '')}
          />
        </label>
      </Field>

      {/* Honeypot — off-screen rather than display:none, which bots skip. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`website-${slug}`}>Website</label>
        <input id={`website-${slug}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.form ? (
        <p role="alert" className="text-[0.8125rem] text-ember">
          {errors.form}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary h-11 px-5 text-sm" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send application'}
        <Icon name="ArrowRight" className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.18em] text-steel">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {children}
      {error ? (
        <p role="alert" className="mt-2 text-[0.75rem] text-ember">
          {error}
        </p>
      ) : null}
    </div>
  );
}
