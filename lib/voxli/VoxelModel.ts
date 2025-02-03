import { Model } from './Model'
import { COLOR, Shape, Style, type Color } from './Types'

type ShapeFunction = (x: number, y: number, z: number, c: Color) => VoxelModel

export class VoxelModel extends Model {
  shade = [
    [0.7, 0.3, 0.8],
    [0.5, 0.9, 0.4],
  ]
  ds = [
    [
      [0.45, 0.55],
      [0.85, 0.95],
    ],
    [
      [0.25, 0.35],
      [0.65, 0.75],
    ],
  ]

  shapeFnMap: Record<Shape, ShapeFunction> = {
    [Shape.EMPTY]: () => this,
    [Shape.CUBE]: this.cubeAt,
    [Shape.STAR]: this.starAt,
    [Shape.DIAMOND]: this.diamondAt,
  }

  constructor() {
    super()
  }

  /*
   * Six squares as cube sides
   */

  quadXM(x: number, y: number, z: number, c: Color) {
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade[0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y, z1, x, y1, z1, x, y, z, x, y1, z1, x, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadXP(x: number, y: number, z: number, c: Color) {
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade[1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z1, x, y, z1, x, y, z, x, y1, z, x, y1, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYM(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade[0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z, x1, y, z1, x, y, z, x1, y, z1, x, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYP(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade[1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z1, x1, y, z, x, y, z, x, y, z1, x1, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZP(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade[1][2],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z, x1, y1, z, x, y, z, x1, y1, z, x1, y, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZM(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade[0][2],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y1, z, x, y1, z, x, y, z, x1, y, z, x1, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  /*
   * Eight triangles through cube corners
   */

  // N = -1,+1,+1
  striA(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y + 1, z + 1, x + 1, y + 1, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,-1,+1
  striB(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x + 1, y + 1, z, x + 1, y, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,-1,-1
  striC(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x + 1, y, z + 1, x, y + 1, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,+1,-1
  striD(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y + 1, z + 1, x + 1, y, z + 1, x + 1, y + 1, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,-1,+1
  striE(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z + 1, x, y + 1, z, x + 1, y, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,+1,-1
  striF(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z + 1, x + 1, y + 1, z + 1, x, y + 1, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,-1,-1
  striG(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z + 1, x + 1, y, z, x + 1, y + 1, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,+1,+1
  striH(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y + 1, z, x + 1, y + 1, z + 1, x + 1, y, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }

  /*
   * Eight triangles through cube corners
   */

  // N = -1,+1,+1
  dtriA(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y + 0.5, z, x + 0.5, y + 1, z + 0.5, x + 1, y + 0.5, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,-1,+1
  dtriB(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(
      x + 1,
      y + 0.5,
      z,
      x + 0.5,
      y + 1,
      z + 0.5,
      x + 1,
      y + 0.5,
      z + 1
    )
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,-1,-1
  dtriC(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(
      x + 1,
      y + 0.5,
      z + 1,
      x + 0.5,
      y + 1,
      z + 0.5,
      x,
      y + 0.5,
      z + 1
    )
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,+1,-1
  dtriD(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y + 0.5, z + 1, x + 0.5, y + 1, z + 0.5, x, y + 0.5, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,-1,+1
  dtriE(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x + 0.5, y, z + 0.5, x, y + 0.5, z, x + 1, y + 0.5, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,+1,-1
  dtriF(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x + 0.5, y, z + 0.5, x + 1, y + 0.5, z, x + 1, y + 0.5, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,-1,-1
  dtriG(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x + 0.5, y, z + 0.5, x + 1, y + 0.5, z + 1, x, y + 0.5, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,+1,+1
  dtriH(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x + 0.5, y, z + 0.5, x, y + 0.5, z + 1, x, y + 0.5, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }

  /*
   * Geometric shapes
   */

  cubeAt(x: number, y: number, z: number, c: Color) {
    this.quadXP(x + 1, y, z, c)
    this.quadYP(x, y + 1, z, c)
    this.quadZM(x, y, z + 1, c)
    this.quadXM(x, y, z, c)
    this.quadYM(x, y, z, c)
    this.quadZP(x, y, z, c)
    return this
  }

  starAt(x: number, y: number, z: number, c: Color) {
    this.striA(x, y, z, c)
    this.striB(x, y, z, c)
    this.striC(x, y, z, c)
    this.striD(x, y, z, c)
    this.striE(x, y, z, c)
    this.striF(x, y, z, c)
    this.striG(x, y, z, c)
    this.striH(x, y, z, c)
    return this
  }

  diamondAt(x: number, y: number, z: number, c: Color) {
    this.dtriA(x, y, z, c)
    this.dtriB(x, y, z, c)
    this.dtriC(x, y, z, c)
    this.dtriD(x, y, z, c)
    this.dtriE(x, y, z, c)
    this.dtriF(x, y, z, c)
    this.dtriG(x, y, z, c)
    this.dtriH(x, y, z, c)
    return this
  }

  shapeAt(x: number, y: number, z: number, style: Style) {
    if (!style.shape)
      return this.cubeAt(x, y, z, style.color ?? COLOR.DEFAULT_VOXEL)
    const shapeFn = this.shapeFnMap[style.shape].bind(this)
    return shapeFn(x, y, z, style.color ?? COLOR.DEFAULT_VOXEL)
  }
}
