import { COLOR, Shape, StyleMap } from './Types'
import { VoxelModel } from './VoxelModel'

export class VoxelScene extends VoxelModel {
  data: number[][][] = [[[0]]]
  style: StyleMap = {}

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
    const dz = data.length
    const dz2 = dz / 2.0
    const dy = data[0].length
    const dy2 = dy / 2.0
    const dx = data[0][0].length
    const dx2 = dx / 2.0
    for (let z = 0; z < dz; z++)
      for (let y = 0; y < dy; y++)
        for (let x = 0; x < dx; x++) {
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
