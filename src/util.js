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

export const squareName = (rank, file) => {
  // console.log({ rank, file })
  return `${fileName(file)}${rankName(rank)}`
}

export const fileName = (file) => 'abcdefgh'.charAt(file)

export const rankName = (rank, top=8) =>  String(top - rank);

export const fileIndex = (fileName) => 'abcdefgh'.indexOf(fileName);

export const rankIndex = (rankName, top=8) => top - Number(rankName);
