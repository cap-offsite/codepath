# Setting this site up on Cloudflare — step by step

This project turns your CodePath Offsite page into a site that:

- lives on Cloudflare Pages (free hosting, fast, HTTPS built in)
- rebuilds itself automatically whenever the content changes
- gives your client a simple visual editor at `yoursite.pages.dev/admin` where
  they can edit text, swap photos, and add/remove/reorder FAQ questions,
  agenda days, and whole sections — no code, no HTML

You (Chelsea) do the one-time setup below. Once it's done, your client only
ever needs the last section, "What your client does."

Budget about 30–45 minutes for the one-time setup. None of it costs money —
GitHub and Cloudflare are both free for this.

---

## Before you start: accounts you'll need

1. A **GitHub account** (free) — [github.com/signup](https://github.com/signup)
   if you don't have one. This is where the site's code and content live.
2. A **Cloudflare account** (free) — [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
   This is what actually hosts and serves the site.

You'll do all of this yourself first, then invite your client in at the end
so they only ever see the simple editor, never GitHub or Cloudflare.

---

## Phase 1 — Put the code on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository.
   - Name it something like `codepath-2026-offsite`.
   - Set it to **Private** (recommended, since it has your client's internal
     event details in it) or Public — either works.
   - Don't check "Add a README" — we already have files to upload.
2. On the next page, GitHub shows you options to push an existing project.
   The easiest path if you're not comfortable with git commands: click
   **"uploading an existing file"** on that page and drag in every file and
   folder from this project (keep the folder structure — `src/`, `admin/`,
   `.eleventy.js`, `package.json`, etc.) Commit directly to the `main` branch.
   - If you *are* comfortable with a terminal, the normal git commands work
     too: `git init`, `git add .`, `git commit -m "Initial site"`,
     `git branch -M main`, `git remote add origin <your repo URL>`,
     `git push -u origin main`.
3. Confirm the files show up in GitHub, including the `src/images` folder
   with all 9 photos.

---

## Phase 2 — Connect Cloudflare Pages to that repo

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, go to **Workers & Pages** → click **Create** →
   choose the **Pages** tab → **Connect to Git**.
3. Authorize Cloudflare to access your GitHub account if asked, then select
   the repository you just created.
4. On the build settings screen, set:
   - **Framework preset:** Eleventy (if it's not offered, choose "None" and
     fill in the fields below manually)
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`
5. Click **Save and Deploy**. The first build takes a minute or two. When it
   finishes, Cloudflare gives you a live URL like
   `codepath-2026-offsite.pages.dev` — open it and confirm the site looks
   right.

From now on, any change pushed to the `main` branch on GitHub (whether you
push it, or your client saves an edit through the `/admin` editor) triggers
a fresh build and goes live automatically within about a minute.

---

## Phase 3 — Turn on the visual editor for your client

The editor (a tool called **Sveltia CMS**) is already built into this
project at the `/admin` URL. It needs one more piece to work: a way for it
to securely check that whoever's logging in is allowed to edit — that's
done by having them sign in with GitHub. Setting that up takes two steps.

### 3a. Register a GitHub OAuth app

1. Go to [github.com/settings/applications/new](https://github.com/settings/applications/new)
   (while logged into *your* GitHub account, the one that owns the repo).
2. Fill in:
   - **Application name:** anything, e.g. `CodePath Offsite Editor`
   - **Homepage URL:** your Cloudflare Pages URL, e.g.
     `https://codepath-2026-offsite.pages.dev`
   - **Authorization callback URL:** you'll come back and fill this in after
     step 3b below — for now you can leave a placeholder like
     `https://example.com/callback` and edit it in a minute.
3. Click **Register application**. On the page that appears, copy the
   **Client ID**, then click **Generate a new client secret** and copy that
   too. Keep both somewhere safe — you'll paste them into Cloudflare next.

### 3b. Deploy the small "sign-in checker" worker

This is a tiny, free Cloudflare Worker maintained by the Sveltia CMS project
that handles the GitHub sign-in — you don't need to write any code for it.

1. Open [github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   and use the **"Deploy to Cloudflare Workers"** button on that page. It
   will walk you through forking the project to your GitHub and deploying it
   to your Cloudflare account.
2. Once it's deployed, go to the [Cloudflare dashboard](https://dash.cloudflare.com/)
   → **Workers & Pages** → open the worker it just created (something like
   `sveltia-cms-auth`) → **Settings** → **Variables**.
3. Add these variables (click "Encrypt" for the secret one):
   - `GITHUB_CLIENT_ID` = the Client ID you copied in step 3a
   - `GITHUB_CLIENT_SECRET` = the Client Secret you copied in step 3a
     (encrypt this one)
4. Save. Note the worker's URL, shown at the top of its page — it looks like
   `https://sveltia-cms-auth.<your-subdomain>.workers.dev`.
5. Go back to your GitHub OAuth app
   ([github.com/settings/developers](https://github.com/settings/developers) →
   your app) and set the **Authorization callback URL** to
   `<that worker URL>/callback` — e.g.
   `https://sveltia-cms-auth.your-subdomain.workers.dev/callback`. Save.

### 3c. Point the editor at your repo and worker

1. In GitHub, open `admin/config.yml` in your repo and click the pencil
   (edit) icon.
2. Update these two lines near the top:
   ```yaml
   backend:
     name: github
     repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME   # e.g. chelsea-offsite/codepath-2026-offsite
     branch: main
     base_url: https://YOUR-AUTH-WORKER.YOUR-SUBDOMAIN.workers.dev   # the worker URL from step 3b
   ```
3. Commit the change directly to `main`. Cloudflare Pages will rebuild
   automatically (takes about a minute).
4. Visit `https://your-site.pages.dev/admin`, click **Log in with GitHub**,
   and approve the app. You should land in the visual editor and see "Site
   content" with all the page sections listed. Try editing something small
   (like a Quick Fact) and hit **Save/Publish** — then reload your live site
   to confirm the change appears.

If step 4 doesn't work, the most common culprits are: the callback URL in
3a doesn't exactly match `<worker URL>/callback`, or `repo:` in
`admin/config.yml` doesn't exactly match `username/repo-name`.

---

## Phase 4 — Give your client access

Your client needs a GitHub account of their own (free) so they can log in
to `/admin` — they never need to touch GitHub's actual website, just sign in
through it once.

1. Ask your client for the username or email of their GitHub account (or
   have them create one at [github.com/signup](https://github.com/signup) —
   takes two minutes).
2. In your repo on GitHub, go to **Settings** → **Collaborators** → **Add
   people**, and add them with **Write** access.
3. Send them the editor link: `https://your-site.pages.dev/admin` — and the
   short instructions in the next section.

They'll get an email invite from GitHub to accept first; after that,
`/admin` is the only link they ever need.

---

## What your client does (forward this part to them)

1. Go to `https://your-site.pages.dev/admin`
2. Click **Log in with GitHub** (accept the GitHub invite email first, if
   you haven't already)
3. You'll see **Site content** with the page broken into sections — Hero,
   Quick Facts, Gallery, FAQ, and so on
4. Click any section to expand and edit it. A few things you can do:
   - Edit any text field directly
   - Click **+ Add** at the bottom of a list (like FAQ questions or agenda
     days) to add a new one
   - Drag the handle on any list item to reorder it, or click the trash icon
     to remove it
   - Click **+ Add** under "Page sections" to insert a whole new section
     (pick a type, like another FAQ block or text block), or remove one you
     don't need
5. Click **Save** (or **Publish**, depending on the button shown) when
   you're done with a section
6. The live site updates automatically within about a minute — no need to
   tell anyone or wait for a developer

A couple of things to know:

- The **photo gallery** section looks best with exactly 3 photos.
- The **Text block** sections use simple formatting: a blank line starts a
  new paragraph, `**text**` makes it bold, and `- ` at the start of a line
  makes a bullet. The editor's toolbar buttons do this for you automatically
  — you don't need to memorize the symbols.
- Changes are instant and don't need approval unless Chelsea turns on
  approval mode (see the `publish_mode` note in `admin/config.yml`).

---

## Using a custom domain instead of `*.pages.dev`

If you'd rather the site live at something like `offsite.codepath.org`:

1. In Cloudflare, open your Pages project → **Custom domains** → **Set up a
   domain**.
2. Enter the domain/subdomain and follow the on-screen DNS instructions.
   If the domain's DNS is already on Cloudflare, this is usually one click;
   if it lives elsewhere, you'll add a CNAME record with your other DNS
   provider.
3. Update the OAuth app's **Homepage URL** (step 3a) to the new domain — the
   callback URL (pointing at the worker) doesn't need to change.

---

## If something breaks

- **Site shows old content after an edit:** check the **Deployments** tab
  in your Cloudflare Pages project — a build may have failed. Click into it
  to see the error.
- **`/admin` shows a blank page or login fails:** double check the callback
  URL on the GitHub OAuth app and the `repo:`/`base_url:` values in
  `admin/config.yml` match exactly (case-sensitive).
- **A client can't log in:** confirm they accepted the GitHub collaborator
  invite (check your repo's Settings → Collaborators — it should show
  "Active," not "Pending").

## Editing locally instead (optional, for Chelsea)

If you want to preview changes on your own computer before they go live:

```bash
npm install
npm start        # serves the site at http://localhost:8080 and rebuilds on save
```

```bash
npm run build     # builds the production site into _site/
```

You can also just edit `src/_data/cms.yaml` directly by hand in any text
editor — it's the same file the visual editor writes to.
