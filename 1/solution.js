function findIntersection(N, M) {
  const map = new Map();
  const intersection = [];

  for (let i = 0; i < N.length; i++) {
    map.set(N[i], true);
  }

  for (let i = 0; i < M.length; i++) {
    if (map.get(M[i])) {
      intersection.push(M[i]);
    }
  }

  return intersection;
}

const N = [1, 2, 3, 4, 5];
const M = [2, 3, 4, 5, 6];
const intersection = findIntersection(N, M);
console.log(intersection);
