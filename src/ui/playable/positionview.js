import { h, input, event, struct, value } from 'mercury';

import { Point } from '../../point'
import { Queen } from '../../piece/standard'
import { squareCoords } from '../../util'

const dragEvent = require('./drag-handler.js');

const ranks = '87654321'.split('');
const files = 'abcdefgh'.split('');

export function playable(position) {

	const state = struct({
		position: value(position),
		draggingPiece: value(null),
		registeredPiece: value(null),
		targetSquare: value(null),
		offset: value(null),
		rotated: value(false),
		events: input(['dragPiece', 'registerPiece', 'dropPiece']),
	});

	state.events.dragPiece(({
		piece,
		x,
		y,
		absX,
		absY,
		boardWidth,
		boardHeight
	}) => {
		state.registeredPiece.set(null);
		state.draggingPiece.set(piece);
		state.offset.set({ x, y });
		state.targetSquare.set(getTargetSquare({
			rs: position.ranks,
			fs: position.files,
			boardWidth,
			boardHeight,
			x: absX,
			y: absY,
			rotated: state.rotated(),
		}));
	});

	state.events.registerPiece(({ piece }) => {
		state.registeredPiece.set(piece);
	});

	state.events.dropPiece(({ piece }) => {
		const target = squareCoords(state.targetSquare());
		if (target != null) {
			const newPosition = state.position().tryMovePiece(piece, target);
			if (newPosition.promotionSquare != null) {
				// auto-promoting for now:
				state.position.set(
					newPosition.promote(new Queen({ color: piece.color })));
			}
			else {
				state.position.set(newPosition);
			}
			if (newPosition.isCheckmate()) {
				alert('checkmate');
			}
		}
		state.draggingPiece.set(null);
		state.registeredPiece.set(null);
		state.targetSquare.set(null);
	});

	return state;
}

playable.board = (state) =>
	h('div.board', rotate(ranks, state.rotated).map((r, i) =>
		h(`div.rank.r${r}`, rotate(files, state.rotated).map((f, j) =>
			h(`div.square.${f}${r}`, (
				isTarget(state, f, r) ? { className: 'active' } : {}
			), renderPiece(state, i, j))))));

function renderPiece(state, rank, file) {
	const piece
		= state.position.pieceByCoords(new Point(file, rank), state.rotated);
	if (piece == null) {
		return null;
	}
	const options = { piece, rank, file };
	const dragging = piece === state.draggingPiece;
	const registered = piece === state.registeredPiece;
	return h(`div.piece.${piece.fenEncoding}`, {
		'ev-mousedown': dragEvent(state.events.dragPiece, options),
		'ev-click': event(state.events.registerPiece, options),
		'ev-mouseup': event(state.events.dropPiece, options),
		'className': dragging ? 'dragging' : registered ? 'registered' : null,
		'style': (
			dragging ? {
				'top': state.offset.y + 'px',
				'left': state.offset.x + 'px',
				'z-index': '2',
			} : {
				'z-index': '1',
			}
		),
	});
}

function isTarget(state, file, rank) {
	return state.targetSquare === `${file}${rank}`;
}

function getTargetSquare({ rs, fs, boardWidth, boardHeight, x, y, rotated }) {
	return [
		rotate(files, rotated)[Math.floor(x / boardHeight * fs)],
		rotate(ranks, rotated)[Math.floor(y / boardWidth * rs)],
	].join('');
}

function rotate(arr, rotated) {
	if (rotated) {
		return [ ...arr ].reverse();
	}
	return arr;
}
