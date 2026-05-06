# Netlify Functions

## `refresh-instagram-token.ts`

A scheduled Netlify Function that automatically refreshes the Instagram long-lived access token
once per month, before its 60-day expiry window closes. It fetches a new token from the Instagram
Graph API and writes it back to the Netlify site's environment variables via the Netlify API.

### How it works

1. Reads `INSTAGRAM_ACCESS_TOKEN` from the current environment.
2. Calls `https://graph.instagram.com/refresh_access_token` to get a new token.
3. Updates the `INSTAGRAM_ACCESS_TOKEN` environment variable on the Netlify site using the
   Netlify API.

The `@monthly` schedule means the function fires on the 1st of each month. Because the token
has a 60-day TTL and the function runs every ~30 days, there is a comfortable safety margin —
the token will always be refreshed before it expires.

### Required environment variables

Set all three in **Netlify → Site settings → Environment variables**:

| Variable | Description |
|----------|-------------|
| `INSTAGRAM_ACCESS_TOKEN` | The current long-lived Instagram token (managed by this function after initial setup) |
| `NETLIFY_API_TOKEN` | A Netlify personal access token with write access to this site |
| `NETLIFY_SITE_ID` | The unique ID of this Netlify site |

### How to get a Netlify personal access token

1. Log in to Netlify and click your avatar (top right) → **User settings**.
2. Go to **OAuth → Personal access tokens**.
3. Click **New access token**, give it a descriptive name (e.g., "Instagram token refresher"),
   and click **Generate token**.
4. Copy the token immediately — it is only shown once.
5. Add it as `NETLIFY_API_TOKEN` in your site's environment variables.

### How to find your NETLIFY_SITE_ID

1. Open your site in the Netlify dashboard.
2. Go to **Site settings → General**.
3. Under **Site information**, copy the **Site ID** (a UUID like `abc12345-...`).
4. Add it as `NETLIFY_SITE_ID` in your site's environment variables.

### Testing manually

Using the Netlify CLI (install with `npm i -g netlify-cli`):

```bash
netlify functions:invoke refresh-instagram-token
```

Or trigger it via a POST request to the function URL in your Netlify site:

```
POST https://<your-site>.netlify.app/.netlify/functions/refresh-instagram-token
```

You can also test locally with:

```bash
netlify dev
# In a separate terminal:
curl -X POST http://localhost:8888/.netlify/functions/refresh-instagram-token
```

### Installing the dependency

The function requires `@netlify/functions`:

```bash
npm install --save-dev @netlify/functions
```
