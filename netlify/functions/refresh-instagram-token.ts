// Requires: npm install --save-dev @netlify/functions
// Schedule: runs monthly to refresh the Instagram long-lived access token before it expires (60-day TTL).
// Setup: set NETLIFY_API_TOKEN (a Netlify personal access token) and NETLIFY_SITE_ID in environment variables.

import { schedule } from '@netlify/functions';

const handler = schedule('@monthly', async () => {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const netlifyApiToken = process.env.NETLIFY_API_TOKEN;
  const netlifyApiSiteId = process.env.NETLIFY_SITE_ID;

  if (!currentToken || !netlifyApiToken || !netlifyApiSiteId) {
    console.error('[refresh-instagram-token] Missing required env vars: INSTAGRAM_ACCESS_TOKEN, NETLIFY_API_TOKEN, or NETLIFY_SITE_ID');
    return { statusCode: 500 };
  }

  // Refresh the Instagram token
  const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
  const refreshRes = await fetch(refreshUrl);

  if (!refreshRes.ok) {
    const body = await refreshRes.text();
    console.error(`[refresh-instagram-token] Token refresh failed (${refreshRes.status}): ${body}`);
    return { statusCode: 500 };
  }

  const { access_token: newToken } = await refreshRes.json() as { access_token: string };

  if (!newToken) {
    console.error('[refresh-instagram-token] Refresh response missing access_token field');
    return { statusCode: 500 };
  }

  // Update the env var in Netlify via the Netlify API
  const netlifyRes = await fetch(
    `https://api.netlify.com/api/v1/sites/${netlifyApiSiteId}/env/INSTAGRAM_ACCESS_TOKEN`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${netlifyApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: newToken }),
    }
  );

  if (!netlifyRes.ok) {
    const body = await netlifyRes.text();
    console.error(`[refresh-instagram-token] Failed to update Netlify env var (${netlifyRes.status}): ${body}`);
    return { statusCode: 500 };
  }

  console.log('[refresh-instagram-token] Token refreshed and Netlify env var updated successfully');
  return { statusCode: 200 };
});

export { handler };
