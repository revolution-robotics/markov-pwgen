import assert from 'assert'

// getRandom: With no arguments, returns pseudo-random
//   16-decimal floating point in the range [0,1).
//   With one integer argument, min, returns pseudo-random
//   integer in range [0, min).
//   With two integer arguments, min and max, returns
//   pseudo-random integer in range [min, max).
const getRandom = (min, max) => {
  if (max) {
    assert(Number.isInteger(min, `${min}: Not an integer`))
    assert(Number.isInteger(max, `${max}: Not an integer`))

    return Math.floor(Math.random() * (max - min) + min)
  } else if (min) {
    assert(Number.isInteger(min, `${min}: Not an integer`))

    return Math.floor(Math.random() * min)
  } else {
    return Math.random()
  }
}

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

export { getRandom, zip, zipMap }
