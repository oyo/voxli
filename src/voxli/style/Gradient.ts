import type { Color, StyleMap } from '../Types'

export class Gradient {
  color: number[] = new Array(256)

  constructor() {
    let min = Infinity,
      max = -Infinity,
      dir = true
    this.color[0] = 0
    for (let i = 1; i < 256; i++) {
      dir = Math.random() > 0.25 ? dir : !dir
      const c = this.color[i - 1] + (dir ? 0.1 : -0.1) * Math.random()
      if (c < min) min = c
      if (c > max) max = c
      this.color[i] = c
    }
    const d = max - min + 0.2
    for (let i = 0; i < 256; i++)
      this.color[i] = (this.color[(i + 128) % 256] - min) / d + 0.2
  }

  getColorStyle(col: Color): StyleMap {
    return this.color.reduce((a: StyleMap, c: number, i: number) => {
      a[i] = { color: { r: col.r * c, g: col.g * c, b: col.b * c } }
      return a
    }, {} as StyleMap)
  }

  getColor(v: number): number {
    return this.color[Math.floor(v * 255) % 256]
  }
}
