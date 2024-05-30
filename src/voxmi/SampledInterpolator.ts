import { CubicInterpolator } from './CubicInterpolator'
import { DataModel } from './Types'

export class SampledInterpolator implements DataModel {
  data: number[][][]
  filter: boolean[][][] = []
  thres: number
  cubes: number = 0

  static createRandom(dim: number) {
    let samples = ~~(Math.random() * 2) + 2
    let segments = ~~(Math.random() * 2) + 3
    if (samples + segments > 5) {
      if (Math.random() > 0.5) samples--
      else segments--
    }
    return new SampledInterpolator(dim, segments, samples)
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
      //dm++;
    }
    const a = Math.floor(d / 3),
      b = Math.floor((2 * d) / 3) + 1
    this.thres =
      (this.data[a][a][a] +
        this.data[a][a][b] +
        this.data[a][b][a] +
        this.data[a][b][b] +
        this.data[b][a][a] +
        this.data[b][a][b] +
        this.data[b][b][a] +
        this.data[b][b][b]) /
      8
    /*
        for (x=0;x<d;x++)
            for (y=0;y<d;y++)
                for (z=0;z<d;z++)
                    this.data[x][y][z] /= samples;
        */
    this.doFilter(this.thres)
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
          c[i][j][k] = CubicInterpolator.getTricubic(
            m,
            u - 1,
            v - 1,
            w - 1,
            x,
            y,
            z
          )
        }
      }
    }
    return c
  }

  /*
	doFilter() {
		let x,y,z,d=this.data.length
		this.cubes = 0
		this.filter = new Array(d)
		for (x=0;x<d;x++) {
			this.filter[x] = new Array(d)
			for (y=0;y<d;y++) {
				this.filter[x][y] = new Array(d)
				for (z=0;z<d;z++)
					if (this.filter[x][y][z] = this.data[x][y][z]>this.thres-0.015 && this.data[x][y][z]<this.thres+0.015)
						this.cubes++
			}
		}
		return this
	}
    */

  doFilter(thres: number, eps: number = 0.0035) {
    return this.data.map((z) =>
      z.map((y) => y.map((x) => (x > thres - eps && x < thres + eps ? 1 : 0)))
    )
  }

  doFilterSphere() {
    let x, y, z, dx, dy, dz, x2, y2, z2
    const d = this.data.length
    const dh = d >> 1
    const d2 = dh * dh
    this.cubes = 0
    this.filter = new Array(d)
    for (x = 0; x < d; x++) {
      dx = x - dh
      x2 = dx * dx
      this.filter[x] = new Array(d)
      for (y = 0; y < d; y++) {
        dy = y - dh
        y2 = dy * dy
        this.filter[x][y] = new Array(d)
        for (z = 0; z < d; z++) {
          dz = z - dh
          z2 = dz * dz
          if ((this.filter[x][y][z] = x2 + y2 + z2 < d2)) this.cubes++
        }
      }
    }
    return this
  }

  getData() {
    return this.doFilter(this.thres, 0.006)
  }

  step() {
    this.thres += 0.0001
    while (this.thres > 0.3) this.thres -= 0.3
  }
}
