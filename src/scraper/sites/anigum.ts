import type { AnimeSite } from "../../shared/types";
import { getStandardVideoStats } from "../parser";

const WATCH_PATH = /^\/watch\/?$/i;
const EPISODE_NUMBER = /^\d+(?:\.\d+)?$/;

function isWatchPage(): boolean {
	return (
		WATCH_PATH.test(window.location.pathname) &&
		new URLSearchParams(window.location.search).has("id")
	);
}

function getEpisode(): string | null {
	const episode =
		new URLSearchParams(window.location.search).get("ep")?.trim() || "1";

	return EPISODE_NUMBER.test(episode) ? `Episode ${episode}` : null;
}

function getTitleElement(): HTMLHeadingElement | null {
	return document.querySelector("main h1") ?? document.querySelector("h1");
}

function getCoverUrl(titleElement: HTMLHeadingElement | null): string | null {
	const details = titleElement?.parentElement?.parentElement;
	const sibling = details?.previousElementSibling;
	const fallback = document.querySelector<HTMLImageElement>(
		'img[alt][class~="w-28"][class~="h-40"]',
	);
	const cover =
		sibling?.tagName === "IMG" ? (sibling as HTMLImageElement) : fallback;

	return cover?.src || null;
}

export const anigumStrategy: AnimeSite = {
	domains: ["anigum.com"],
	iframe_src: [
		"megaplay.buzz",
		"vidnest.fun",
		"vsembed.ru",
		"bysewihe.com",
		"agum.player4me.xyz",
	],

	getAnimeMetadata: () => {
		if (!isWatchPage()) {
			return { title: null, episode: null, episodeName: null, coverUrl: null };
		}

		const titleElement = getTitleElement();
		return {
			title: titleElement?.textContent?.trim() || null,
			episode: getEpisode(),
			episodeName: null,
			coverUrl: getCoverUrl(titleElement),
		};
	},

	getProgressStats: () => getStandardVideoStats(),
};
