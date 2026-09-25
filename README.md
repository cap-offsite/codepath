# CodePath 2026 Offsite — editable microsite

A static site built with [Eleventy](https://www.11ty.dev/), designed to be
hosted on Cloudflare Pages and edited by a non-technical client through a
built-in visual editor at `/admin` (powered by [Sveltia CMS](https://sveltiacms.app/)).

**New to this project? Start with [SETUP.md](./SETUP.md)** — it walks
through everything from creating the GitHub repo to handing the editor off
to your client, step by step.

## How it's organized

```
src/
  _data/cms.yaml       <- ALL the page's content lives here (also what /admin edits)
  _includes/base.njk   <- the page shell: header, nav, footer
  _includes/sections/  <- one template per section "type" (hero, faq, agenda, ...)
  css/style.css         <- all styling
  images/                <- photos used on the page
admin/
  index.html            <- loads the visual editor
  config.yml            <- tells the editor what fields to show (edit repo/backend info here)
```

The page is built from an ordered list of **sections** in
`src/_data/cms.yaml` (`hero`, `quickFacts`, `gallery`, `cardPair`, `agenda`,
`content`, `faq`). Add, remove, or reorder entries in that list — either by
editing the YAML directly or through `/admin` — and the page changes to
match. This is what gives the client the ability to restructure the page,
not just edit text in fixed spots.

## Local development

```bash
npm install
npm start       # http://localhost:8080, rebuilds on save
npm run build   # outputs the production site to _site/
```

## Deploying

See [SETUP.md](./SETUP.md) for the full walkthrough. Short version: push
this repo to GitHub, connect it to Cloudflare Pages (build command
`npm run build`, output directory `_site`), then follow Phase 3 in
SETUP.md to turn on the `/admin` editor for your client.
