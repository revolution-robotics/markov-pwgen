// zip: Given two strings `s' and `t', zip together characters in `s' to
//   corresponding characters in `t', e.g.:
//     zip("ab", "cd") => [['a', 'c'], ['b', 'd']]
const zip = (s, t) => {
  const ta = t.split('')

  return s.split('').map((e, i) => [e, ta[i]])
}

// zipMap: Given an array of character pairs, return object with each
// first character as property and second character as value
const zipMap = (a) => a.reduce((acc, e) => {
  acc[e[0]] = e[1]

  return acc
}, {})

export { zip, zipMap }
