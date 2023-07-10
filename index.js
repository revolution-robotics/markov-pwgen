import MarkovChain from 'foswig'
import random64 from './lib/random64.js'
import wordList from './lib/word-list.js'

export default (constraints) => {
  const chain = new MarkovChain(constraints.order, wordList.words)

  try {
    constraints.random = random64

    return chain.generate(constraints)
  } catch (err) {
    return null
  }
}
