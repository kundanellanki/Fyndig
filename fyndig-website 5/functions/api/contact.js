/**
 * ---------------------------------------------------------------------------
 * POST /api/contact  --  Cloudflare Pages Function
 * ---------------------------------------------------------------------------
 * Every valid enquiry is WRITTEN TO THE DATABASE FIRST, then emailed if a mail
 * provider is configured. That order is the whole point: storage is the record
 * and email is only a notification, so a broken or unconfigured mailbox can
 * never lose an enquiry. Read them at /admin.
 *
 * BINDINGS AND VARIABLES (Cloudflare dashboard -> Pages project -> Settings)
 *   DB               D1 binding, required for storage      (already set up)
 *   RESEND_API_KEY   optional, turns on email notification (secret)
 *   CONTACT_TO       optional, defaults to fyndig@zohomail.in
 *   CONTACT_FROM     optional, defaults to Resend's shared sending address
 *
 * If DB is missing AND no mail key is set, the reply is
 * { delivered: false, reason: 'not-configured' } and the site falls back to
 * opening the visitor's own mail app. The form is never a dead end.
 * ---------------------------------------------------------------------------
 */

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const json = (data, status) =>
  new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/** Trim, and cap length so one bad actor cannot fill the database. */
const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 500);

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ delivered: false, error: 'Invalid request body.' }, 400);
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const phone = clean(body.phone, 40);
  const company = clean(body.company || body.companyName, 160);
  const projectType = clean(body.projectType, 80);

  // Honeypot. A real visitor never fills this in; a bot fills everything.
  // Answer as though it worked, so the bot learns nothing from the reply.
  if (clean(body.website, 200)) return json({ delivered: true }, 200);

  if (!name || !isEmail(email) || message.length < 10) {
    return json({ delivered: false, error: 'Please complete the required fields.' }, 422);
  }

  const now = new Date().toISOString();
  const country = (request.cf && request.cf.country) || '';
  const source = country ? 'web (' + country + ')' : 'web';

  let stored = false;
  let id = null;

  if (env.DB) {
    try {
      const res = await env.DB.prepare(
        'INSERT INTO enquiries (created_at, name, email, phone, company, project_type, message, source, emailed) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)'
      )
        .bind(now, name, email, phone, company, projectType, message, source)
        .run();
      stored = true;
      id = (res && res.meta && res.meta.last_row_id) || null;
    } catch (e) {
      // Fall through. Email may still get the enquiry out, and if that also
      // fails the visitor is sent to their own mail app rather than a dead end.
      stored = false;
    }
  }

  let emailed = false;

  if (env.RESEND_API_KEY) {
    const text = [
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (phone || '-'),
      'Company: ' + (company || '-'),
      'Project type: ' + (projectType || '-'),
      'Received: ' + now,
      '',
      message,
    ].join('\n');

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + env.RESEND_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM || 'fyndig website <onboarding@resend.dev>',
          to: [env.CONTACT_TO || 'fyndig@zohomail.in'],
          reply_to: email,
          subject: 'New enquiry - ' + (projectType || 'General') + ' - ' + name,
          text: text,
        }),
      });
      emailed = res.ok;
    } catch (e) {
      emailed = false;
    }

    if (emailed && stored && id) {
      try {
        await env.DB.prepare('UPDATE enquiries SET emailed = 1 WHERE id = ?').bind(id).run();
      } catch (e) {
        // The enquiry is safe either way; the flag is only for the admin list.
      }
    }
  }

  if (stored || emailed) return json({ delivered: true, id: id }, 200);

  // Nothing held on to it. Let the visitor's mail app carry the message.
  return json({ delivered: false, reason: 'not-configured' }, 200);
}
