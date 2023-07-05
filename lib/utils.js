import { Buffer } from 'node:buffer'
import { access, constants, stat, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import random64 from './random64.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = path.basename(import.meta.url)

// downloadURI: Fetch given URL (string or object) to FILENAME.
//     Otherwise, throws an error.
const downloadURI = async (url, filename) => {
  const res = await fetch(url)
  const abuf = await res.arrayBuffer()

  await writeFile(filename, Buffer.from(abuf))
}

// mktemp: Create (non-atomically) a temporary file and return its
//     path. The file is unlinked on process exit.
const mktemp = async ({ dir = __dirname, prefix = __filename } = {}) => {
  let tmpfile = null

  while (true) {
    try {
      tmpfile = path.join(dir, prefix + random64(100000, 1000000).toString())
      await access(tmpfile, constants.F_OK)
    } catch {
      break
    }
  }

  return tmpfile
}

// isFile: Return true if given pathname is that of a file, otherwise false.
const isFile = async (uri) => {
  let status = false

  try {
    const stats = await stat(uri)

    status = stats.isFile()
  } catch {
    status = false
  }

  return status
}

// isURI: Return true if given argument is a URL, otherwise false.
const isURI = async (uri) => {
  let status = false

  try {
    status = new URL(uri) && true
  } catch {
    status = false
  }

  return status
}

// getFileOrURI: Return a local pathname given a URI.  If URI is already
//     a local pathname, return that.  If URI is fetchable, save it to a
//     temporary file and return its pathname. Otherwise, return null.
const getFileOrURI = async (uri) => {
  let filename = null

  if (await isFile(uri)) {
    filename = uri
  } else if (await isURI(uri)) {
    try {
      filename = await mktemp({ dir: __dirname, prefix: __filename })
      process.on('exit', async () => await unlink(filename))
      await downloadURI(uri, filename)
    } catch (error) {
      filename = null
    }
  } else {
    console.error(`${__filename}: ${uri}: Resource not available`)
  }

  return filename
}

export { getFileOrURI }
