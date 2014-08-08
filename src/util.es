export const uncurryThis = Function.bind().bind(Function.call);

export const has = uncurryThis({}.hasOwnProperty);

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