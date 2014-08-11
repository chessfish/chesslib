import { h, input, event, struct, value } from 'mercury';

import { Point } from '../../point'

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
		}));
	});

	state.events.registerPiece(({ piece }) => {
		state.registeredPiece.set(piece);
	});

	state.events.dropPiece(({ piece }) => {
		const targetSquare = state.targetSquare();
		if (targetSquare != null) {
			state.position.set(state.position().move(piece, targetSquare));
		}
		state.draggingPiece.set(null);
		state.registeredPiece.set(null);
		state.targetSquare.set(null);
	});

	return state;
}

playable.render = (state) =>
	h('div.board', ranks.map((r, i) =>
		h(`div.rank.r${r}`, files.map((f, j) =>
			h(`div.square.${f}${r}`, (
				isTarget(state, f, r) ? { className: 'active' } : {}
			), renderPiece(state, i, j))))));

function renderPiece(state, rank, file) {
	const piece = state.position.getPieceByCoords(new Point(file, rank));
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

function getTargetSquare({ rs, fs, boardWidth, boardHeight, x, y }) {
	return [
		files[Math.floor(x / boardHeight * fs)],
		ranks[Math.floor(y / boardWidth * rs)],
	].join('');
}
