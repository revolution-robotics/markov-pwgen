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

const getWordList = async (source = wordListLocal) => {
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
`, null)
    await Promise.all(words.map(word => {
      return fh.write(`    "${word}",\n`)
    }))
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
