import { describe, expect, it } from "vitest";
import { anigumStrategy } from "../../../src/scraper/sites/anigum";
import { loadFixture, mockVideo, setBody, visit } from "../../helpers/dom";

describe("anigumStrategy", () => {
	it("declares the site and observed player hosts", () => {
		expect(anigumStrategy.domains).toEqual(["anigum.com"]);
		expect(anigumStrategy.iframe_src).toContain("megaplay.buzz");
		expect(anigumStrategy.iframe_src).toContain("bysewihe.com");
	});

	it("scrapes a concrete watch page", () => {
		visit("https://anigum.com/Watch?id=16498&ep=1");
		setBody(loadFixture("anigum/watch.html.fixture"));

		expect(anigumStrategy.getAnimeMetadata()).toEqual({
			title: "Attack on Titan",
			episode: "Episode 1",
			episodeName: null,
			coverUrl: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
		});
	});

	it("uses episode one when the query omits ep", () => {
		visit("https://anigum.com/Watch?id=16498");
		setBody(loadFixture("anigum/watch.html.fixture"));

		expect(anigumStrategy.getAnimeMetadata().episode).toBe("Episode 1");
	});

	it("returns null metadata away from a watch page", () => {
		visit("https://anigum.com/Browse");
		setBody("<main><h1>Popular anime</h1></main>");

		expect(anigumStrategy.getAnimeMetadata()).toEqual({
			title: null,
			episode: null,
			episodeName: null,
			coverUrl: null,
		});
	});

	it("reads playback from Anigum's native HTML5 player", () => {
		setBody("<video></video>");
		const video = document.querySelector("video") as HTMLVideoElement;
		mockVideo(video, { duration: 1440, currentTime: 120, paused: false });

		expect(anigumStrategy.getProgressStats()).toEqual({
			currentMs: 120_000,
			durationMs: 1_440_000,
			isPaused: false,
		});
	});
});
