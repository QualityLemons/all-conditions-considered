# Publish on GitHub Pages

The public website is static and can stay on GitHub Pages. Its two submission forms require the separate API service in this project to be published and reachable. GitHub Pages cannot host that API. The GitHub workflow publishes only the website; it does not deploy the API.

The public website repository is [QualityLemons/all-conditions-considered](https://github.com/QualityLemons/all-conditions-considered). Keep submissions out of this public repository.

1. Push this repository, including its root package files and `lib/` workspace packages, to `QualityLemons/all-conditions-considered` on the `main` branch.
2. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
3. Run **Publish radio website to GitHub Pages** in the Actions tab (or push a change to `main`).
4. GitHub displays the published address in the completed deployment.

The workflow automatically handles both `username.github.io` and `username.github.io/repository/` addresses. It builds separate home, advertising and show-suggestion HTML entries, page-specific social metadata, canonical URLs and a sitemap using the actual Pages address. GitHub credentials must never be added to the website.

## Enable the private submissions inbox

Both forms create issues in the same private repository, `QualityLemons/acc-submissions`. Issue titles distinguish “Show suggestion” and “Advertising enquiry”; contact details are inside the private issue, not in its title. Contributors do not need GitHub accounts.

1. Publish this project's API service on Replit, retaining the connected GitHub integration. Publishing may incur hosting charges; review the publishing settings before proceeding.
2. Copy its actual published HTTPS address, append `/api/submissions`, and set this as the **SUBMISSIONS_API_URL** Actions repository variable in the website repository (Settings → Secrets and variables → Actions → Variables). This is a public endpoint URL, not a secret.
3. The API's **SUBMISSIONS_ALLOWED_ORIGINS** must include the website origin, without a path or trailing slash. `https://qualitylemons.github.io` is already configured. Add any custom domain or Replit published frontend origin, separated by commas.
4. Rerun the GitHub Pages workflow. Its build passes the URL to `VITE_SUBMISSIONS_API_URL`. Without this value, Pages builds deliberately disable submission and show an explanation rather than pretend to deliver.
5. Submit a clearly marked test through each published form and confirm both arrive in the private inbox.

The API's **SUBMISSIONS_GITHUB_REPOSITORY** is configured to the inbox above. It rechecks repository privacy before sending, refusing delivery if the repository is public or issues are disabled. GitHub authentication stays on the server through the Replit integration. Do not expose credentials, a public issues form, or a GitHub access token in browser code.

The Replit preview uses `/api/submissions` on its own origin. Do not use the temporary preview address as the GitHub Pages production endpoint.

## Safeguards and operational limits

- Server-side validation, request size limits, honeypot and origin restrictions; per-IP and hashed-email rate limits plus a global cap.
- No contact details or form bodies are written to application logs.
- Receipts are shown only after GitHub confirms delivery. Failed requests preserve the browser draft; do not close or reload the tab before retrying.
- Duplicate retry checks use an in-process cache and the latest 100 GitHub issues. These are not a permanent exactly-once guarantee; concurrent replicas/retries beyond that window can create duplicates.
- Rate limits are per process and reset on restarts. Before scaling to multiple API replicas or a large campaign, use a shared durable rate-limit/idempotency store and stronger bot protection.
- Restrict repository collaborators, review GitHub notification settings, and set a suitable retention/deletion policy. Private does not mean encrypted from GitHub or authorised administrators. Contributors are asked not to submit private medical details or identify others.

For a custom domain, configure it in GitHub Pages settings and configure its DNS as directed by GitHub. Rerun the workflow after a domain change.

## Build locally

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/all-conditions-considered run build
node artifacts/all-conditions-considered/scripts/static-pages.mjs
```

The output is `artifacts/all-conditions-considered/dist/public/`. For a repository subpath set `BASE_PATH=/repository-name/` for the build. Set `SITE_URL` to the final public address when running the static-pages script to include canonical URLs and the sitemap.

## Before launch

- Confirm the broadcast schedule and any listening/episode links before adding them.
- Publish and configure the API URL above before enabling forms on GitHub Pages. Downloading/copying an advertising draft does not send it.
- Confirm the proposed five minutes for introductions, links and closing: the supplied content and advertising timings otherwise total 52 minutes.
- Review final advertising placement, frequency, production terms, VAT treatment and editorial policy. The published starting price is £1,000/month excluding VAT; it is not a guarantee of particular spots or audience numbers.
