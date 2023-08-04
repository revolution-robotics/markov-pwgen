#!/usr/bin/env node
/*
 * @(#) filter-wordlist.py
 *
 * This script generates a JSON array of words from a random subset of
 * a given word list that matches a regular expression.
 *
 */
import { open, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getFileOrURI } from '../lib/utils.js'
import random64 from '../lib/random64.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = path.basename(import.meta.url)

const filteredWordList = path.join(__dirname, '..', 'lib', 'word-list.js')
const filterPattern = /^[^" ]{3,14}$/
const wordsMax = 250000
const wordListLocal = path.join(path.sep, 'usr', 'share', 'dict', 'web2')
const wordListRemote = 'https://www.gutenberg.org/files/3201/files/SINGLE.TXT'
const localeEnv = ['LANG', 'LANGUAGE', 'LC_ALL', 'LC_MESSAGES']
const locale = localeEnv.map(v => process.env[v]?.split('_')[0].toLowerCase()).filter(Boolean)[0]
const wordListByLocale = {
  // ar: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/arabic.txt',
  hr: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/croatian.txt',
  cs: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/czech.txt',
  da: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/danish.txt',
  nl: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/dutch.txt',
  en: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/english.txt',
  fr: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/french.txt',
  ka: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/georgian.txt',
  de: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/german.txt',
  // he: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/hebrew.txt',
  it: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/italian.txt',
  no: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/norwegian.txt',
  pl: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/polish.txt',
  pt: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/portuguese.txt',
  ru: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/russian.txt',
  sr: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/serbian.txt',
  es: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/spanish.txt',
  sv: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/swedish.txt',
  // tr: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/turkish.txt',
  uk: 'https://github.com/kkrypt0nn/wordlists/raw/main/languages/ukrainian.txt'
}

const getWordList = async (source = wordListByLocale[locale] || wordListLocal) => {
  let wordList = null

  if ((wordList = await getFileOrURI(source)) === null && source !== wordListRemote) {
    console.error(`${__filename}: ${source}: Resource not availlable, trying alternative...`)

    source = wordListRemote
    wordList = await getFileOrURI(source)
  }

  if (wordList === null) {
    console.error(`${__filename}: ${source}: Resource not availlable`)

    process.exit(1)
  }

  return wordList
}

if (!Array.prototype.shuffle) {
  // Fisher-Yates shuffle
  Array.prototype.shuffle = function () {
    const ary = []
    const len = this.length

    for (let i = 0, j = 0; i < len; j = Number(random64(++i + 1))) {
      [ary[i], ary[j]] = [ary[j], this[i]]
    }

    return ary
  }
}

const main = async () => {
  try {
    const wordList = await getWordList(process.argv[2])

    console.log(`Generating ${filteredWordList}\n  from: ${wordList}`)

    const words = (await readFile(wordList, { encoding: 'utf8' }))
      .split(/\r?\n/)
      .filter(word => word.match(filterPattern))
      .shuffle()
      .slice(0, wordsMax)
      .sort()

    const fh = await open(filteredWordList, 'w', 0o660)

    await fh.write(`const wordList = {
  "words": [
`)
    for (const word of words) {
      await fh.write(`    "${word}",\n`)
    }
    await fh.write(`  ]
}

export default wordList
`)
    await fh.close()
  } catch ({ name, message }) {
    console.error(name, message)
  }
}

await main()
