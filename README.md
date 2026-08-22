# Jacobus Nagel — Online CV

A responsive, static CV website built on the Jaxtech visual language: teal, coral
and amber on near-black, Archivo Black display type, and hard unblurred offset
shadows instead of soft glow.

Beyond the usual CV sections it carries a few things worth knowing about:

- **Receipts.** A section of checkable evidence — live systems, public source
  repositories, the YouTube channel — instead of a wall of adjectives.
- **Evergreen figures.** Anything that counts elapsed time ("12 years in
  automotive") is computed in the browser from a date in the markup, so it
  cannot quietly go stale. The markup keeps a correct static value for
  visitors without JavaScript.
- **A print stylesheet.** `Save as PDF` in the nav, or an ordinary Ctrl+P,
  produces an ink-friendly black-on-white document with external links printed
  alongside their addresses and collapsed sections expanded first.
- **`Person` structured data** and Open Graph tags for search and link previews.
- **Click-to-play video.** The YouTube player is only created once someone
  clicks, so nothing third-party loads on first paint.

## Project structure

```text
public/
├── index.html
├── styles.css
└── script.js
wrangler.jsonc
```

## Preview locally

From the repository root:

```bash
python3 -m http.server 4173 --directory public
```

Open <http://localhost:4173> and stop the server with `Ctrl+C`.

## Edit the website

- **CV content:** `public/index.html`
- **Design tokens, layout, responsive rules and the print stylesheet:** `public/styles.css`
- **Evergreen figures, reveal animation, navigation, video and print behaviour:** `public/script.js`
- **Cloudflare Workers configuration:** `wrangler.jsonc`

To change a computed figure, edit the `data-years-since="YYYY-MM"` attribute on
the element rather than the number itself — the number in the markup is only the
no-JavaScript fallback.

Before publishing, review all public personal information—especially the email address and phone number. References and their contact details are intentionally excluded.

## Validate changes

```bash
node --check public/script.js
python3 -m http.server 4173 --directory public
curl -f http://localhost:4173/
```

Then inspect the page on desktop, tablet and mobile widths, and print-preview it
(Ctrl+P) to check the paper version.

## Deploy to Cloudflare Workers

The configuration uses Cloudflare static assets and is designed to stay within the existing free workflow. Do not deploy until the Cloudflare account and desired public URL have been confirmed.

1. Install or invoke Wrangler:

   ```bash
   npx wrangler --version
   ```

2. Authenticate if needed:

   ```bash
   npx wrangler login
   ```

3. Preview locally with Wrangler:

   ```bash
   npx wrangler dev
   ```

4. Deploy after explicit approval:

   ```bash
   npx wrangler deploy
   ```

The Worker name in `wrangler.jsonc` is `jacobus-nagel-cv`. Cloudflare will show the final `workers.dev` URL after deployment.

## Optional custom domain

After deployment, add a custom domain or route in the Cloudflare dashboard under the Worker’s **Settings → Domains & Routes**. Confirm that the domain is already owned and that adding it introduces no paid plan or service.

## Privacy notes

The website publishes Jacobus’s own professional contact details, but deliberately omits:

- residential street address;
- identity or licence numbers;
- vehicle ownership details;
- reference names and telephone numbers.

## Technology

Plain HTML, CSS and JavaScript—no framework, build step, database or paid dependency.
