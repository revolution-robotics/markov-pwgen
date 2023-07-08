#!/usr/bin/env node
/*
 * @(#) markov-pwgen
 *
 * Copyright © 2023, Revolution Robotics, Inc.
 *
 */
import { readFile } from 'node:fs/promises'
import os from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { Piscina } from 'piscina'
import random64 from '../lib/random64.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
           Minimum password length N (default: [4, 7))
  --lengthMax=N, -mN
           Maximum password length N (default: [7, 14))
  --order=N, -oN
           Markov order N (default: [3, 5))
  --transliterate=S,T, -tS,T
           Replace in password characters of S with corresponding
           characters of T.
  --version, -v
           Print version, then exit.
NB: Lower Markov order yields more random (i.e., less recognizable) words.`)
}

// transliterate: Replace in string characters of `s' to corresponding
//   characters of `t'.
if (!String.prototype.transliterate) {
  String.prototype.transliterate = function (s, t) {
    if (s.length > t.length) {
      s = s.slice(0, t.length)
    }

    // Initialize object from letters of s and t as properties and
    // values, respectively.
    const mz = Object.assign(...Array.from(s).map((e, i) => ({ [e]: t[i] })))

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
      default: `${Number(random64(3, 5))}`
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
      default: `${Number(random64(4, 7))}`
    },
    lengthMax: {
      type: 'string',
      short: 'm',
      default: `${Number(random64(7, 14))}`
    },
    order: {
      type: 'string',
      short: 'o',
      default: `${Number(random64(3, 5))}`
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
    const pkgPath = join(__dirname, '..', 'package.json')
    const pkgStr = await readFile(pkgPath, {
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
  const piscina = new Piscina({
    filename: join(__dirname, '..', 'index.js'),
    minThreads: Math.min(taskArgs.count, Math.ceil(os.availableParallelism / 2)),
    maxThreads: Math.min(taskArgs.count, Math.ceil(os.availableParallelism * 1.5)),
    idleTimeout: 100
  })

  const wordList = await Promise.all([...Array(taskArgs.count)].map(async _ =>
    await piscina.runTask(taskArgs)).filter(Boolean))

  if (wordList.length < taskArgs.count) {
    console.log(`${pgm}: Unable to generate password with given constraints.`)
    process.exit(1)
  }

  const password = wordList.join('-')

  if (taskArgs.transliterate) {
    const [s, t] = taskArgs.transliterate.split(/[,;]\s*|\s+/)

    console.log(password.transliterate(s, t))
  } else {
    console.log(password)
  }
}

await main()
