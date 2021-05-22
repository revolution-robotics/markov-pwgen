#!/usr/bin/env node
/*
 * @(#) markov-pwgen
 *
 * Copyright © 2021, Revolution Robotics, Inc.
 *
 */
import { getMarkovWords } from '../index.js'
import parseArgs from 'minimist'

const pgm = process.argv[1].replace(/^.*\//, '')
const argv = parseArgs(process.argv.slice(2))

if (argv.help || argv.h) {
  console.log(`Usage: ${pgm} OPTIONS`)
  console.log(`OPTIONS (defaults are random within the given range):
  --count=N         Generate N hyphen-delimited passwords (default: 3)
  --order=N         Specify Markov chain order (default: rand [3, 5))
  --minLength=N     Minimum password length (default: rand [4, 7))
  --maxLength=N     Maximum password length (default: rand [7, 12))
  --maxAttempts=N   Fail after N attempts to generate chain (default: 100)
  --allowDuplicates Allow dictionary passwords (default: false)`)
  process.exit(0)
}

const wordList = getMarkovWords(argv)

if (wordList.result.length < wordList.options.count) {
  console.log(`${pgm}: Unable to generate password with given constraints.`)
  process.exit(1)
} else {
  console.log(wordList.result.join('-'))
}
