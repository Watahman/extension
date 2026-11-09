import { afterEach } from "vitest";

afterEach(() => {
	document.head.innerHTML = "";
	document.body.innerHTML = "";
	document.title = "";
	history.replaceState({}, "", "/");
});
