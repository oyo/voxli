import { COLOR, Shape, StyleMap, Vector3 } from './Types'
import { VoxelModel } from './VoxelModel'

export class VoxelScene extends VoxelModel {
  data: number[][][] = [[[0]]]
  style: StyleMap = {}
  dimension: Vector3 = { x: 0, y: 0, z: 0 }

  setStyle(style: StyleMap) {
    this.style = style
    return this.updateModel()
  }

  setData(data: number[][][]) {
    this.data = data
    return this.updateModel()
  }

  updateModel() {
    this.clear()
    if (!this.data) return this
    const data = this.data
    const dim = this.dimension
    dim.z = data.length
    const dz2 = dim.z / 2.0
    dim.y = data[0].length
    const dy2 = dim.y / 2.0
    dim.x = data[0][0].length
    const dx2 = dim.x / 2.0
    for (let z = 0; z < dim.z; z++)
      for (let y = 0; y < dim.y; y++)
        for (let x = 0; x < dim.x; x++) {
          const d = data[z][y][x]
          if (d) {
            const s = this.style?.[d] ?? {
              color: COLOR.DEFAULT_VOXEL,
              shape: Shape.CUBE,
            }
            this.shapeAt(x - dx2, y - dy2, z - dz2, s)
          }
        }
    this.fireModelChanged()
    return this
  }
}
