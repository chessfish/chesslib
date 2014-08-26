import { WHITE, BLACK, LIGHT, DARK } from './brands'
import { Point } from './point'
const isNumber = require('lodash.isnumber');

export function *entries(collection) {
	for (var k in collection) {
		yield [collection[k], k];
	}
}

export function *bounded({ files, ranks }, iterator) {
	for (var pt of iterator) {
		if (new Point(0, 0).lte(pt) && new Point(files, ranks).gt(pt)) {
			yield pt;
		}
	}
}

export const identity = it => it;

export const squareName = ({ x: file, y: rank }) =>
	`${fileName(file)}${rankName(rank)}`;

export const fileName = file => 'abcdefgh'.charAt(file);

export const rankName = (rank, top=8) =>  String(top - rank);

export const fileIndex = fileName => 'abcdefgh'.indexOf(fileName);

export const rankIndex = (rankName, top=8) => top - Number(rankName);

export const squareCoords = squareName => {
	const [fileName, rankName] = squareName.split('');
	return squareCoordsByName(fileName, rankName);
};

export const squareCoordsByName = (fileName, rankName) =>
	new Point(fileIndex(fileName), rankIndex(rankName));

export const oppositeColor = color => color === WHITE ? BLACK : WHITE;

export const squareColor = ({ x, y }) =>
	(isEven(x) && isEven(y) || isOdd(x) && isOdd(y)) ? LIGHT : DARK;

export const isEven = n => isNumber(n) && n % 2 === 0;

export const isOdd = n => !isEven(n);

export const partition = (list, fn) => {
	const result = [[], []];
	for (var item of list) {
		result[+!fn(item)].push(item);
	}
	return result;
}

export const last = (arr) => arr[arr.length - 1];
