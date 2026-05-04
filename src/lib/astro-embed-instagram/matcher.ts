// Vendored from github.com/hfournier/astro-embed#hfdev-instagram

const urlPattern =
	/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/;

/**
 * Extract a match from an Instagram URL if it matches a supported pattern.
 */
export default function matcher(url: string): string | undefined {
	const match = url.match(urlPattern);
	return match?.[0];
}
