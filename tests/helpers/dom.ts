import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function visit(url: string): void {
	const parsed = new URL(url, window.location.origin);
	history.replaceState(
		{},
		"",
		`${parsed.pathname}${parsed.search}${parsed.hash}`,
	);
}

export function setBody(html: string): void {
	document.body.innerHTML = html;
}

export function loadFixture(name: string): string {
	return readFileSync(resolve(process.cwd(), "tests/fixtures", name), "utf8");
}

export function mockVideo(
	video: HTMLVideoElement,
	props: { duration: number; currentTime: number; paused: boolean },
): void {
	for (const [key, value] of Object.entries(props)) {
		Object.defineProperty(video, key, { value, configurable: true });
	}
}
