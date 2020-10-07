interface EmojiSuggestion {
	character: string;
	description: string;
}

async function getGithubEmojis(): Promise<EmojiSuggestion[]> {
	const json = await fetch('https://api.github.com/emojis').then(r => r.json());

	const emojiSuggestions: EmojiSuggestion[] = []
	for (const shortCode in json) {
		const emojiURL = json[shortCode];

		if (!emojiURL.includes('/unicode')) continue;

		emojiSuggestions.push({
			character: parseEmoji(emojiURL),
			description: shortCode
		});
	}

	return emojiSuggestions;
}

function parseEmoji(e: string) {
	return e
		.slice(e.indexOf('/unicode') + 9, e.lastIndexOf('.png'))
		.split('-')
		.map(codePoint => String.fromCodePoint(Number.parseInt(codePoint, 16)))
		.join('\u200d');
}

Deno.writeTextFileSync('src/emoji.json', JSON.stringify(await getGithubEmojis(), null, 2));

