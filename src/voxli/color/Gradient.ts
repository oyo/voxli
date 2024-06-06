export class Gradient {
  color: number[] = new Array(256)
  constructor() {
    let min = 1e9,
      max = -1e9,
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
  getColor(v: number) {
    return this.color[Math.floor(v * 255) % 256]
  }
}
