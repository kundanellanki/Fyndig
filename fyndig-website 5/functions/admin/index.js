/**
 * ---------------------------------------------------------------------------
 * GET /admin  --  the enquiries list
 * ---------------------------------------------------------------------------
 * Every enquiry submitted through the contact form, newest first, read
 * straight out of D1. Add ?format=csv for a spreadsheet.
 *
 * ACCESS
 * ------
 * Protected by HTTP Basic auth. Set these in the Cloudflare dashboard under
 * Pages project -> Settings -> Variables and Secrets:
 *
 *   ADMIN_USER       your login name        (plaintext variable is fine)
 *   ADMIN_PASSWORD   a long random password (add it as a SECRET, not a text
 *                    variable, so it is encrypted and never shown again)
 *
 * Until ADMIN_PASSWORD is set this page refuses to serve anything at all. It
 * fails closed on purpose: a half-configured admin page that quietly shows
 * everyone's contact details is worse than one that is switched off.
 * ---------------------------------------------------------------------------
 */

const PAGE_SIZE = 200;

/** Compare without leaking, through timing, how much of the value matched. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="fyndig admin", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function authorised(request, env) {
  const expectedPass = env.ADMIN_PASSWORD;
  if (!expectedPass) return 'unconfigured';

  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;

  let decoded = '';
  try {
    decoded = atob(header.slice(6));
  } catch (e) {
    return false;
  }

  const split = decoded.indexOf(':');
  if (split < 0) return false;

  const user = decoded.slice(0, split);
  const pass = decoded.slice(split + 1);

  // Both comparisons always run, so a wrong username and a wrong password
  // take the same time.
  const userOk = safeEqual(user, env.ADMIN_USER || 'fyndig');
  const passOk = safeEqual(pass, expectedPass);
  return userOk && passOk;
}

const escapeHtml = (v) =>
  String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Excel and Sheets both want quotes doubled and the whole field quoted. */
const csvCell = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';

function csv(rows) {
  const head = ['id', 'created_at', 'name', 'email', 'phone', 'company', 'project_type', 'message', 'source', 'emailed'];
  const lines = [head.join(',')];
  for (const r of rows) lines.push(head.map((k) => csvCell(r[k])).join(','));
  return lines.join('\r\n');
}

function page(rows, total) {
  const style = [
    ':root{color-scheme:dark}',
    '*{box-sizing:border-box}',
    'body{margin:0;padding:2rem 1.25rem;background:#0b1220;color:#e6edf7;',
    'font:15px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    '.wrap{max-width:1200px;margin:0 auto}',
    'h1{margin:0 0 .25rem;font-size:1.5rem;letter-spacing:-.01em}',
    '.sub{margin:0 0 1.5rem;color:#8ea0bd;font-size:.9rem}',
    '.sub a{color:#7cc0ff}',
    '.scroll{overflow-x:auto;border:1px solid #1e2a40;border-radius:12px}',
    'table{border-collapse:collapse;width:100%;min-width:900px;font-size:.875rem}',
    'th,td{padding:.65rem .8rem;text-align:left;vertical-align:top;border-bottom:1px solid #1e2a40}',
    'th{background:#111c30;font-weight:600;color:#a9bcd8;white-space:nowrap;',
    'position:sticky;top:0}',
    'tr:last-child td{border-bottom:0}',
    'td.msg{white-space:pre-wrap;min-width:280px;max-width:460px}',
    'td.when{white-space:nowrap;color:#8ea0bd}',
    'a{color:#7cc0ff}',
    '.tag{display:inline-block;padding:.1rem .45rem;border-radius:999px;',
    'font-size:.72rem;background:#16233a;color:#8ea0bd}',
    '.empty{padding:3rem 1rem;text-align:center;color:#8ea0bd}',
  ].join('');

  const body = rows.length
    ? [
        '<div class="scroll"><table><thead><tr>',
        '<th>#</th><th>Received</th><th>Name</th><th>Email</th><th>Phone</th>',
        '<th>Company</th><th>Type</th><th>Message</th><th>Mailed</th>',
        '</tr></thead><tbody>',
        rows
          .map((r) =>
            [
              '<tr>',
              '<td>' + escapeHtml(r.id) + '</td>',
              '<td class="when">' + escapeHtml(String(r.created_at || '').replace('T', ' ').slice(0, 16)) + '</td>',
              '<td>' + escapeHtml(r.name) + '</td>',
              '<td><a href="mailto:' + escapeHtml(r.email) + '">' + escapeHtml(r.email) + '</a></td>',
              '<td>' + escapeHtml(r.phone) + '</td>',
              '<td>' + escapeHtml(r.company) + '</td>',
              '<td>' + escapeHtml(r.project_type) + '</td>',
              '<td class="msg">' + escapeHtml(r.message) + '</td>',
              '<td><span class="tag">' + (r.emailed ? 'sent' : 'no') + '</span></td>',
              '</tr>',
            ].join('')
          )
          .join(''),
        '</tbody></table></div>',
      ].join('')
    : '<div class="scroll"><p class="empty">No enquiries yet. When someone fills in the contact form, they appear here.</p></div>';

  const shown = rows.length === PAGE_SIZE ? 'showing the most recent ' + PAGE_SIZE : 'all of them';

  return [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="robots" content="noindex,nofollow">',
    '<title>fyndig enquiries</title><style>', style, '</style></head><body><div class="wrap">',
    '<h1>Enquiries</h1>',
    '<p class="sub">', String(total), ' total, ', shown, '. ',
    '<a href="/admin?format=csv">Download CSV</a></p>',
    body,
    '</div></body></html>',
  ].join('');
}

export async function onRequestGet({ request, env }) {
  const auth = authorised(request, env);

  if (auth === 'unconfigured') {
    return new Response(
      'This page is switched off until an admin password is set.\n\n' +
        'Cloudflare dashboard -> Workers & Pages -> fyndig -> Settings ->\n' +
        'Variables and Secrets. Add ADMIN_PASSWORD as a secret (and\n' +
        'optionally ADMIN_USER, which defaults to "fyndig"), then redeploy.\n',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } }
    );
  }

  if (!auth) return unauthorized();

  if (!env.DB) {
    return new Response('No database is bound to this project, so there is nothing to show.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  let rows = [];
  let total = 0;
  try {
    const listed = await env.DB.prepare(
      'SELECT id, created_at, name, email, phone, company, project_type, message, source, emailed ' +
        'FROM enquiries ORDER BY id DESC LIMIT ' + PAGE_SIZE
    ).all();
    rows = listed.results || [];
    const counted = await env.DB.prepare('SELECT COUNT(*) AS n FROM enquiries').first();
    total = (counted && counted.n) || rows.length;
  } catch (e) {
    return new Response('Could not read the enquiries table: ' + e.message, {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  const url = new URL(request.url);
  if (url.searchParams.get('format') === 'csv') {
    return new Response(csv(rows), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="fyndig-enquiries.csv"',
        'cache-control': 'no-store',
      },
    });
  }

  return new Response(page(rows, total), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
