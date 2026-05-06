# Instagram API Setup

This runbook explains how to obtain the credentials required for the `InstagramFeed` component
and how to keep them working long-term.

The two environment variables you need are:

| Variable | Description |
|----------|-------------|
| `INSTAGRAM_ACCESS_TOKEN` | A long-lived Instagram User Access Token (~60-day TTL) |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | The numeric ID of the Instagram Business Account |

---

## Section 1: Prerequisites

### 1a. Instagram account type

The Instagram Graph API only works with **Business** or **Creator** accounts — not personal accounts.

To check or convert your account type (mobile app):

1. Open Instagram → tap your profile picture (bottom right).
2. Tap the three-line menu (top right) → **Settings and privacy**.
3. Tap **Account type and tools**.
4. If you see **Switch to Professional Account**, tap it and choose **Business**. The process is
   free and reversible — you can switch back to a personal account at any time.

### 1b. Link Instagram to a Facebook Page

The Graph API authenticates through Facebook. Your Instagram Business account must be connected
to a Facebook Page that you administer.

To link them:

1. On Facebook, go to your Page → **Settings** (top right) → **Linked accounts** (or
   **Instagram** in the left sidebar, depending on the Facebook UI version).
2. Click **Connect account** and log in with your Instagram credentials.
3. Confirm the connection.

If you don't have a Facebook Page for the business yet, create one at
https://www.facebook.com/pages/create — a basic Page with the business name is all that's needed.

---

## Section 2: Create a Meta for Developers App

1. Go to https://developers.facebook.com → click **My Apps** (top right) → **Create App**.
2. When prompted to select an app type, choose **Business**.
3. Fill in the app name (e.g., "Haynes Industrial Site") and your contact email, then click
   **Create app**.
4. On the app dashboard, find the **Add a product** section and click **Set up** next to
   **Instagram Graph API**.
5. In the left sidebar, navigate to **Instagram Graph API → Settings**.
6. Under **Instagram Business Accounts**, click **Add Instagram Business Account** and select
   the account connected to your Facebook Page.

Note your **App ID** and **App Secret** from the app's **Settings → Basic** page — you will
need both in the next section.

---

## Section 3: Generate a Long-Lived Access Token

### Step 1 — Get a short-lived User Access Token

1. Open the Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. In the top-right dropdown, select your app ("Haynes Industrial Site").
3. Click **Generate Access Token**.
4. In the permissions dialog, add the following scopes:
   - `instagram_basic`
   - `pages_show_list`
   - `pages_read_engagement`
   - `instagram_manage_insights`
5. Click **Generate Token** and approve the permissions when prompted.
6. Copy the short-lived token that appears — it expires in about 1 hour.

### Step 2 — Exchange for a long-lived token (~60 days)

```bash
curl "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&access_token=YOUR_SHORT_LIVED_TOKEN"
```

The response looks like:

```json
{
  "access_token": "EAAxxxxxxx...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

Copy the `access_token` value — this is your `INSTAGRAM_ACCESS_TOKEN`.

### Step 3 — Find your Instagram Business Account ID

```bash
curl "https://graph.instagram.com/v21.0/me?fields=id,username&access_token=YOUR_LONG_LIVED_TOKEN"
```

The response will include an `id` field. That numeric value is your
`INSTAGRAM_BUSINESS_ACCOUNT_ID`.

### Step 4 — Verify everything works

```bash
curl "https://graph.instagram.com/v21.0/YOUR_ACCOUNT_ID/media?fields=id,media_type,permalink,timestamp&limit=3&access_token=YOUR_TOKEN"
```

A successful response contains a `data` array of recent post objects. If you see that,
you're ready to deploy.

---

## Section 4: Store Credentials in Netlify

Never commit access tokens to the repository. Store them as environment variables in Netlify:

1. Open your site in the Netlify dashboard.
2. Go to **Site settings → Environment variables**.
3. Click **Add a variable** and add:
   - Key: `INSTAGRAM_ACCESS_TOKEN` — Value: the long-lived token from Section 3, Step 2
   - Key: `INSTAGRAM_BUSINESS_ACCOUNT_ID` — Value: the account ID from Section 3, Step 3
4. Save.
5. Trigger a new deploy (push a commit or use **Deploys → Trigger deploy**) so the build
   picks up the new variables.

For local development, copy `.env.example` to `.env` and fill in the same values.
`.env` is git-ignored and will not be committed.

---

## Section 5: Manual Token Refresh

Long-lived tokens expire after approximately 60 days. Refresh before expiry with:

```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN"
```

The response returns a new `access_token`. Update the Netlify environment variable
(Site settings → Environment variables → `INSTAGRAM_ACCESS_TOKEN` → Edit) and trigger a
redeploy.

**Recommendation:** Set a recurring calendar reminder every 50 days titled "Refresh Instagram
API token" so you never hit the 60-day expiry.

Alternatively, the `netlify/functions/refresh-instagram-token.ts` scheduled function in
this repo can automate this — see that file and `netlify/functions/README.md` for setup.

---

## Section 6: Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Component renders a fallback CTA instead of photos | Token missing or expired, or `INSTAGRAM_BUSINESS_ACCOUNT_ID` not set | Check build logs for `[astro-instagram-feed]` warning, then verify env vars in Netlify and refresh the token if needed |
| `OAuthException: Invalid OAuth access token` | Token has expired | Refresh the token (Section 5) and update the Netlify env var |
| `OAuthException: Invalid scope` | Short-lived token was generated without the required scopes | Re-run the Graph API Explorer with all four scopes listed in Section 3 Step 1, then exchange again for a long-lived token |
| `OAuthException: (#100) Instagram account not linked` | Instagram account disconnected from its Facebook Page | Re-link in Facebook Page settings (Section 1b), then re-generate the token |
| `Error validating access token: the user has not authorized application` | App permissions revoked | Repeat Section 3 to generate a new token |
| Token refreshed but component still shows fallback | Netlify env var updated but no redeploy triggered | Trigger a new deploy after updating the token |
