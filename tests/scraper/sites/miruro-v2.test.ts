import { describe, expect, it } from "vitest";
import { miruroV2Strategy } from "../../../src/scraper/sites/miruro-v2";
import { loadFixture, setBody, visit } from "../../helpers/dom";

describe("Miruro TV", () => {
	it("registers both TV hostnames", () => {
		expect(miruroV2Strategy.domains).toContain("miruro.tv");
		expect(miruroV2Strategy.domains).toContain("www.miruro.tv");
	});

	it("reads the observed One Piece episode, including an empty cover alt", () => {
		visit("https://miruro.tv/watch/id/one-piece?ep=632");
		setBody(loadFixture("miruro-tv/watch.html.fixture"));
		expect(miruroV2Strategy.getAnimeMetadata()).toEqual({
			title: "ONE PIECE",
			episode: "Episode 632",
			episodeName: "Dangerous Love! Dancing Girl Violet",
			coverUrl:
				"https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg",
		});
	});

	it("does not publish a browsing page as an activity", () => {
		visit("https://miruro.tv/");
		setBody(loadFixture("miruro-tv/watch.html.fixture"));
		expect(miruroV2Strategy.getAnimeMetadata().title).toBeNull();
	});
});
