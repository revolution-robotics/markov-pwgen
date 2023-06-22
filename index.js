import MarkovChain from 'foswig'
import { dict } from './dictionary.js'

export default (constraints) => {
  const chain = new MarkovChain(constraints.order, dict.words)

  try {
    return chain.generate(constraints)
  } catch (err) {
    return null
  }
}
