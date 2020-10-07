const { sources, workspace } = require('coc.nvim');
const path = require('path');

const activate = async ctx => {
	const emojiData = require(path.resolve(__dirname, 'emoji.json'));
	const source = {
		name: 'emoji-shortcodes',
		triggerOnly: true,
		doComplete: async function() {
			return {
				items: emojiData.map(e => ({
					word: e.character,
					abbr: `${e.character} ${e.description}`,
					menu: this.menu,
					filterText: e.description
				}))
			};
		},
		onCompleteDone: async (item, opt) => {
			const { nvim } = workspace;
			let { linenr, col, input, line } = opt;
			let buf = Buffer.from(line, 'utf8');
			let pre = buf.slice(0, col-1);
			let after = buf.slice(col + input.length);

			await nvim.call('coc#util#setline', [linenr, pre + item.word + after]);
			await nvim.call('cursor', [linenr, Buffer.byteLength(pre + item.word) + 1]);
		}
	};

	ctx.subscriptions.push(sources.createSource(source));
};

exports = { activate };
