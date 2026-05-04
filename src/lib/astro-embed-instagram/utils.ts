// Vendored from @astro-community/astro-embed-utils v0.2.0
// Source: https://github.com/delucis/astro-embed/tree/main/packages/astro-embed-utils

class LRU<K, V> extends Map<K, V> {
	constructor(private readonly maxSize: number) {
		super();
	}

	override get(key: K): V | undefined {
		const value = super.get(key);
		if (value) this.#touch(key, value);
		return value;
	}

	override set(key: K, value: V): this {
		this.#touch(key, value);
		if (this.size > this.maxSize) this.delete(this.keys().next().value!);
		return this;
	}

	#touch(key: K, value: V): void {
		this.delete(key);
		super.set(key, value);
	}
}

const formatError = (...lines: string[]) => lines.join('\n         ');

export const safeGet = makeSafeGetter<Record<string, any>>((res) => res.json());

export function makeSafeGetter<T>(
	handleResponse: (res: Response) => T | Promise<T>,
	{ cacheSize = 1000 }: { cacheSize?: number } = {}
) {
	const cache = new LRU<string, T>(cacheSize);
	return async function safeGet(url: string): Promise<T | undefined> {
		try {
			const cached = cache.get(url);
			if (cached) return cached;
			const response = await fetch(url);
			if (!response.ok)
				throw new Error(
					formatError(
						`Failed to fetch ${url}`,
						`Error ${response.status}: ${response.statusText}`
					)
				);
			const result = await handleResponse(response);
			cache.set(url, result);
			return result;
		} catch (e: any) {
			console.error(formatError(`[error]  astro-embed`, e?.message ?? e));
			return undefined;
		}
	};
}
