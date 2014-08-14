import { WHITE, BLACK } from './brands'
import { Point } from './point'

export function* entries(collection) {
  if (Array.isArray(collection)) {
    for (var i = 0; i < collection.length; i++) {
      yield [collection[i], i];
    }
  }
  for (var k in collection) {
    yield [collection[k], k];
  }
}

export const identity = (it) => it

export const squareName = ({ x: file, y: rank }) =>
  `${fileName(file)}${rankName(rank)}`;

export const fileName = (file) => 'abcdefgh'.charAt(file)

export const rankName = (rank, top=8) =>  String(top - rank);

export const fileIndex = (fileName) => 'abcdefgh'.indexOf(fileName);

export const rankIndex = (rankName, top=8) => top - Number(rankName);

export const squareCoords = (squareName) => {
  const [fileName, rankName] = squareName.split('');
  return new Point(fileIndex(fileName), rankIndex(rankName));
}

export const oppositeColor = (color) => color === WHITE ? BLACK : WHITE;
