import fs from 'fs'
import path from 'path'
import xmlJS from 'xml-js'
import { readHex, readHexConfig } from './lib/r_lib.mjs'
import { removeSpaces } from './utils.mjs'

const { scan_pos } = readHexConfig

let xml_converter_shits = []

// Cars 2 TVG Global Model Parser by iseeeva //

/**
 * OCT(XML) Model Parser
 * @param {string} octFileName XML File Name
 * @param {{swap_endian: boolean}} options Function Options
 */
export function globalModelParser(octFileName, options = { swap_endian: false }) {
  /** * Database of Parsed Model */
  const root_node = {}
  /** options for readHex */
  const hex_reader_options = { add_pos: true, ...options }
  /** octFileName's path */
  const workpath = path.dirname(octFileName)
  /**
   * * XML File
   * @type {import('./types/xml_pc.js').XML}
  */
  const oct = xmlJS.xml2js(fs.readFileSync(octFileName, 'utf-8'), { compact: true })

  oct.root_node.SceneTreeNodePool.Node.forEach((node) => {
    if (node.Type._text === 'SubGeometryLit' || node.Type._text === 'SubGeometry') {
      // NODE VARIABLES //

      const node_id = Number(removeSpaces(node._text)) // Node ID
      const node_type = node.Type._text // Node Type
      const node_name = node.NodeName._text // Node Name
      const node_pid = [] // Parent Node References
      const node_matId = Number(node.MaterialReference._text) // Material Reference ID
      const node_vref = [] // VertexStream References
      const node_iref = Number(node.IndexStreamReference._text) // IndexStream Reference

      if (node.VertexStreamReferences.entry === undefined)
        return
      xml_converter_shits = Array.isArray(node.VertexStreamReferences.entry) ? node.VertexStreamReferences.entry : [node.VertexStreamReferences.entry]
      xml_converter_shits.forEach((ref) => { node_vref.push(Number(ref._text)) })
      xml_converter_shits = Array.isArray(node.ParentNodeReferences.entry) ? node.ParentNodeReferences.entry : [node.ParentNodeReferences.entry]
      xml_converter_shits.forEach((ref) => { node_pid.push(Number(ref._text)) })

      console.log('\n', node_id, node_type, node_name, node_pid, node_matId, node_vref, node_iref)

      // VERTEXSTREAM VARIABLES //

      node_vref.forEach((ref) => {
        oct.root_node.VertexStreamPool.VertexStream.forEach((vertex) => {
          if (Number(removeSpaces(vertex._text)) === ref) {
            const vstream_id = Number(removeSpaces(vertex._text)) // ID of the vertex stream
            const vstream_len = Number(vertex.Length._text) // Length of the vertex stream
            const vstream_wid = Number(vertex.Width._text) // Width of the vertex stream
            const vstream_exw = Number(vertex.ExtraStride._text) // Extra width of the vertex stream (mostly filled with zero)
            const vstream_vbr = Number(vertex.VertexBufferReference._text) // Reference to the vertex stream
            const vstream_vbo = Number(vertex.VertexBufferOffset._text) // Offset of the vertex stream

            let vstream_vbr_fname // Filename of the vertex stream
            let vstream_vbr_fpath // Path to the vertex stream

            oct.root_node.VertexBufferPool.VertexBuffer.forEach((fbuffer) => {
              if (Number(removeSpaces(fbuffer._text)) === vstream_vbr) {
                vstream_vbr_fpath = path.join(workpath, fbuffer.FileName._text)
                vstream_vbr_fname = fbuffer.FileName._text

                if (root_node[vstream_vbr_fname] == null)
                  root_node[vstream_vbr_fname] = {}

                if (root_node[vstream_vbr_fname][node_name] == null)
                  root_node[vstream_vbr_fname][node_name] = {}

                root_node[vstream_vbr_fname][node_name][vstream_id] = {}
              }
            })

            if (vertex.Elements.Element === undefined)
              return
            xml_converter_shits = Array.isArray(vertex.Elements.Element) ? vertex.Elements.Element : [vertex.Elements.Element]
            xml_converter_shits.forEach((element) => {
              const velement_array = []

              // const velement_id = Number(element._text) // Element ID
              const velement_tid = Number(element.Type._text) // Type ID of element
              const velement_tna = element.Name._text // Element type name
              const velement_off = Number(element.Offset._text) // Element offset

              scan_pos[0] = vstream_vbo + velement_off

              for (let i = 0; i < vstream_len; i++) {
                switch (velement_tid) {
                  case 1: // Uv1/PC
                    velement_array.push([
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                    ])
                    scan_pos[0] += ((vstream_exw + vstream_wid) - 8)
                    break
                  case 2: // Position/PC_PS3
                    velement_array.push([
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                    ])
                    scan_pos[0] += ((vstream_exw + vstream_wid) - 12)
                    break
                  case 3: // Normal/PC
                    velement_array.push([
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                      readHex(vstream_vbr_fpath, 0, 4, { ...hex_reader_options, readAs: 'float32' }),
                    ])
                    scan_pos[0] += ((vstream_exw + vstream_wid) - 16)
                    break
                  case 24: // BoneIndices/PC_PS3
                    velement_array.push([
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }),
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }),
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }),
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }),
                    ])
                    scan_pos[0] += ((vstream_exw + vstream_wid) - 4)
                    break
                  case 25: // BlendWeights/PC_PS3
                    velement_array.push([
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }) / 255,
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }) / 255,
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }) / 255,
                      readHex(vstream_vbr_fpath, 0, 1, { ...hex_reader_options, readAs: 'integer' }) / 255,
                    ])
                    scan_pos[0] += ((vstream_exw + vstream_wid) - 4)
                    break
                  case 44: // Uv1/PS3
                    velement_array.push([
                      readHex(vstream_vbr_fpath, 0, 2, { ...hex_reader_options, readAs: 'float16' }),
                      readHex(vstream_vbr_fpath, 0, 2, { ...hex_reader_options, readAs: 'float16' }),
                    ])
                    scan_pos[0] += ((vstream_exw + vstream_wid) - 4)
                    break
                  default:
                    console.log(`\n ${velement_tid} is a unknown type of data for VertexStream, please contant to developer for this.`)
                    process.exit()
                }
              }

              root_node[vstream_vbr_fname][node_name][vstream_id][velement_tna] = velement_array

              console.log('\n', `${node_name}/${vstream_id}/${velement_tna}`, vstream_vbr_fname, '\n', velement_array[velement_array.length - 1])
            })
          }
        })
      })

      // INDEXSTREAM VARIABLES //

      oct.root_node.IndexStreamPool.IndexStream.forEach((index) => {
        if (Number(removeSpaces(index._text)) !== node_iref)
          return

        const istream_id = Number(removeSpaces(index._text)) // ID of the index stream
        let istream_len = Number(index.Length._text) // length of the index stream
        let istream_wid // Width of the index stream
        const istream_ibr = Number(index.IndexBufferReference._text) // Reference to the index stream
        const istream_isp = index.IndexStreamPrimitive._text // IndexStreamPrimitive
        let istream_ibr_fname // Filename of the index stream
        let istream_ibr_fpath // Path to the index stream
        const istream_ibo = Number(index.IndexBufferOffset._text) // Offset of the index stream

        oct.root_node.IndexBufferPool.IndexBuffer.forEach((fbuffer) => {
          if (Number(removeSpaces(fbuffer._text)) !== istream_ibr)
            return

          istream_ibr_fpath = path.join(workpath, fbuffer.FileName._text)
          istream_ibr_fname = fbuffer.FileName._text
          istream_wid = Number(fbuffer.Width._text)
          if (root_node[istream_ibr_fname] == null)
            root_node[istream_ibr_fname] = {}

          if (root_node[istream_ibr_fname][node_name] == null)
            root_node[istream_ibr_fname][node_name] = {}

          root_node[istream_ibr_fname][node_name][istream_id] = {}
        })

        const ielement_array = []
        scan_pos[1] = istream_ibo

        for (let i = 0; i < istream_len; i++) {
          switch (istream_wid) {
            case 2:
              ielement_array.push([
                readHex(istream_ibr_fpath, 1, 2, { ...hex_reader_options, readAs: 'integer' }),
                readHex(istream_ibr_fpath, 1, 2, { ...hex_reader_options, readAs: 'integer' }),
                readHex(istream_ibr_fpath, 1, 2, { ...hex_reader_options, readAs: 'integer' }),
              ])
              istream_len -= 2
              break
            default:
              console.log(`\n ${istream_wid} is a unknown type of data for IndexStream, please contant to developer for this.`)
              process.exit()
          }
        }

        root_node[istream_ibr_fname][node_name][istream_id][istream_isp] = ielement_array
        console.log('\n', `${node_name}/${istream_id}/${istream_isp}`, istream_ibr_fname, '\n', ielement_array[ielement_array.length - 1])
      })
    }
  })

  return root_node
}
