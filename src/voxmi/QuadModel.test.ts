import { QuadModel } from './QuadModel'

it('adds vertices and colors', () => {
  {
    const model = new QuadModel().cubeAt(0, 0, 0, { r: 0, g: 0, b: 0 })
    expect(model.v.length).toBe(108) // 6 faces * 6 vertices * 3 dimensions
    expect(model.c.length).toBe(108)
  }
  {
    const model = new QuadModel().starAt(0, 0, 0, { r: 0, g: 0, b: 0 })
    expect(model.v.length).toBe(72) // 8 faces * 3 vertices * 3 dimensions
    expect(model.c.length).toBe(72)
  }
})
