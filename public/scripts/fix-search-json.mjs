import fs from "fs";
import path from "path";

// jakubstrzelecki@MacBook-Pro-Jakub-2 public % node scripts/fix-search-json.mjs

const inputPath = path.resolve("pmtiles/search.json");
const outputPath = path.resolve("pmtiles/search.cleaned.json");

const raw = fs.readFileSync(inputPath, "utf-8").trim();

function splitObjects(text) {
	const objects = [];
	let depth = 0;
	let start = -1;
	let inString = false;
	let escaped = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		if (inString) {
			if (escaped) {
				escaped = false;
			} else if (char === "\\") {
				escaped = true;
			} else if (char === '"') {
				inString = false;
			}
			continue;
		}

		if (char === '"') {
			inString = true;
			continue;
		}

		if (char === "{") {
			if (depth === 0) {
				start = i;
			}
			depth++;
			continue;
		}

		if (char === "}") {
			depth--;
			if (depth === 0 && start !== -1) {
				objects.push(text.slice(start, i + 1));
				start = -1;
			}
		}
	}

	return objects;
}

const chunks = splitObjects(raw);

const parsed = chunks.map((chunk, index) => {
	try {
		return JSON.parse(chunk);
	} catch (error) {
		console.error(`Błąd parsowania obiektu #${index + 1}`);
		console.error(chunk);
		throw error;
	}
});

const cleaned = parsed
	.filter((item) => item && typeof item === "object")
	.filter(
		(item) =>
			typeof item.featureId === "string" && item.featureId.trim() !== "",
	)
	.filter((item) => typeof item.id === "string" && item.id.trim() !== "room-")
	.filter((item) => item.type !== "r_entry")
	.filter((item) => item.label !== null)
	.filter((item) => item.buildingId !== null);

const unique = Array.from(
	new Map(cleaned.map((item) => [item.featureId, item])).values(),
);

fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2), "utf-8");

console.log(`Gotowe.
Wczytano: ${parsed.length}
Po czyszczeniu: ${cleaned.length}
Po usunięciu duplikatów: ${unique.length}
Zapisano do: ${outputPath}`);
