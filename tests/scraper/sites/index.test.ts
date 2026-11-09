import { describe, expect, it } from "vitest";
import { strategies } from "../../../src/scraper/sites";

const HOSTNAME = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i;

describe("strategies registry", () => {
	it("registers all 12 supported sites", () => {
		expect(strategies).toHaveLength(12);
	});

	it("uses unique, bare hostnames", () => {
		const siteDomains = strategies.flatMap((strategy) => strategy.domains);
		expect(new Set(siteDomains).size).toBe(siteDomains.length);

		for (const strategy of strategies) {
			const hosts = [...strategy.domains, ...strategy.iframe_src];
			for (const host of hosts) expect(host).toMatch(HOSTNAME);
			expect(new Set(hosts).size).toBe(hosts.length);
		}
	});

	it("does not register a player host as a site", () => {
		const siteDomains = new Set(
			strategies.flatMap((strategy) => strategy.domains),
		);
		for (const player of strategies.flatMap(
			(strategy) => strategy.iframe_src,
		)) {
			expect(siteDomains.has(player)).toBe(false);
		}
	});
});
