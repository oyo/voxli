export enum Shape {
  EMPTY = 'EMPTY',
  CUBE = 'CUBE',
  STAR = 'STAR',
  DIAMOND = 'DIAMOND',
}

export type DataType = string | number | Shape

export type Vector2 = { x: number; y: number }
export type Vector3 = Vector2 & { z: number }
export type Color = {
  r: number
  g: number
  b: number
  a?: number
}

export const COLOR: Record<string, Color> = {
  DEFAULT_BACKGROUND: { r: 0.37, g: 0.62, b: 0.63 }, //{ r: 0.059, g: 0.059, b: 0.137, a: 1 }//{ r: 0, g: 0.1, b: 0.25, a: 1 } // { r: 0.9, g: 0.95, b: 1, a: 1 }
  DEFAULT_VOXEL: { r: 0.8, g: 0.5, b: 0.2 },
  WHITE: { r: 1, g: 1, b: 1 },
  BLACK: { r: 0, g: 0, b: 0 },
  RED: { r: 1, g: 0, b: 0 },
  GREEN: { r: 0, g: 1, b: 0 },
  BLUE: { r: 0, g: 0, b: 1 },
  YELLOW: { r: 1, g: 1, b: 0 },
  CYAN: { r: 0, g: 1, b: 1 },
  MAGENTA: { r: 1, g: 0, b: 1 },
  ORANGE: { r: 1, g: 0.5, b: 0 },
  GRAY: { r: 0.5, g: 0.5, b: 0.5 },
  CADETBLUE: { r: 0.372, g: 0.619, b: 0.627 },
  LIGHTSKYBLUE: { r: 0.529, g: 0.808, b: 0.98 },
}

export type Camera = {
  pos: Vector3
  rot: Vector2
  fov: number
}

export type Style = {
  color?: Color
  shape?: Shape
}

export type StyleMap = Record<DataType, Style>
