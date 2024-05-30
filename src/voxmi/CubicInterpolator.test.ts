import { CubicInterpolator } from './CubicInterpolator'

it('calculates cubic interpolation', () => {
  expect(CubicInterpolator.getCubicArr([0, 1, 2, 3], 0)).toBe(1)
  expect(CubicInterpolator.getCubicArr([0, 1, 2, 3], 0.5)).toBe(1.5)
  expect(CubicInterpolator.getCubicArr([0, 1, 2, 3], 1)).toBe(2)
})
