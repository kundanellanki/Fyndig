/**
 * ---------------------------------------------------------------------------
 * API client
 * ---------------------------------------------------------------------------
 * Talks to the fyndig backend. Set NEXT_PUBLIC_API_URL to point at it, e.g.
 *
 *   NEXT_PUBLIC_API_URL=https://api.fyndig.com
 *
 * With that unset, every function here returns null and the site falls back to
 * the static data in src/data/. That is deliberate: the marketing site must
 * render correctly whether or not the API is reachable, and a backend outage
 * should never blank a page.
 */

import type { Job } from '@/data/jobs';
import type { Project } from '@/data/projects';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
export const apiConfigured = API_URL.length > 0;

/** How long a server-side fetch may hold up a page render. */
const SERVER_TIMEOUT_MS = 4000;

type FetchOptions = RequestInit & { timeoutMs?: number; revalidate?: number };

async function call<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  if (!apiConfigured) return null;

  const { timeoutMs = SERVER_TIMEOUT_MS, revalidate, ...init } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { accept: 'application/json', ...(init.headers ?? {}) },
      ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Unreachable, slow, or malformed — the caller falls back to static data.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* --------------------------------------------------------------- content --- */

/** Open roles, or null if the API is not configured or not reachable. */
export async function fetchJobs(): Promise<Job[] | null> {
  const data = await call<{ jobs: Job[] }>('/api/jobs', { revalidate: 60 });
  return data?.jobs ?? null;
}

export async function fetchProjects(): Promise<Project[] | null> {
  const data = await call<{ projects: Project[] }>('/api/projects', { revalidate: 60 });
  if (!data?.projects) return null;
  return data.projects.map((p) => ({ ...p, image: safeImage(p.image) }));
}

/**
 * `next/image` throws at runtime for a remote host that is not in
 * next.config.mjs, and the admin panel's image field is free text — so an
 * operator pasting a URL must not be able to crash the page.
 *
 * A local path is kept. An http(s) URL is kept too; ProjectCard renders those
 * with a plain <img>, which needs no host allowlist and keeps the image
 * optimizer closed to arbitrary hosts. Anything else (`data:`, `javascript:`,
 * a bare filename) becomes null and the card shows its generated visual.
 */
function safeImage(value: string | null | undefined): string | null {
  const src = (value ?? '').trim();
  if (!src) return null;
  if (src.startsWith('/') && !src.startsWith('//')) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return null;
}

/** True for an image that must bypass next/image. Kept next to safeImage. */
export const isRemoteImage = (src: string) => /^https?:\/\//i.test(src);

/* --------------------------------------------------------------- submit --- */

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
  /** When the form was first rendered; a near-instant submit reads as a bot. */
  startedAt?: number;
};

export type SubmitResult =
  | { ok: true; id: string | null }
  | { ok: false; status: number; fieldErrors?: Record<string, string>; message?: string };

export async function submitContact(payload: ContactPayload): Promise<SubmitResult | null> {
  if (!apiConfigured) return null;
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, id: body?.id ?? null };
    return {
      ok: false,
      status: res.status,
      fieldErrors: body?.error?.details,
      message: body?.error?.message,
    };
  } catch {
    return null; // network failure — caller falls back to mailto
  }
}

/** Applications are multipart because they carry a CV. */
export async function submitApplication(slug: string, form: FormData): Promise<SubmitResult | null> {
  if (!apiConfigured) return null;
  try {
    const res = await fetch(`${API_URL}/api/jobs/${encodeURIComponent(slug)}/apply`, {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: form,
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, id: body?.id ?? null };
    return {
      ok: false,
      status: res.status,
      fieldErrors: body?.error?.details,
      message: body?.error?.message,
    };
  } catch {
    return null;
  }
}
