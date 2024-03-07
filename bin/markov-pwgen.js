#!/usr/bin/env node
/*
 * @(#) markov-pwgen
 *
 * Copyright © 2023,2024, Revolution Robotics, Inc.
 *
 */
import { readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { Piscina } from 'piscina'
import random64 from '../lib/random64.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getPkg = async () => {
  const pkgPath = path.resolve(__dirname, '..', 'package.json')
  const pkgStr = await readFile(pkgPath, {
    encoding: 'utf8',
    flag: 'r'
  })
  return JSON.parse(pkgStr)
}

const help = (pgm) => {
  console.log(`Usage: ${pgm} OPTIONS`)
  console.log(`OPTIONS (defaults are random within the given range):
  --attemptsMax, -a N
           Fail after N attempts to generate chain (default: 100)
  --count, -c N
           Generate N hyphen-delimited passwords (default: [3, 4])
  --dictionary, -d
           Allow dictionary-word passwords (default: false)
  --help, -h
           Print this help, then exit.
  --lengthMin, -n N
           Minimum password length N (default: [4, 6])
  --lengthMax, -m N
           Maximum password length N (default: [7, 13])
  --order, -o N
           Markov order N (default: [3, 4])
  --transliterate, -t FROM,TO
           Replace in password characters of FROM with corresponding
           characters of TO.
  --truncate-set1, -s
           By default, transliteration string TO is extended to
           length of FROM by repeating its last character as necessary.
           This option first truncates FROM to length of TO.
  --upperCase, -u
           Capitalize password components.
  --version, -v
           Print version, then exit.
NB: Lower Markov order yields more random (i.e., less recognizable) words.`)
}

// transliterate: Return a new string where characters of string
//   `fromStr' are replaced by corresponding characters of string
//   `toStr'. When option `truncate' is false (the default), `toStr'
//   is extended to the length of `fromStr' by repeating its last
//   character as necessary. When option `truncate' is true, `fromStr'
//   is truncated to the length of `toStr'.
if (!String.prototype.transliterate) {
  String.prototype.transliterate = function (fromStr = '', toStr = '',
                                             options = { truncate: false }) {
    if (options.truncate)
      fromStr = fromStr.slice(0, toStr.length)
    else
      toStr = toStr.padEnd(fromStr.length, toStr.slice(-1))

    const xlt =
          Object.assign(...Array.from(fromStr)
                        .map((char, i) => ({ [char]: toStr[i] })))

    return Array.from(this).map(char => xlt[char] || char).join('')
  }
}

const processArgs = async pkg => {
  const options = {
    attemptsMax: {
      type: 'string',
      short: 'a',
      default: '100'
    },
    count: {
      type: 'string',
      short: 'c',
      default: `${Number(random64(3, 4))}`
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
      default: `${Number(random64(4, 6))}`
    },
    lengthMax: {
      type: 'string',
      short: 'm',
      default: `${Number(random64(7, 13))}`
    },
    order: {
      type: 'string',
      short: 'o',
      default: `${Number(random64(3, 4))}`
    },
    'truncate-set1': {
      type: 'boolean',
      short: 's',
      default: false
    },
    transliterate: {
      type: 'string',
      short: 't'
    },
    upperCase: {
      type: 'boolean',
      short: 'u'
    },
    version: {
      type: 'boolean',
      short: 'v',
      default: false
    }
  }

  const { values } = parseArgs({
    options,
    allowPositionals: false
  })

  if (values.help) {
    help(pkg.name)
    process.exit(0)
  } else if (values.version) {
    console.log(`${pkg.name} v${pkg.version}`)
    process.exit(0)
  }

  const taskArgs = {
    maxAttempts: parseInt(values.attemptsMax, 10),
    count: parseInt(values.count, 10),
    allowDuplicates: values.dictionary,
    minLength: parseInt(values.lengthMin, 10),
    maxLength: parseInt(values.lengthMax, 10),
    order: parseInt(values.order, 10),
    transliterate: values.transliterate,
    upperCase: values.upperCase,
    truncate: values['truncate-set1']
  }

  if (taskArgs.maxAttempts < 1 ||
      taskArgs.count < 1 ||
      taskArgs.minLength < 1 ||
      taskArgs.maxLength < taskArgs.minLength ||
      taskArgs.order < 1) {
    help(pkg.name)
    process.exit(1)
  }

  return taskArgs
}

const main = async () => {
  let pkg = null
  let taskArgs = null
  let piscina = null
  let wordList = null

  try {
    pkg = await getPkg()
    taskArgs = await processArgs(pkg)
    piscina = new Piscina({
      filename: path.resolve(__dirname, '..', 'index.js'),
      minThreads: Math.min(taskArgs.count, Math.ceil(os.availableParallelism / 2)),
      maxThreads: Math.min(taskArgs.count, Math.ceil(os.availableParallelism * 1.5)),
      idleTimeout: 100
    })
    wordList = await Promise.all([...Array(taskArgs.count)].map(async _ =>
      await piscina.runTask(taskArgs)).filter(Boolean))
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  if (wordList.length < taskArgs.count) {
    console.error(`${pkg.name}: Unable to generate password with given constraints.`)
    process.exit(1)
  }

  let password = wordList.join('-')

  if (taskArgs.transliterate) {
    const [s, t] = taskArgs.transliterate.split(/[,]\s*|\s+/)

    password = password.transliterate(s, t, { truncate: taskArgs.truncate })
  }

  if (taskArgs.upperCase) {
    password = password.replace(/^\p{L}.|(?<=([\p{Pd}_:;]))\p{L}./gv,
                                c => `${c[0].toUpperCase()}${c[1]}`)
  }

  console.log(password)
}

await main()
