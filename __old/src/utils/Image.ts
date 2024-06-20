export type ImageProps = { src?: string | null; w?: number; h?: number; q?: number };

export function createImageUrl({ src, w = 64, h = 64, q = 100 }: ImageProps) {
	if (!src) return undefined;
	return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&h=${h}&q=${q}`;
}
