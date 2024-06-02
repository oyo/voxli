import { Model } from './Model'
import type { Color } from './Types'

export class QuadModel extends Model {
  shade = { xm: 0.5, xp: 0.7, ym: 0.3, yp: 0.9, zm: 0.4, zp: 0.8 }

  constructor() {
    super()
  }

  quadXM(x: number, y: number, z: number, c: Color) {
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade.xm,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y, z1, x, y1, z1, x, y, z, x, y1, z1, x, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadXP(x: number, y: number, z: number, c: Color) {
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade.xp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z1, x, y, z1, x, y, z, x, y1, z, x, y1, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYM(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade.ym,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z, x1, y, z1, x, y, z, x1, y, z1, x, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYP(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade.yp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z1, x1, y, z, x, y, z, x, y, z1, x1, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZM(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade.zm,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z, x1, y1, z, x, y, z, x1, y1, z, x1, y, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZP(x: number, y: number, z: number, c: Color) {
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade.zp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y1, z, x, y1, z, x, y, z, x1, y, z, x1, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  cubeAt(x: number, y: number, z: number, c: Color) {
    this.quadXP(x + 1, y, z, c)
    this.quadYP(x, y + 1, z, c)
    this.quadZP(x, y, z + 1, c)
    this.quadXM(x, y, z, c)
    this.quadYM(x, y, z, c)
    this.quadZM(x, y, z, c)
  }
}
