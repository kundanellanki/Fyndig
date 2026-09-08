# Deploying fyndig

You have no domain yet, so this deploys to free HTTPS addresses you get from the
host — `https://fyndig.fly.dev` and `https://fyndig-api.fly.dev`. Everything
works on those: real HTTPS, real forms, real email. When you buy the domain, you
point it at what is already running. Nothing here has to be redone.

Enquiries and job applications land in **fyndig@zohomail.in**.

**Roughly 40 minutes end to end.** Most of it is waiting for builds.

---

## What you are deploying

Two separate services:

| | What it is | Where it goes |
|---|---|---|
| **Website** | Next.js. Stateless — it holds nothing. | `https://fyndig.fly.dev` |
| **API** | Node + SQLite. Holds enquiries, applications, CVs. | `https://fyndig-api.fly.dev` |

They are separate because they need different things. The site is disposable and
can be rebuilt from source at any time. The API has your data on a disk that has
to survive every deploy, forever. Keeping them apart means you can redeploy the
website fearlessly.

## Why Fly.io

The API rules out most of the easy options. It writes a SQLite file and stores
uploaded CVs on disk, so it needs a **real disk that persists** and a process
that **stays running** to send queued mail. That eliminates every serverless
platform, and eliminates the free tiers that wipe storage between deploys.

Fly.io gives you a persistent volume, a machine in **Mumbai** (good latency for
Tirupati), free HTTPS on a `.fly.dev` address, and no problem with commercial
use. It costs about **$4–5/month (₹350–450)** for both services together. A
credit card is required even at that size.

> **On Vercel:** it is the smoothest host for Next.js, but its free Hobby plan is
> **non-commercial only** — a company site is exactly what that clause excludes,
> and accounts do get paused for it. Vercel Pro is $20/month per seat. If you
> want Vercel anyway, use Pro for the site and still put the API on Fly; the
> steps below for the API are unchanged.

---

## Before you start

Three things, in this order.

### 1. A Zoho app password

The API sends mail as `fyndig@zohomail.in`. Zoho will not accept your normal
account password from an application.

1. Sign in to Zoho Mail → **Settings → Security → App Passwords**
2. Generate one, name it `fyndig API`
3. Copy it somewhere safe — Zoho shows it once

If you skip this, everything still works: submissions are stored and the
notifications wait in a queue. You just will not get the email until you add it.
Nothing is lost in the meantime.

### 2. A Fly.io account

<https://fly.io/app/sign-up> — sign up and add a card.

### 3. The `fly` command

```bash
# macOS / Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

Then:

```bash
fly auth login
fly version        # confirms it is installed and you are signed in
```

Also make sure you have the two project folders (`fyndig-backend` and
`fyndig-website`) unzipped somewhere you can `cd` into.

---

## Part 1 — the API

Do this one first. The website reads from it at build time, so it should exist
before the site is built.

### 1.1 Create the app

```bash
cd fyndig-backend

fly launch --no-deploy --copy-config --name fyndig-api --region bom
```

`--copy-config` makes it use the `fly.toml` already in the folder rather than
guessing. If the name `fyndig-api` is taken, pick another — just remember it,
because the website needs the matching URL.

Answer **no** to any offer to set up a Postgres or Redis database. The API has
its own storage and needs neither.

### 1.2 Create the disk

```bash
fly volumes create fyndig_data --region bom --size 1 --yes
```

**This is the step that matters most.** This 1 GB volume holds your database and
every CV anyone uploads. Without it, a deploy wipes your data. 1 GB is thousands
of enquiries and hundreds of CVs; you can grow it later with
`fly volumes extend`.

### 1.3 Set the secrets

```bash
# A signing key for admin sessions. Generate a fresh one — do not reuse this line's output from anywhere else.
fly secrets set SESSION_SECRET="$(openssl rand -base64 48 | tr -d '\n')"

# The Zoho app password from step 1.
fly secrets set SMTP_PASS="paste-the-zoho-app-password-here"

# Which website origins the browser may call this API from.
# Exact scheme and host, no trailing slash.
fly secrets set CORS_ORIGINS="https://fyndig.fly.dev"
```

On Windows without `openssl`, generate the secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Everything non-secret — the SMTP host, the mail addresses, the storage paths —
is already in `fly.toml`. Secrets are stored encrypted and never appear in the
image or in your source.

### 1.4 Deploy

```bash
fly deploy
```

The database schema is created automatically on first boot. Then check it:

```bash
curl https://fyndig-api.fly.dev/api/health
```

You want `"status":"ok"`. If you get `"mail":"not-configured"`, the Zoho password
did not take — everything else still works, so carry on and fix it later.

### 1.5 Load the projects and create your admin login

```bash
# The three current projects
fly ssh console -C "node src/cli/seed.js"

# Your admin account — this one is interactive
fly ssh console
```

Inside that shell:

```bash
node src/cli/create-admin.js --email you@fyndig.in --name "Dileep"
# it prompts for a password — use a strong one and save it to a password manager
exit
```

Now open **<https://fyndig-api.fly.dev/admin>** and sign in. This is where
enquiries, applications and CVs arrive, and where you post jobs and edit
projects without redeploying anything.

---

## Part 2 — the website

### 2.1 Create the app

```bash
cd ../fyndig-website

fly launch --no-deploy --copy-config --name fyndig --region bom
```

No volume this time — the site stores nothing.

### 2.2 Deploy

```bash
fly deploy \
  --build-arg NEXT_PUBLIC_API_URL=https://fyndig-api.fly.dev \
  --build-arg NEXT_PUBLIC_SITE_URL=https://fyndig.fly.dev
```

**Those are `--build-arg`, not secrets, and that is not a detail you can ignore.**
Next.js bakes them into the browser bundle when it builds. Setting them with
`fly secrets set` does nothing at all — the site would build with no API
configured and quietly fall back to its static content, which looks like it
worked. Pass them on **every** deploy.

The first build takes a few minutes. Then:

```bash
open https://fyndig.fly.dev
```

---

## Part 3 — check it actually works

Not "the page loads" — check the parts that involve both services.

1. **The site is live.** Scroll it. The forest background must stay perfectly
   still while the content moves over it.
2. **Projects come from the API.** In `/admin/projects`, change a project's
   description. Wait a minute, reload the site. If it changed, the site is
   reading from the API rather than its fallback data.
3. **The contact form.** Submit a real enquiry from the live site. It must appear
   in `/admin/enquiries` within seconds.
4. **The email arrives** at fyndig@zohomail.in. If it does not, open
   `/admin/mail` — a queued message means SMTP is not configured yet, and a
   failed one shows Zoho's actual error.
5. **Post a job** in `/admin/jobs`. It should appear in the Careers section on
   the live site, with an application form under it.
6. **Apply to it** from the live site with a real PDF. It must appear in
   `/admin/applications` with the CV downloadable.

If step 3 fails but `/api/health` is fine, it is almost always CORS. Check:

```bash
curl -i -H "Origin: https://fyndig.fly.dev" https://fyndig-api.fly.dev/api/health | grep -i access-control
```

No `access-control-allow-origin` line means `CORS_ORIGINS` does not match. It has
to be exact — `https`, the right host, no trailing slash.

---

## Redeploying later

**Changed the website** (copy, styling, a component):

```bash
cd fyndig-website
fly deploy \
  --build-arg NEXT_PUBLIC_API_URL=https://fyndig-api.fly.dev \
  --build-arg NEXT_PUBLIC_SITE_URL=https://fyndig.fly.dev
```

**Changed the API:**

```bash
cd fyndig-backend
fly deploy
```

**Changed a job, a project, or want to read an enquiry:** nothing to deploy. Use
`/admin`. That is what it is for.

Useful commands:

```bash
fly logs                    # live logs for the app in the current folder
fly status                  # is it running, which machines
fly ssh console             # a shell inside the running machine
fly secrets list            # names only — values are never shown again
```

---

## Backups

The volume is not a backup. Fly snapshots volumes daily and keeps them 5 days by
default, which covers a disk failure but not "I deleted something last week".

Take your own copy periodically:

```bash
cd fyndig-backend
fly ssh console -C "node src/cli/backup.js --out /data/backups --keep 30"
fly sftp get /data/backups/<the-newest-file>.db ./fyndig-backup.db
```

`fly sftp ls /data/backups` lists what is there. Do this before any risky change,
and keep a copy off the server. **Also copy `/data/uploads`** — the database rows
point at CV files that live there, and a database without them is half a record.

---

## When you get the domain

Buy it wherever you like — for a `.com`, Cloudflare and Namecheap are both fine
and cheap. Then:

```bash
# 1. Tell Fly about the hostnames (do this from each app's folder)
cd fyndig-website && fly certs add fyndig.com && fly certs add www.fyndig.com
cd ../fyndig-backend && fly certs add api.fyndig.com

# `fly certs show fyndig.com` prints the exact DNS records to add at your registrar.
# Add them, wait for the certificate to go valid (usually minutes).

# 2. Let the API accept the new origins
fly secrets set CORS_ORIGINS="https://fyndig.com,https://www.fyndig.com,https://fyndig.fly.dev"

# 3. Rebuild the site against the new addresses
cd ../fyndig-website
fly deploy \
  --build-arg NEXT_PUBLIC_API_URL=https://api.fyndig.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://fyndig.com
```

That is the whole migration. No code changes — the domain was never hardcoded
anywhere. Keep the `.fly.dev` origin in `CORS_ORIGINS` during the switch so
nothing breaks while DNS propagates; drop it once you are settled.

While you are there: set up `fyndig@fyndig.com` in Zoho and update `SMTP_USER`,
`MAIL_FROM` and `MAIL_TO` in `fly.toml`, plus the email in
`src/data/company.ts`.

---

## If something goes wrong

**The build fails on `npm ci`.** There is no `package-lock.json` in the folder.
Run `npm install` locally once to generate it, then deploy again — the Dockerfile
falls back to `npm install`, but a lockfile makes builds reproducible.

**`fly deploy` says the volume is in use / two machines want one volume.** The
API must run as a single machine — SQLite has one writer. `fly scale count 1`.

**The site shows old projects after you edited them in admin.** Pages are cached
for 60 seconds. Wait, then hard-reload. If it never updates, the site was built
without `NEXT_PUBLIC_API_URL` — redeploy with the build args.

**CV uploads fail on large files.** The limit is 8 MB, set by
`UPLOAD_LIMIT_BYTES`. Raise it in `fly.toml` and redeploy if you need more.

**Everyone is signed out of admin after a deploy.** `SESSION_SECRET` changed.
Set it once and leave it alone.

**The machine keeps restarting.** `fly logs`. A config problem prints `ECONFIG`
and names every bad variable at once.

---

## What this costs

| | |
|---|---|
| API machine (shared-cpu-1x, 512 MB, always on) | ~$2/month |
| Website machine (suspends when idle) | ~$1–2/month |
| 1 GB volume | ~$0.15/month |
| HTTPS certificates | free |
| **Total** | **about $4–5/month (₹350–450)** |

To trim it: set `min_machines_running = 0` in the website's `fly.toml` and it
costs nothing while nobody is visiting, at the price of a slow first request
after an idle period.

---

Sources for the pricing and plan terms quoted above:
[Fly.io pricing](https://fly.io/docs/about/pricing/) ·
[Vercel Hobby commercial clause](https://justinmckelvey.com/blog/is-vercel-free)
