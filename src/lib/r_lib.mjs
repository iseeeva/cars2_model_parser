import * as fs from 'fs'
import _ from 'lodash-es'
import { hasOwn, isPlainObject } from '../utils.mjs'
import { DataViewEX } from './c_lib.mjs'

// Reverse Engineering Library //

export const readHexConfig = {
  fstream: 0, // current reading file stream
  fname: '', // current reading file name
  scan_pos: [], // scan posses array
}

/**
 * Hex Reader Function
 * @param {string} file_name File Name
 * @param {number} pos_id Position ID of Read File
 * @param {number} numBytesToRead Number of Bytes To Read
 * @param {{swap_endian: boolean,add_pos: boolean,readAs: string}} options Function Options
 * @returns
 */
export function readHex(file_name, pos_id, numBytesToRead, options) {
  let buf = Buffer.alloc(numBytesToRead, 0)

  if (typeof readHexConfig.scan_pos[pos_id] != 'number')
    readHexConfig.scan_pos[pos_id] = 0

  try {
    if (readHexConfig.fname !== file_name) {
      fs.closeSync(readHexConfig.fstream)
      readHexConfig.fstream = fs.openSync(file_name, 'r')
      readHexConfig.fname = file_name
    }
    fs.readSync(readHexConfig.fstream, buf, 0, numBytesToRead, readHexConfig.scan_pos[pos_id])
  }
  catch (e) {
    console.log('[Error] readHex: ', e)
    process.exit()
  }

  if (isPlainObject(options)) {
    if (hasOwn(options, 'add_pos') && options.add_pos === true)
      readHexConfig.scan_pos[pos_id] += numBytesToRead

    if (hasOwn(options, 'swap_endian') && options.swap_endian === true)
      buf = endian(buf.toString('hex'))

    if (hasOwn(options, 'readAs') && typeof options.readAs === 'string')
      return readAs(options.readAs)
  }

  function readAs(type) {
    let ocean

    if (type === 'float32') {
      const dataView = new DataViewEX(new ArrayBuffer(4))
      dataView.setUint32(0, parseInt(buf.toString('hex'), 16))
      ocean = dataView.getFloat32(0)
      return ocean
    }

    if (type === 'float16') {
      const dataView = new DataViewEX(new ArrayBuffer(2))
      dataView.setUint16(0, parseInt(buf.toString('hex'), 16))
      ocean = dataView.getFloat16(0)
      return ocean
    }

    if (type === 'integer') {
      ocean = parseInt(buf.toString('hex'), 16)
      return ocean
    }

    return null
  }

  return buf
}

/**
 * Endian Swapping Function
 * @param {string} hexStr Hex String
 * @returns {Buffer} Hex Buffer
 */
export function endian(hexStr) {
  const newHexStr = (hexStr.length % 2 ? `0${hexStr}` : hexStr)
  const reversedHex = _.chunk(newHexStr, 2).reverse().flat().join('')
  return Buffer.from(reversedHex, 'hex')
}
