export const CubicInterpolator = {
  getCubicVal: function (
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    x: number
  ) {
    return (
      p1 +
      0.5 *
        x *
        (p2 -
          p0 +
          x *
            (2.0 * p0 -
              5.0 * p1 +
              4.0 * p2 -
              p3 +
              x * (3.0 * (p1 - p2) + p3 - p0)))
    )
  },
  getCubicArr: function (p: number[], x: number) {
    return this.getCubicVal(p[0], p[1], p[2], p[3], x)
  },
  getCubic: function (
    v: number[][][],
    i: number,
    j: number,
    k: number,
    x: number
  ) {
    const x0 = i < 0 ? 0 : i,
      x1 = i + 1 > v.length - 1 ? v.length - 1 : i + 1,
      x2 = i + 2 > v.length - 1 ? v.length - 1 : i + 2,
      x3 = i + 3 > v.length - 1 ? v.length - 1 : i + 3
    return this.getCubicVal(
      v[x0][j][k],
      v[x1][j][k],
      v[x2][j][k],
      v[x3][j][k],
      x
    )
  },
  getBicubic: function (
    v: number[][][],
    i: number,
    j: number,
    k: number,
    x: number,
    y: number
  ) {
    const y0 = j < 0 ? 0 : j,
      y1 = j + 1 > v.length - 1 ? v.length - 1 : j + 1,
      y2 = j + 2 > v.length - 1 ? v.length - 1 : j + 2,
      y3 = j + 3 > v.length - 1 ? v.length - 1 : j + 3
    return this.getCubicVal(
      this.getCubic(v, i, y0, k, x),
      this.getCubic(v, i, y1, k, x),
      this.getCubic(v, i, y2, k, x),
      this.getCubic(v, i, y3, k, x),
      y
    )
  },
  getTricubic: function (
    v: number[][][],
    i: number,
    j: number,
    k: number,
    x: number,
    y: number,
    z: number
  ) {
    const z0 = k < 0 ? 0 : k,
      z1 = k + 1 > v.length - 1 ? v.length - 1 : k + 1,
      z2 = k + 2 > v.length - 1 ? v.length - 1 : k + 2,
      z3 = k + 3 > v.length - 1 ? v.length - 1 : k + 3
    return this.getCubicVal(
      this.getBicubic(v, i, j, z0, x, y),
      this.getBicubic(v, i, j, z1, x, y),
      this.getBicubic(v, i, j, z2, x, y),
      this.getBicubic(v, i, j, z3, x, y),
      z
    )
  },
}
