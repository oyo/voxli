import { getCubicArr } from './Interpolator'

it('calculates cubic interpolation', () => {
  expect(getCubicArr([0, 1, 2, 3], 0)).toBe(1)
  expect(getCubicArr([0, 1, 2, 3], 0.5)).toBe(1.5)
  expect(getCubicArr([0, 1, 2, 3], 1)).toBe(2)
})
