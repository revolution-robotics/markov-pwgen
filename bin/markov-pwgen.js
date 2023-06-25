#!/usr/bin/env node
/*
 * @(#) markov-pwgen
 *
 * Copyright © 2023, Revolution Robotics, Inc.
n *
 */
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { parseArgs } from 'node:util'
import { Piscina } from 'piscina'
import { readFile } from 'node:fs/promises'

import { zip, zipMap } from '../lib/zip.js'
import { random64 } from '../lib/random64.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const piscina = new Piscina({ filename: resolve(__dirname, '../index.js') })

const help = (pgm) => {
  console.log(`Usage: ${pgm} OPTIONS`)
  console.log(`OPTIONS (defaults are random within the given range):
  --attemptsMax=N, -aN
           Fail after N attempts to generate chain (default: 100)
  --count=N, -cN
           Generate N hyphen-delimited passwords (default: [3, 5))
  --dictionary, -d
           Allow dictionary passwords (default: false)
  --help, -h
           Print this help, then exit.
  --lengthMin=N, -nN
           Maximum password length N (default: [4, 7))
  --lengthMax=N, -mN
           Minimum password length N (default: [7, 12))
  --order=N, -oN
           Markov order N (default: [3, 5))
  --transliterate=S,T, -tS,T
           Replace in password characters of S with corresponding
           characters of T.
  --version, -v
           Print version, then exit.
NB: Lower Markov order yields more random (i.e., less recognizable) words.`)
}

const getMarkovWords = async taskArgs => {
  const wordList = await Promise.all([...Array(taskArgs.count).keys()].map(async _ =>
    await piscina.runTask(taskArgs)))

  return wordList.filter(Boolean)
}

// transliterate: Replace in string characters of `s' to corresponding
//   characters of `t'.
if (!String.prototype.transliterate) {
  String.prototype.transliterate = function (s, t) {
    if (s.length > t.length) {
      s = s.slice(0, t.length)
    }

    const mz = zipMap(zip(s, t))

    return this.split('').map(c => mz[c] || c).join('')
  }
}

const processArgs = async pgm => {
  const options = {
    attemptsMax: {
      type: 'string',
      short: 'a',
      default: '100'
    },
    count: {
      type: 'string',
      short: 'c',
      default: `${random64(3, 5)}`
    },
    dictionary: {
      type: 'boolean',
      short: 'd',
      default: false
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false
    },
    lengthMin: {
      type: 'string',
      short: 'n',
      default: `${random64(4, 7)}`
    },
    lengthMax: {
      type: 'string',
      short: 'm',
      default: `${random64(7, 12)}`
    },
    order: {
      type: 'string',
      short: 'o',
      default: `${random64(3, 5)}`
    },
    transliterate: {
      type: 'string',
      short: 't'
    },
    version: {
      type: 'boolean',
      short: 'v',
      default: false
    }
  }

  const { values } = parseArgs({ options })

  if (values.help) {
    help(pgm)
    process.exit(0)
  } else if (values.version) {
    const pkgStr = await readFile(`${__dirname}/../package.json`, {
      encoding: 'utf8',
      flag: 'r'
    })
    const pkgObj = JSON.parse(pkgStr)

    console.log(`${pkgObj.name} v${pkgObj.version}`)
    process.exit(0)
  }

  const taskArgs = {
    maxAttempts: parseInt(values.attemptsMax, 10),
    count: parseInt(values.count, 10),
    allowDuplicates: values.dictionary,
    minLength: parseInt(values.lengthMin, 10),
    maxLength: parseInt(values.lengthMax, 10),
    order: parseInt(values.order, 10),
    transliterate: values.transliterate
  }

  if (taskArgs.maxAttempts < 1 ||
      taskArgs.count < 1 ||
      taskArgs.minLength < 1 ||
      taskArgs.maxLength < taskArgs.minLength ||
      taskArgs.order < 1) {
    help(pgm)
    process.exit(1)
  }

  return taskArgs
}

const main = async () => {
  const pgm = process.argv[1].replace(/^.*\//, '')
  const taskArgs = await processArgs(pgm)
  const wordList = await getMarkovWords(taskArgs)

  if (wordList.length < taskArgs.count) {
    console.log(`${pgm}: Unable to generate password with given constraints.`)
    process.exit(1)
  }

  const password = wordList.join('-')

  if (taskArgs.transliterate) {
    const [s, t] = taskArgs.transliterate.split(',')

    console.log(password.transliterate(s, t))
  } else {
    console.log(password)
  }
}

await main()
