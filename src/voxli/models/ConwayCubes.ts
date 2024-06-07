import { Vector3 } from '../Types'

export type CountFunction = (
  p: number[][][],
  z: number,
  y: number,
  x: number
) => number
export type EvalFunction = (s: number, c: number) => number

export class ConwayCubes {
  board: Array<number[][][]> = []
  dim: Vector3 = { x: 0, y: 0, z: 0 }
  input: string[]
  DIM = 33

  constructor(input?: string[]) {
    this.input = input ?? ['.#.', '..#', '###']
    this.init()
  }

  init() {
    const p = this.input
    const board = this.populate(this.DIM - 2, p)
    this.dim = {
      z: board.length - 2,
      y: board[0].length - 2,
      x: board[0][0].length - 2,
    }
    this.board = [this.clone(board), this.clone(board)]
    return this
  }

  private prepEmpty(d: number): number[][][] {
    return new Array(d + 2)
      .fill(true)
      .map(() =>
        new Array(d + 2).fill(true).map(() => new Array(d + 2).fill(0))
      )
  }

  private populate(dim: number, p: string[]): number[][][] {
    const board = this.prepEmpty(dim)
    const z0 = (dim >> 1) + 1
    const o = z0 - (p.length >> 1)
    for (let y = 0; y < p.length; y++)
      for (let x = 0; x < p.length; x++)
        board[z0][o + y][o + x] = p[y][x] === '#' ? 1 : 0
    return board
  }

  private clone(board: number[][][]) {
    return board.slice().map((y) => y.slice().map((x) => x.slice()))
  }

  private adjacentCount(
    p: number[][][],
    z: number,
    y: number,
    x: number
  ): number {
    return (
      p[z - 1][y - 1][x - 1] +
      p[z - 1][y - 1][x] +
      p[z - 1][y - 1][x + 1] +
      p[z - 1][y][x - 1] +
      p[z - 1][y][x] +
      p[z - 1][y][x + 1] +
      p[z - 1][y + 1][x - 1] +
      p[z - 1][y + 1][x] +
      p[z - 1][y + 1][x + 1] +
      p[z][y - 1][x - 1] +
      p[z][y - 1][x] +
      p[z][y - 1][x + 1] +
      p[z][y][x - 1] +
      p[z][y][x + 1] +
      p[z][y + 1][x - 1] +
      p[z][y + 1][x] +
      p[z][y + 1][x + 1] +
      p[z + 1][y - 1][x - 1] +
      p[z + 1][y - 1][x] +
      p[z + 1][y - 1][x + 1] +
      p[z + 1][y][x - 1] +
      p[z + 1][y][x] +
      p[z + 1][y][x + 1] +
      p[z + 1][y + 1][x - 1] +
      p[z + 1][y + 1][x] +
      p[z + 1][y + 1][x + 1]
    )
  }

  private evalstep(
    board: Array<number[][][]>,
    counter: CountFunction,
    evaluate: EvalFunction
  ) {
    board.push(board.shift()!)
    const p = board[0]
    const p1 = board[1]
    for (let z = 1; z < this.dim.z - 1; z++)
      for (let y = 1; y < this.dim.y - 1; y++)
        for (let x = 1; x < this.dim.x - 1; x++)
          p[z][y][x] = evaluate(p1[z][y][x], counter(p1, z, y, x))
    return this
  }

  private renderstep(counter: CountFunction, evaluate: EvalFunction) {
    this.evalstep(this.board, counter, evaluate)
    return this
  }

  step() {
    return this.renderstep(this.adjacentCount, (s, c) =>
      s === 1 && (c < 2 || c > 3) ? 0 : c === 3 ? 1 : s
    )
  }

  count(z: number[][][]) {
    return z.reduce(
      (a, y) => a + y.reduce((b, x) => b + x.filter((c) => c === 1).length, 0),
      0
    )
  }

  getData(): number[][][] {
    return this.board[0]
  }
}
