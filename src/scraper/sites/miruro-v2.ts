import type { AnimeSite } from "../../shared/types";
import { getStandardVideoStats } from "../parser";

export const miruroV2Strategy: AnimeSite = {
	domains: ["miruro.cx", "miruro.tv", "www.miruro.tv"],
	iframe_src: ["strm.cx", "megaplay.buzz"],

	getAnimeMetadata: () => {
		if (!window.location.pathname.startsWith("/watch/")) {
			return { title: null, episode: null, episodeName: null, coverUrl: null };
		}
		const titleElement = document.querySelector(".watch-anime-title");
		const episodeElement = document.querySelector(
			".watch-now-row p span:first-child",
		);
		const episodeNameElement = document.querySelector(".watch-now-row h1");
		const imageElement = document.querySelector(
			".watch-description img[data-cover-target]",
		) as HTMLImageElement;

		const title = titleElement?.textContent?.trim();
		const episode = episodeElement?.textContent?.trim();
		const episodeName = episodeNameElement?.textContent?.trim();
		const coverUrl = imageElement?.src;

		return {
			title: title ?? null,
			episode: episode ?? null,
			episodeName: episodeName && episode !== episodeName ? episodeName : null,
			coverUrl: coverUrl ?? null,
		};
	},

	getProgressStats: () => getStandardVideoStats(),
};
