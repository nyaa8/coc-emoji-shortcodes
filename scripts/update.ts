async function getGithubEmojis(): Promise<(Map<string, string>)> {
	const json = await fetch("https://api.github.com/emojis").then(r => r.json());

	const map: Map<string,string> = new Map()
	for (const shortCode in json) {
		const emojiURL = json[shortCode];

		if (!emojiURL.includes('/unicode')) continue;
		map.set(shortCode, parseEmoji(emojiURL));
	}

	return map
}

function parseEmoji(e: string) {
	return e
		.slice(e.indexOf('/unicode') + 9, e.lastIndexOf('.png'))
		.split('-')
		.map(codePoint => String.fromCodePoint(Number.parseInt(codePoint, 16)))
		.join('\u200d');
}

