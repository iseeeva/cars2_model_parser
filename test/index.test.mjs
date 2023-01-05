import fs from 'fs'
import path from 'path'
import { dirNameFileURL } from '../src/utils.mjs'
import { globalModelParser } from '../src/index.mjs'
const dirname = dirNameFileURL(import.meta.url)

// const HoloianPath = path.join(dirname, 'models/holoian/holoian.xml')
// const Holoian = globalModelParser(HoloianPath, { swap_endian: true })
// Holoian (Little Endian) - Developer Test Map of Cars 2 PC

// const HollyPath = path.join(dirname, 'models/holly/holly.xml')
// const Holly = globalModelParser(HollyPath, { swap_endian: true })
// Holly (Little Endian) - Holly Shiftwell Model of Cars 2 PC

// const QueenPath = path.join(dirname, 'models/queen/queen.xml')
// const Queen = globalModelParser(QueenPath, { swap_endian: false })
// Queen (Big Endian) - Queen Model of Cars 2 PS3

console.log(Holoian)
fs.writeFileSync(path.join(path.dirname(HoloianPath), 'test.json'), JSON.stringify(Holoian, null, 2))
