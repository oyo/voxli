export type DataType = string | number | symbol

export interface DataModel {
  getData: () => DataType[][][]
  step?: () => void
}

export type Vector2 = { x: number; y: number }
export type Vector3 = Vector2 & { z: number }
export type Color = {
  r: number
  g: number
  b: number
  a?: number
}

export type ColorMapType = Record<DataType, Color>
