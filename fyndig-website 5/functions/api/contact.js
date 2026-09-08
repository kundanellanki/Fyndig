/**
 * ---------------------------------------------------------------------------
 * POST /api/contact  --  Cloudflare Pages Function
 * ---------------------------------------------------------------------------
 * The site itself is static. This is the one piece of server that exists, and
 * it runs at Cloudflare's edge alongside the HTML: no container, no port, and
 * nothing to pay for on the free plan.
 *
 * WITH NO MAIL PROVIDER CONFIGURED it replies { delivered: false } and the
 * form falls back to opening the visitor's own mail app with the enquiry
 * pre-filled. The form works out of the box, with zero setup.
 *
 * TO ACTUALLY DELIVER MAIL
 * ------------------------
 * 1. Create a free account at https://resend.com and make an API key.
 * 2. Cloudflare dashboard -> this Pages project -> Settings -> Environment
 *    variables, add:
 *
 *      RESEND_API_KEY   re_xxxxxxxxxxxx        (mark it as a secret)
 *      CONTACT_TO       fyndig@zohomail.in
 *      CONTACT_FROM     fyndig website <onboarding@resend.dev>
 *
 *    Until a domain is verified with Resend, onboarding@resend.dev is the only
 *    address you may send FROM. Enquiries still land in fyndig@zohomail.in.
 *    Once fyndig owns a domain, verify it there and set CONTACT_FROM to
 *    something like: fyndig website <no-reply@fyndig.com>
 * 3. Redeploy. Nothing in the site's own code changes.
 * ---------------------------------------------------------------------------
 */

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const json = (data, status) =>
  new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ delivered: false, error: 'Invalid request body.' }, 400);
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();

  // Honeypot. A real visitor never fills this in; a bot fills everything.
  // Answer as though it worked, so the bot learns nothing from the reply.
  if ((body.website || '').trim()) return json({ delivered: true }, 200);

  if (!name || !isEmail(email) || message.length < 10) {
    return json({ delivered: false, error: 'Please complete the required fields.' }, 422);
  }

  if (!env.RESEND_API_KEY) {
    // Nothing to send with. Tell the client to use the mailto fallback.
    return json({ delivered: false, reason: 'not-configured' }, 200);
  }

  const text = [
    'Name: ' + name,
    'Email: ' + email,
    'Phone: ' + (body.phone || '-'),
    'Company: ' + (body.company || body.companyName || '-'),
    'Project type: ' + (body.projectType || '-'),
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
        subject: 'New enquiry - ' + (body.projectType || 'General') + ' - ' + name,
        text: text,
      }),
    });

    if (!res.ok) return json({ delivered: false, reason: 'send-failed' }, 200);
    return json({ delivered: true }, 200);
  } catch (e) {
    // The visitor is not the person who should hear about our outage.
    return json({ delivered: false, reason: 'send-failed' }, 200);
  }
}
