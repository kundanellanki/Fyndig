# Deploying fyndig

The site is live at **https://fyndig.pages.dev** on Cloudflare Pages, free, and
rebuilt automatically on every push to `main`.

This file describes what actually exists. An earlier version of it described a
Fly.io setup with a separate `fyndig-backend` service; that backend was never
built and those instructions did not work. Ignore any copy of them you find.

---

## What is running

| | |
|---|---|
| Host | Cloudflare Pages, project **fyndig** |
| Repository | `kundanellanki/Fyndig`, branch `main` |
| Root directory | `fyndig-website 5` |
| Build command | `npm run build:cf` |
| Output directory | `out` |
| Node version | 22, pinned by `.nvmrc` |
| Database | Cloudflare D1, **fyndig-enquiries**, bound as `DB` |

The site is a **static export**. Every section reads from `src/data`, and the API
client in `src/lib/api.ts` is a no-op unless `NEXT_PUBLIC_API_URL` is set, so
there is no server rendering to pay for. `npm run build` still produces the Node
/ Docker output if a server is ever wanted; `npm run build:cf` produces `out/`.

The only server-side code is in `functions/`, which Cloudflare runs at its edge:

- `functions/api/contact.js` - receives the contact form
- `functions/admin/index.js` - the enquiries list at `/admin`

---

## Where enquiries go

Every valid submission is **written to D1 first**, then emailed. That order is
deliberate: storage is the record, email is only a notification, so a mail
failure can never lose an enquiry.

Read them at **https://fyndig.pages.dev/admin** (or in the D1 console under
Storage & databases in the Cloudflare dashboard). The admin page has a CSV
download.

### The enquiries table

```sql
CREATE TABLE IF NOT EXISTS enquiries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT NOT NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  company      TEXT,
  project_type TEXT,
  message      TEXT NOT NULL,
  source       TEXT,
  emailed      INTEGER NOT NULL DEFAULT 0
);
```

---

## Variables and secrets

Cloudflare dashboard -> Workers & Pages -> **fyndig** -> Settings ->
**Variables and secrets**. Anything marked Secret must be added as a secret, not
as text - secrets are encrypted and hidden after saving.

| Type | Name | Purpose |
|---|---|---|
| Secret | `ADMIN_PASSWORD` | Password for `/admin`. **Without it `/admin` serves nothing at all.** |
| Text | `ADMIN_USER` | Username for `/admin`. Defaults to `fyndig`. |
| Secret | `SMTP_PASS` | Zoho **app password** (Zoho Mail -> Settings -> Security -> App Passwords). Not the account password. |
| Text | `SMTP_USER` | Defaults to `fyndig@zohomail.in`. |
| Text | `SMTP_HOST` | Defaults to `smtp.zoho.in`. |
| Text | `SMTP_PORT` | Defaults to `465`. |
| Text | `CONTACT_TO` | Where enquiries are sent. Defaults to `SMTP_USER`. |
| Secret | `RESEND_API_KEY` | Optional fallback if not sending through Zoho. |

**Variables only take effect on the next deployment.** After saving them, go to
Deployments, open the newest one, and choose **Retry deployment**.

With no mail variables set, the form still works: the enquiry is stored, and the
visitor is handed a pre-filled email to fyndig@zohomail.in as a fallback.

---

## The custom domain

`fyndig.in` is registered at BigRock and added to Cloudflare. To finish:

1. In BigRock (`manage.bigrock.in`), set the domain's nameservers to exactly:

   ```
   garrett.ns.cloudflare.com
   jessica.ns.cloudflare.com
   ```

   Remove any others. Cloudflare picks the change up within minutes to a few hours.

2. Once the zone shows **Active**, go to the Pages project -> **Custom domains**
   and add `fyndig.in` and `www.fyndig.in`. Cloudflare creates the DNS records
   and issues the certificate itself.

3. `fyndig.pages.dev` keeps working throughout and afterwards.

Two things the registrar requires, both easy to forget:

- **Complete the eKYC and email verification.** `.in` domains are suspended if
  this is skipped.
- **Turn off auto-renew on the free `fyndig.info`** that came bundled with the
  purchase. It renews at about Rs 2,499/year.

---

## Making changes

Push to `main`. Cloudflare builds and deploys automatically; there is nothing to
run by hand.

Content lives in `src/data` (`company.ts`, `services.ts`, `projects.ts`,
`jobs.ts`), deliberately separate from the components, so copy edits do not
require touching UI code.

---

## When something is wrong

**The build failed.** Read the log in Deployments. The build runs the real
TypeScript and ESLint checks - they are not disabled - so a type error stops the
deploy rather than shipping a broken page.

**`/admin` says it is switched off.** `ADMIN_PASSWORD` is not set, or was saved
as Text rather than Secret, or the deployment has not been retried since.

**Enquiries arrive but no email does.** The enquiry is safe either way. Check the
`emailed` column in D1: `0` means the send failed. Most likely `SMTP_PASS` is
missing, is the account password rather than an app password, or Cloudflare could
not open the outbound mail connection.

**The site shows old content.** Check the newest deployment actually succeeded,
then hard-reload.

---

## Known issue

`next` is pinned at 15.1.6, which npm flags with a published security advisory
(CVE-2025-66478). The exposure is small for a statically exported site, but it is
worth running `npm install next@latest` and pushing once someone can watch the
build.
