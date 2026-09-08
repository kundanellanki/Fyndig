/**
 * ---------------------------------------------------------------------------
 * POST /api/contact  --  Cloudflare Pages Function
 * ---------------------------------------------------------------------------
 * Every valid enquiry is WRITTEN TO THE DATABASE FIRST, then emailed. That
 * order is the whole point: storage is the record and email is only a
 * notification, so a mail failure can never lose an enquiry. Read them at
 * /admin, or in the D1 database "fyndig-enquiries".
 *
 * SENDING
 * -------
 * Mail goes out through fyndig's own Zoho mailbox over SMTP, so it arrives
 * FROM fyndig@zohomail.in rather than from some third party. Set these in the
 * Cloudflare dashboard -> Pages project -> Settings -> Variables and secrets:
 *
 *   SMTP_PASS   Zoho APP PASSWORD, added as a SECRET   (required to send)
 *   SMTP_USER   defaults to fyndig@zohomail.in
 *   SMTP_HOST   defaults to smtp.zoho.in
 *   SMTP_PORT   defaults to 465 (implicit TLS)
 *   CONTACT_TO  defaults to SMTP_USER
 *
 * The app password is generated in Zoho Mail under Settings -> Security ->
 * App Passwords. It is NOT the normal account password; Zoho refuses that
 * from an application.
 *
 * RESEND_API_KEY is still honoured as a fallback when SMTP_PASS is absent.
 * With neither set the reply is { delivered: false } and the site opens the
 * visitor's own mail app instead, so the form is never a dead end.
 * ---------------------------------------------------------------------------
 */

import { connect } from 'cloudflare:sockets';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const json = (data, status) =>
  new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/** Trim, and cap length so one bad actor cannot fill the database. */
const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 500);

/** base64 of a UTF-8 string. btoa alone mangles anything non-ASCII. */
function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** Header values must be ASCII; anything else gets encoded-word wrapped. */
const encodeHeader = (v) => (/^[\x20-\x7e]*$/.test(v) ? v : '=?UTF-8?B?' + b64(v) + '?=');

/** Break base64 into the 76-character lines SMTP expects. */
function wrap76(s) {
  const out = [];
  for (let i = 0; i < s.length; i += 76) out.push(s.slice(i, i + 76));
  return out.join('\r\n');
}

/**
 * A deliberately small SMTP client. It speaks only the subset needed to hand
 * one message to Zoho: greet, authenticate, one recipient, one body. Anything
 * unexpected from the server throws, and the caller treats that as "not
 * delivered" rather than pretending it worked.
 */
async function sendViaSmtp(env, mail) {
  const host = env.SMTP_HOST || 'smtp.zoho.in';
  const port = Number(env.SMTP_PORT || 465);
  const user = env.SMTP_USER || 'fyndig@zohomail.in';
  const pass = env.SMTP_PASS;

  const socket = connect({ hostname: host, port: port }, { secureTransport: 'on' });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';

  /** Read until a final response line (three digits then a space) arrives. */
  async function read() {
    for (;;) {
      const lines = buffer.split('\r\n');
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^\d{3} /.test(lines[i])) {
          const consumed = lines.slice(0, i + 1).join('\r\n') + '\r\n';
          buffer = buffer.slice(consumed.length);
          return { code: Number(lines[i].slice(0, 3)), line: lines[i] };
        }
      }
      const chunk = await reader.read();
      if (chunk.done) throw new Error('SMTP connection closed early');
      buffer += decoder.decode(chunk.value, { stream: true });
    }
  }

  const write = (s) => writer.write(encoder.encode(s));

  async function cmd(line, expected) {
    await write(line + '\r\n');
    const res = await read();
    if (expected.indexOf(res.code) < 0) throw new Error('SMTP said: ' + res.line);
    return res;
  }

  try {
    const greeting = await read();
    if (greeting.code !== 220) throw new Error('SMTP greeting: ' + greeting.line);

    await cmd('EHLO fyndig.pages.dev', [250]);
    await cmd('AUTH LOGIN', [334]);
    await cmd(b64(user), [334]);
    await cmd(b64(pass), [235]);
    await cmd('MAIL FROM:<' + user + '>', [250]);
    await cmd('RCPT TO:<' + mail.to + '>', [250, 251]);
    await cmd('DATA', [354]);

    const headers = [
      'From: fyndig website <' + user + '>',
      'To: <' + mail.to + '>',
      'Reply-To: <' + mail.replyTo + '>',
      'Subject: ' + encodeHeader(mail.subject),
      'Date: ' + new Date().toUTCString(),
      'Message-ID: <' + crypto.randomUUID() + '@fyndig.pages.dev>',
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      // base64 sidesteps both dot-stuffing and line-length limits.
      'Content-Transfer-Encoding: base64',
      '',
      wrap76(b64(mail.text)),
    ].join('\r\n');

    await write(headers + '\r\n.\r\n');
    const done = await read();
    if (done.code !== 250) throw new Error('SMTP rejected the message: ' + done.line);

    await write('QUIT\r\n');
    return true;
  } finally {
    try { await writer.close(); } catch (e) { /* already gone */ }
    try { await socket.close(); } catch (e) { /* already gone */ }
  }
}

/** Fallback path, for setups using Resend rather than their own mailbox. */
async function sendViaResend(env, mail) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + env.RESEND_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'fyndig website <onboarding@resend.dev>',
      to: [mail.to],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    }),
  });
  return res.ok;
}

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
      stored = false;
    }
  }

  const mail = {
    to: env.CONTACT_TO || env.SMTP_USER || 'fyndig@zohomail.in',
    replyTo: email,
    subject: 'New enquiry - ' + (projectType || 'General') + ' - ' + name,
    text: [
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (phone || '-'),
      'Company: ' + (company || '-'),
      'Project type: ' + (projectType || '-'),
      'Received: ' + now,
      '',
      message,
      '',
      '--',
      'Reply to this message and it goes straight back to the sender.',
    ].join('\n'),
  };

  let emailed = false;
  let mailError = null;

  try {
    if (env.SMTP_PASS) emailed = await sendViaSmtp(env, mail);
    else if (env.RESEND_API_KEY) emailed = await sendViaResend(env, mail);
  } catch (e) {
    // The visitor is not the person who should hear about our mail trouble.
    mailError = e.message;
    emailed = false;
  }

  if (emailed && stored && id) {
    try {
      await env.DB.prepare('UPDATE enquiries SET emailed = 1 WHERE id = ?').bind(id).run();
    } catch (e) {
      // The enquiry is safe either way; the flag is only for the admin list.
    }
  }

  if (mailError) console.log('contact: mail failed:', mailError);

  if (stored || emailed) return json({ delivered: true, id: id }, 200);

  // Nothing held on to it. Let the visitor's own mail app carry the message.
  return json({ delivered: false, reason: 'not-configured' }, 200);
}
