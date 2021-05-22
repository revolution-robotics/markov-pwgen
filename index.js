import MarkovChain from 'foswig'
import { dict } from './dictionary.js'

// rand: If given a single argument, min, then return a random integer in the
// range [0, min). If given two arguments, then return a random
// integer in the range [min, max).
const rand = (min, max = min) => {
  if (max === min) {
    min = 0
  }
  return Math.floor(Math.random() * (max - min) + min)
}

const getMarkovWord = (order, constraints) => {
  const chain = new MarkovChain(order, dict.words)

  try {
    return chain.generate(constraints)
  } catch (err) {
    return null
  }
}

const getMarkovWords = ({
  count = 3,
  order = rand(3, 5),
  minLength = rand(4, 7),
  maxLength = rand(7, 12),
  maxAttempts = 100,
  allowDuplicates = false
} = {}) => {
  const constraints = {
    minLength: minLength,
    maxLength: maxLength,
    maxAttempts: maxAttempts,
    allowDuplicates: allowDuplicates
  }

  return {
    constraints: constraints,
    options: {
      count: count,
      order: order
    },
    result: [...Array(count).keys()].map(_ =>
      getMarkovWord(order, constraints))
      .filter(word => word != null)
  }
}

export { getMarkovWords }
