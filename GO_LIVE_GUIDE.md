# Going Live on sravankumar.online — Simple Step-by-Step Guide

You bought the domain **sravankumar.online** from Hostinger. That's just the *name* — like reserving a phone number. You still need a **host** (a computer that actually stores your website files and serves them to visitors, running 24/7). Right now that host is Vercel. We're moving off Vercel.

This guide explains everything in plain language, tells you what each term means, and walks you through the exact steps. Read "Decision 1" below first — that's the only real choice you need to make. Everything after it just follows from that choice.

---

## Quick glossary (so nothing below is confusing)

- **Domain** = the name people type (`sravankumar.online`). You already own this.
- **Host / Hosting** = the computer that stores your site and serves it to visitors. You don't have this yet (Vercel was doing this for free until now).
- **DNS** = the "phonebook" that tells the internet which host your domain points to. You change this once, in Hostinger's dashboard.
- **Build** = turning your project's source code into the actual files a browser can load (HTML/CSS/JS). Done automatically by whichever host you pick.
- **Repo / GitHub** = your project's code is already stored at `github.com/sravankumar0103/SK-Portfolio`. Good hosts can watch this and auto-update your live site every time code changes — no manual uploading.

---

## Decision 1: Where do you want to host the site? ✅ DECIDED — Cloudflare Pages

**What it is:** A free hosting service (like Vercel, but not Vercel) made by Cloudflare, a well-known internet infrastructure company. Connects directly to your GitHub repo — every push auto-rebuilds and updates your live site. Free forever for a personal site like this.

---

## The full process, step by step

### Step 1 — One code fix needed first ✅ DONE
Your project had a Vercel-only settings file (`vercel.json`) that makes page links like `/projects/something` work correctly instead of erroring. I've already added the Cloudflare Pages equivalent: a file called `_redirects` in `artifacts/portfolio/public/`. It's confirmed working in a test build. Nothing for you to do here. (`vercel.json` itself is left untouched for now — removed only in Step 6, after your new site is confirmed live.)

### Step 2 — Push your code changes to GitHub
Everything I've changed so far (favicon fix, scroll fix, mobile menu stuff, the `_redirects` file, etc.) only exists on this computer right now — it hasn't been sent to GitHub yet. Cloudflare Pages builds your site **from GitHub**, so it needs to be pushed there first, and every time after this, whenever the code changes.

**What "push" means:** saving a snapshot of your changes (called a "commit") and uploading that snapshot to GitHub (called a "push"). Three commands, run in order, from the project folder (`D:\Project\SK-Portfolio`):

```
git add -A
git commit -m "Harden portfolio for self-hosting, fix scroll smoothness"
git push
```

What each line does:
- `git add -A` → selects all the changed files to be included in the next snapshot.
- `git commit -m "..."` → saves that snapshot locally, with a short note describing what changed (the text in quotes).
- `git push` → uploads the snapshot to GitHub, where Cloudflare Pages will see it.

You run these yourself whenever you're ready (I won't run them for you). After `git push` finishes, check `github.com/sravankumar0103/SK-Portfolio` in your browser — you should see the new changes there with today's date.

From this point on, this is the only thing you ever need to do to update your live site once Cloudflare is connected: make changes → run these 3 commands → Cloudflare rebuilds automatically within a minute or two.

### Step 3 — Set up Cloudflare Pages
1. Go to **dash.cloudflare.com** and create a free account (just an email + password).
2. In the left sidebar, find **Workers & Pages** → click **Create** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access GitHub, then pick the `SK-Portfolio` repo.
4. On the build settings screen, enter exactly these values:
   - **Framework preset:** `None`
   - **Build command:** `pnpm install --frozen-lockfile && pnpm --filter portfolio run build`
   - **Build output directory:** `artifacts/portfolio/dist`
   - **Root directory:** leave as `/` (default — do not change)
5. Click **Save and Deploy**. First build takes a few minutes. When done, Cloudflare gives you a free test address like `sk-portfolio.pages.dev` — open it and confirm the site loads before moving on.

### Step 4 — One setting the site needs to work (the contact form)
In the same Cloudflare Pages project: go to **Settings → Environment variables → Add variable**.
- **Name:** `VITE_WEB3FORMS_KEY`
- **Value:** the key already saved in `artifacts/portfolio/.env.example` in your project (open that file, copy the value after the `=`).
After adding it, click **Retry deployment** so the new build picks it up. Without this, the contact form won't send emails.

### Step 5 — Point your domain at the new host
This is done inside Hostinger's dashboard (where you bought the domain) — a settings page called "DNS" or "Nameservers." I'll give you the exact values to enter once Step 3 is done (Cloudflare gives us these values). Takes effect within a few minutes to a few hours (sometimes up to 24h, this is normal and just how the internet updates).

### Step 6 — Test everything
Once the domain points to the new host, we check:
- Home page loads
- Clicking into a project page works
- Refreshing a project page directly (typing the URL) works, doesn't error
- Contact form sends successfully
- Site looks right on your phone

### Step 7 — Turn off Vercel
Only after Step 6 passes, we remove the project from your Vercel account and delete the leftover `vercel.json` settings file from the code. This is the last step, done last on purpose — your current site keeps working on Vercel right up until the new one is confirmed working.

---

## What I need from you right now
Just one thing: **reply "Option A" or "Option B"** (or ask me anything you're unsure about first). Once you pick, I'll prepare Step 1's code fix and give you the exact values for Step 2.
