# Jacobus Nagel — Online CV

A responsive, static CV website inspired by the dark glassmorphism visual language of Jaxtech.

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
- **Colours, layout and responsive design:** `public/styles.css`
- **Animations and mobile navigation:** `public/script.js`
- **Cloudflare Workers configuration:** `wrangler.jsonc`

Before publishing, review all public personal information—especially the email address and phone number. References and their contact details are intentionally excluded.

## Validate changes

```bash
node --check public/script.js
python3 -m http.server 4173 --directory public
curl -f http://localhost:4173/
```

Then inspect the page on both desktop and mobile widths.

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
