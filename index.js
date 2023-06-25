import MarkovChain from 'foswig'
import { dict } from './lib/dictionary.js'
import random64 from './lib/random64.js'

export default (constraints) => {
  const chain = new MarkovChain(constraints.order, dict.words)

  try {
    constraints.random = random64

    return chain.generate(constraints)
  } catch (err) {
    return null
  }
}
