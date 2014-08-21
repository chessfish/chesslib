import { FEN } from './fen';
import { Game } from './game';
import { ChessError } from './error';
import { partition, last } from './util';

export const PGN = {

	parse(pgnStr) {
		// transform the PGN into meaningful tokens:
		const tokens = tokenizePGN(
			// strip out different whitespace chars.
			pgnStr.split(/[\n\r\r\t]+/g).join(' '));

		const game = new Game();

		try {
			tokens.forEach(({ mode, source }) => {
				switch (mode) {
				case MODE_TAG:
					game.addTag(...parseTag(source));
					break;
				case MODE_PLY_NOTATION:
					game.move(source);
					break;
				case MODE_ANNOTATION_NOTATION:
					game.annotate(source);
					break;
				case MODE_RESULT:
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
	},

	stringify(game) {

	},

};

function parseTag(line) {
	const [key, value] = line.split(/\s+/);
	return [key, cleanValue(value)];
}

function cleanValue(value) {
	return value.replace(/^[\"\']|[\"\']$/g, '');
}

const MODE_TAG = 'tag';
const MODE_RESULT = 'result';
const MODE_MOVE_NUMBER_NOTATION = 'move number';
const MODE_PLY_NOTATION = 'ply';
const MODE_ANNOTATION_NOTATION = 'annotation';

function tokenizePGN(transcript) {
	const tokens = [];
	var mode = null;
	var lastMode = null;
	var buffer = [];
	var halfMove = false;
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
			mode = char == '[' ? MODE_TAG : MODE_ANNOTATION_NOTATION;
			break;

		case '}':
		case ']':
			finishToken();
			mode = lastMode;
			lastMode = null;
			return;

		case ' ':
			if (mode === MODE_PLY_NOTATION) {
				if (buffer.length == 0) {
					return;
				}
				finishToken();
				halfMove = !halfMove;
				if (halfMove) {
					mode = MODE_PLY_NOTATION;
				}
				return;
			}
			if (mode === MODE_MOVE_NUMBER_NOTATION) {
				finishToken();
				mode = MODE_PLY_NOTATION;
				return;
			}
			break;

		default:
			if (!/\d/.test(char)) {
				break;
			}
			if (mode === null || mode === MODE_PLY_NOTATION) {
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
				mode = MODE_MOVE_NUMBER_NOTATION;
			}
		}
		if (mode !== null && skipping < i) {
			buffer.push(char);
		}

		function skip(n) {
			skipping = i + n - 1;
		}

		function peek(n=1) {
			var str = '';
			for (var j = 0; j < n; j++) {
				str += transcript[i + j];
			}
			return str;
		}
	});

	return tokens;

	function result(source) {
		tokens.push({ mode: MODE_RESULT, source });
		mode = null;
		buffer = [];
	}

	function finishToken() {
		if (mode == null) {
			return;
		}
		if (buffer.length > 0) {
			const source = buffer.join('');
			if (/^\s+$/.test(source)) {
				return;
			}
			tokens.push({ mode, source });
		}
		mode = null;
		buffer = [];
	}
}
