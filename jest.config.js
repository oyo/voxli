/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+.(j|t)sx?$': ['ts-jest', {}],
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
}
