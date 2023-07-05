#!/usr/bin/env node
/*
 * @(#) filter-wordlist.py
 *
 * This script saves as a JSON dictionary a random subset of words
 * matching a regular expression in a wordlist.
 *
 */
import { open, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getFileOrURI } from '../lib/utils.js'
import random64 from '../lib/random64.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = path.basename(import.meta.url)

const dictionary = path.join(__dirname, '..', 'lib', 'dictionary.js')
const filterPattern = /^[^" ]{3,12}$/
const wordsMax = 200000
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
    const ary = Array.from(this)
    const len = ary.length

    for (let i = len - 1, j = Number(random64(len)); i > 0; j = Number(random64(i--))) {
      [ary[i], ary[j]] = [ary[j], ary[i]]
    }

    return ary
  }
}

const main = async () => {
  try {
    const wordList = await getWordList(process.argv[2])

    console.log(`Generating ${dictionary}\n  from: ${wordList}`)

    const words = (await readFile(wordList, { encoding: 'utf8' }))
      .split(/\r\n|\n/)
      .filter(word => word.match(filterPattern))
      .shuffle()
      .slice(0, wordsMax)
      .sort()

    const fh = await open(dictionary, 'w', 0o660)

    await fh.write(`const dict = {
  "words": [
`, null)

    for (const word of words) {
      await fh.write(`    "${word}",\n`)
    }
    await fh.write(`  ]
}

export { dict }
`)

    await fh.close()
  } catch ({ name, message }) {
    console.error(name, message)
  }
}

await main()
