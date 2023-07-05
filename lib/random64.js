import assert from 'node:assert'
import { getRandomValues } from 'node:crypto'

// random64: With no arguments, returns cryptographically random
//   16-decimal floating point in the range [0,1).
//   With one integer argument, max:
//     0 < max <= 2 ** 64
//   returns cryptographically random BigInt in range [0, max)
//   (i.e., max exclusive).
//   With two integer arguments, min and max:
//     -2 ** 63 <= min < 2 ** 63
//     -2 ** 63 < max <= 2 ** 63
//     min < max
//   returns cryptographically random BigInt in range [min, max)
//   (i.e., max exclusive).
const random64 = (min = null, max = null) => {
  const tenPow16 = 10n ** 16n
  const twoPow63 = 2n ** 63n
  const twoPow64 = 2n ** 64n
  const arrayOf64BitInt = new BigUint64Array(1)
  const rand64Bit = BigInt(getRandomValues(arrayOf64BitInt)[0])

  if (max !== null) {
    const bigIntMin = BigInt(min)
    const bigIntMax = BigInt(max)

    assert(bigIntMin >= -twoPow63, `${min}: Out of range`)
    assert(bigIntMin < twoPow63, `${min}: Out of range`)
    assert(bigIntMax > -twoPow63, `${max}: Out of range`)
    assert(bigIntMax <= twoPow63, `${max}: Out of range`)
    assert(bigIntMin < bigIntMax, `${min} ≮ ${max}`)

    return rand64Bit * (bigIntMax - bigIntMin) / twoPow64 + bigIntMin
  } else if (min !== null) {
    const bigIntMin = BigInt(min)

    assert(bigIntMin > 0n, `${min}: Out of range`)
    assert(bigIntMin <= twoPow64, `${min}: Out of range`)

    return rand64Bit * bigIntMin / twoPow64
  } else {
    const tenPow16RandString = (tenPow16 * rand64Bit / twoPow64).toString()

    return parseFloat(`0.${tenPow16RandString.padStart(16, '0')}`)
  }
}

export default random64

// random64 Tests
// const twoPow63 = 2n ** 63n
// const twoPow64 = 2n ** 64n

// Expected to Succeed:
// console.log(random64())
// console.log(random64(twoPow64))
// console.log(random64(0, 1))
// console.log(random64(1))
// console.log(random64(-1, 0))
// console.log(random64(-twoPow63, twoPow63))

// Expected to Fail:
// console.log(random64(0))
// console.log(random64(twoPow64 + 1n))
// console.log(random64(twoPow63, twoPow63))
// console.log(random64(twoPow63 - 1n, twoPow63 + 1n))
// console.log(random64(1, 1))
// console.log(random64(0, 0))
