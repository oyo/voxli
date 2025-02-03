import { getTricubic } from './Interpolator'

export class InterpolatedSurface {
  data: number[][][]
  filter: number[][][] = []
  tolerance: number = 0.001
  cubes: number = 0

  static createRandom(dim: number) {
    let samples = ~~(Math.random() * 2) + 2
    let segments = ~~(Math.random() * 2) + 3
    if (samples + segments > 5) {
      if (Math.random() > 0.5) samples--
      else segments--
    }
    return new InterpolatedSurface(dim, segments, samples)
  }

  constructor(d: number, dm: number, samples: number) {
    let i, x, y, z

    this.data = new Array(d)
    for (x = 0; x < d; x++) {
      this.data[x] = new Array(d)
      for (y = 0; y < d; y++) {
        this.data[x][y] = new Array(d)
        for (z = 0; z < d; z++) this.data[x][y][z] = 0
      }
    }
    for (i = 0; i < samples; i++) {
      const master = new Array(dm)
      for (x = 0; x < dm; x++) {
        master[x] = new Array(dm)
        for (y = 0; y < dm; y++) {
          master[x][y] = new Array(dm)
          for (z = 0; z < dm; z++) master[x][y][z] = Math.random()
        }
      }
      const tdat = this.interpolateTricubic(master, d)
      for (y = 0; y < d; y++)
        for (x = 0; x < d; x++)
          for (z = 0; z < d; z++) this.data[x][y][z] += tdat[x][y][z] / dm
      dm = ((dm - 1) << 1) + 1
    }
  }

  private interpolateTricubic(m: number[][][], n: number) {
    let x, y, z, i, j, k, u, v, w, il, jl, kl
    const d = m.length - 1
    const l = d / n
    const c = new Array(n)
    for (i = 0; i < n; i++) {
      il = i * l
      u = ~~il
      x = il - u
      c[i] = new Array(n)
      for (j = 0; j < n; j++) {
        jl = j * l
        v = ~~jl
        y = jl - v
        c[i][j] = new Array(n)
        for (k = 0; k < n; k++) {
          kl = k * l
          w = ~~kl
          z = kl - w
          c[i][j][k] = getTricubic(m, u - 1, v - 1, w - 1, x, y, z)
        }
      }
    }
    return c
  }

  doNormalize8bit(data: number[][][]) {
    return data.map((z) => z.map((y) => y.map((x) => Math.floor(x * 255))))
  }

  doFilter(thres?: number, eps: number = this.tolerance) {
    const a = Math.floor(this.data.length / 3),
      b = Math.floor((2 * this.data.length) / 3) + 1
    if (!thres)
      thres =
        (this.data[a][a][a] +
          this.data[a][a][b] +
          this.data[a][b][a] +
          this.data[a][b][b] +
          this.data[b][a][a] +
          this.data[b][a][b] +
          this.data[b][b][a] +
          this.data[b][b][b]) /
        8

    return this.doNormalize8bit(
      this.data.map((z) =>
        z.map((y) => y.map((x) => (x > thres - eps && x < thres + eps ? 1 : 0)))
      )
    )
  }

  doFilterCube() {
    const dim = this.data.length
    return this.doNormalize8bit(
      this.data.map((z, zi) =>
        z.map((y, yi) =>
          y.map((x, xi) =>
            xi === 0 ||
            xi === dim - 1 ||
            yi === 0 ||
            yi === dim - 1 ||
            zi === 0 ||
            zi === dim - 1
              ? x
              : 0
          )
        )
      )
    )
  }

  doFilterSphere() {
    let x, y, z, dx, dy, dz, x2, y2, z2, ds
    const d = this.data.length
    const dh = d >> 1
    const d2 = dh * dh
    this.cubes = 0
    const filter = new Array(d)
    for (x = 0; x < d; x++) {
      dx = x - dh
      x2 = dx * dx
      filter[x] = new Array(d)
      for (y = 0; y < d; y++) {
        dy = y - dh
        y2 = dy * dy
        filter[x][y] = new Array(d)
        for (z = 0; z < d; z++) {
          dz = z - dh
          z2 = dz * dz
          ds = x2 + y2 + z2
          if (
            (filter[x][y][z] = ds < d2 && ds > d2 - d ? this.data[x][y][z] : 0)
          )
            this.cubes++
        }
      }
    }
    return this.doNormalize8bit(filter)
  }

  getData() {
    return this.data
  }
}
