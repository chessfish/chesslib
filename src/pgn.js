import { FEN } from './fen';
import { Game } from './game';
import { ChessError } from './error';
import { partition, last } from './util';

const TOKEN_TAG = 'tag';
const TOKEN_RESULT = 'result';
const TOKEN_MOVE_NUMBER_NOTATION = 'move number';
const TOKEN_PLY_NOTATION = 'ply';
const TOKEN_ANNOTATION_NOTATION = 'annotation';

export const PGN = {

	parse(pgnStr) {
		return pgnStr.split(/\r\n\r\n\r\n|\n\n\n/).map(parseGame); // FIXME: is this sane?
	},

	stringify(game) {

	},

};

function parseGame(gameStr) {
		// transform the PGN into meaningful tokens:
	const tokens = tokenizePGN(
		// strip out different whitespace chars.
		` ${ gameStr.split(/[\n\r\r\t]+/g).join(' ') } `);

	const game = new Game();

	try {
		tokens.forEach(({ mode, source }) => {
			switch (mode) {
			case TOKEN_TAG:
				game.addTag(...parseTag(source));
				break;
			case TOKEN_PLY_NOTATION:
				game.move(source);
				break;
			case TOKEN_ANNOTATION_NOTATION:
				game.annotate(source);
				break;
			case TOKEN_RESULT:
				game.finish(source);
				break;
			}
		});
	} catch (err) {
		if (err instanceof ChessError) {
			err.lastPosition = FEN.stringify(last(game.ply).position);
		}
		throw err;
	}

	return game;
}

function parseTag(line) {
	const [key, value] = line.split(/\s+/);
	return [key, cleanValue(value)];
}

function cleanValue(value) {
	return value.replace(/^[\"\']|[\"\']$/g, '');
}

function tokenizePGN(transcript) {
	const tokens = [];
	var mode = null;
	var lastMode = null;
	var buffer = [];
	var halfmoveToggle = false;
	var skipping = 0;

	transcript.split('').forEach((char, i) => {
		if (i < skipping) {
			return;
		}
		switch (char) {

		case '[':
		case '{':
			skip(1);
			lastMode = mode;
			finishToken();
			mode = char == '[' ? TOKEN_TAG : TOKEN_ANNOTATION_NOTATION;
			break;

		case '}':
		case ']':
			finishToken();
			mode = lastMode;
			lastMode = null;
			return;

		case ' ':
		case '.':
			if (mode === TOKEN_PLY_NOTATION) {
				if (buffer.length == 0) {
					return;
				}
				finishToken();
				if (halfmove()) {
					mode = TOKEN_PLY_NOTATION;
				}
				return;
			}
			if (mode === TOKEN_MOVE_NUMBER_NOTATION) {
				if ('.' === char) {
					buffer.push(char);
				}
				finishToken();
				mode = TOKEN_PLY_NOTATION;
				return;
			}
			break;

		default:
			if (!/\d/.test(char)) {
				break;
			}
			if (mode === null || mode === TOKEN_PLY_NOTATION) {
				var p3 = peek(3), p7 = peek(7);
				if (p3 === '1-0' || p3 === '0-1') {
					result(p3);
					skip(3);
					return;
				}
				if (p7 === '1/2-1/2') {
					result(p7);
					skip(7);
					return;
				}
			}
			if (mode === null) {
				mode = TOKEN_MOVE_NUMBER_NOTATION;
			}
		}
		if (mode !== null && skipping < i) {
			buffer.push(char);
		}

		function skip(n) {
			skipping = i + n - 1;
		}

		function peek(n) {
			var str = '';
			for (var j = 0; j < n; j++) {
				str += transcript[i + j];
			}
			return str;
		}
	});

	return tokens;

	function halfmove() {
		return halfmoveToggle = !halfmoveToggle;
	}

	function result(source) {
		tokens.push({ mode: TOKEN_RESULT, source });
		mode = null;
		buffer = [];
	}

	function finishToken() {
		if (mode == null) {
			return;
		}
		if (buffer.length > 0) {
			const source = buffer.join('');
			tokens.push({ mode, source });
		}
		mode = null;
		buffer = [];
	}
}
