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

export const squareName = (rank, file) => `${rankName(rank)}{fileName(file)}`

export const rankName = (rank) => 'abcdefgh'.charAt(rank)

export const fileName = (file) =>  "" + (file + 1);

export const rankIndex = (rankName) => 'abcdefgh'.indexOf(rankName);

export const fileIndex = (fileName) => Number(fileName) - 1;
