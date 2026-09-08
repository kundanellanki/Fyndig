/**
 * ---------------------------------------------------------------------------
 * CAREERS — job postings
 * ---------------------------------------------------------------------------
 * This is the whole job board. Add an object to `jobs` to publish a role;
 * the Careers section picks it up automatically.
 *
 * While `jobs` is empty (or every entry has `open: false`), the section shows a
 * "No open roles right now" state with an open-application button — no fake
 * listings, nothing to remove later.
 *
 * To take a role down without deleting it, set `open: false`.
 * ---------------------------------------------------------------------------
 */

import { contact } from './company';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Co-founder';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export type Job = {
  /** Unique key. Also used as the anchor id, so keep it URL-safe. */
  id: string;
  title: string;
  /** Team or discipline, e.g. 'Engineering', 'Design', 'Hardware'. */
  department: string;
  type: JobType;
  location: string;
  mode: WorkMode;
  /** Free text, e.g. '0–2 years', 'Fresher welcome', '3+ years'. */
  experience: string;
  /** One or two sentences shown on the collapsed card. */
  summary: string;
  /** Bullets shown when the card is expanded. Leave any list empty to hide it. */
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  /** ISO date (YYYY-MM-DD) — rendered as "Posted 8 Sep 2026". */
  postedOn: string;
  /** Where applications go. Defaults to the company email. */
  applyEmail?: string;
  /** External application form. When set, the Apply button links here instead. */
  applyUrl?: string | null;
  /** false hides the role without deleting it. */
  open: boolean;
};

export const jobs: Job[] = [
  /* ---------------------------------------------------------------------
   * Copy this block, fill it in, and the role goes live.
   *
   * {
   *   id: 'frontend-engineer',
   *   title: 'Frontend Engineer',
   *   department: 'Engineering',
   *   type: 'Full-time',
   *   location: 'Tirupati, Andhra Pradesh',
   *   mode: 'On-site',
   *   experience: '0–2 years',
   *   summary: 'Build the interfaces for our software and IoT products.',
   *   responsibilities: [
   *     'Build responsive web interfaces from design files.',
   *     'Work with the backend team on APIs and real-time data.',
   *   ],
   *   requirements: [
   *     'Strong JavaScript and TypeScript.',
   *     'Experience with React or Next.js.',
   *   ],
   *   niceToHave: ['Exposure to IoT dashboards or real-time data.'],
   *   postedOn: '2026-09-08',
   *   applyUrl: null,
   *   open: true,
   * },
   * ------------------------------------------------------------------- */
];

/** Copy for the section. Edit freely. */
export const careersSection = {
  eyebrow: 'Careers',
  heading: 'Build it with us.',
  intro:
    'We are a small team at the start of something. If you like solving real problems across software, hardware and everything between, we would like to hear from you.',
  /** Shown when there is nothing open. */
  emptyHeading: 'No open roles right now.',
  emptyBody:
    'We are not hiring at the moment. Roles are posted here as they open — and we always read open applications, so send your work through if you think you would fit.',
  openApplicationLabel: 'Send an open application',
  /** Where open applications go. */
  applyEmail: contact.email,
};

/** Roles actually shown on the site. */
export const openJobs = jobs.filter((j) => j.open);

/** '2026-09-08' → '8 Sep 2026'. Returns '' for anything unparseable. */
export const formatPostedOn = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Prefilled application mailto for a given role (or an open application). */
export const applyMailto = (job?: Job) => {
  const to = job?.applyEmail ?? careersSection.applyEmail;
  const subject = job ? `Application — ${job.title}` : 'Open application — fyndig';
  const body = job
    ? [
        `Role: ${job.title}`,
        '',
        'Name:',
        'Phone:',
        'Portfolio / GitHub / LinkedIn:',
        '',
        'Why this role:',
        '',
        '(Please attach your CV.)',
      ].join('\n')
    : [
        'Name:',
        'Phone:',
        'What you do:',
        'Portfolio / GitHub / LinkedIn:',
        '',
        'What you would like to work on at fyndig:',
        '',
        '(Please attach your CV.)',
      ].join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
