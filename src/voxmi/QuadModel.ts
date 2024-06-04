import { Model } from './Model'
import type { Color } from './Types'

export class QuadModel extends Model {
  shade = [
    [0.5, 0.3, 0.8],
    [0.7, 0.9, 0.4],
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

  constructor() {
    super()
  }

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

  cubeAt(x: number, y: number, z: number, c: Color) {
    this.quadXP(x + 1, y, z, c)
    this.quadYP(x, y + 1, z, c)
    this.quadZM(x, y, z + 1, c)
    this.quadXM(x, y, z, c)
    this.quadYM(x, y, z, c)
    this.quadZP(x, y, z, c)
    return this
  }

  // N = -1,+1,+1
  triA(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y + 1, z + 1, x + 1, y + 1, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,-1,+1
  triB(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x + 1, y + 1, z, x + 1, y, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,-1,-1
  triC(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x + 1, y, z + 1, x, y + 1, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,+1,-1
  triD(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y + 1, z + 1, x + 1, y, z + 1, x + 1, y + 1, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,-1,+1
  triE(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][0][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z + 1, x, y + 1, z, x + 1, y, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = -1,+1,-1
  triF(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][1][0],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z + 1, x + 1, y + 1, z + 1, x, y + 1, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,-1,-1
  triG(x: number, y: number, z: number, c: Color) {
    const f = this.ds[0][0][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z + 1, x + 1, y, z, x + 1, y + 1, z + 1)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }
  // N = +1,+1,+1
  triH(x: number, y: number, z: number, c: Color) {
    const f = this.ds[1][1][1],
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y + 1, z, x + 1, y + 1, z + 1, x + 1, y, z)
    for (let i = 0; i < 3; i++) this.c.push(...s)
  }

  starAt(x: number, y: number, z: number, c: Color) {
    this.triA(x, y, z, c)
    this.triB(x, y, z, c)
    this.triC(x, y, z, c)
    this.triD(x, y, z, c)
    this.triE(x, y, z, c)
    this.triF(x, y, z, c)
    this.triG(x, y, z, c)
    this.triH(x, y, z, c)
    return this
  }
}
