import { QuadModel } from './QuadModel'
import { ColorMapType, DataModel } from './Types'

export type SceneListener = { sceneChanged: (scene: Scene) => void }

export class Scene extends QuadModel {
  listener: SceneListener[] = []
  model: DataModel = { getData: () => [] }
  colorMap: ColorMapType = {
    0: { r: 0, g: 0, b: 0 },
    1: { r: 0.8, g: 0.5, b: 0.2 },
  }

  constructor(model: DataModel, colorMap?: ColorMapType) {
    super()
    this.setModel(model)
    this.colorMap = colorMap ?? this.colorMap
  }

  setModel(model: DataModel) {
    this.model = model
    this.create()
    this.fireSceneChanged()
    return this
  }

  create() {
    this.clear()
    const data = this.model.getData()
    const dz = data.length,
      dz2 = dz / 2.0,
      dy = data[0].length,
      dy2 = dy / 2.0,
      dx = data[0][0].length,
      dx2 = dx / 2.0
    for (let z = 0; z < dz; z++)
      for (let y = 0; y < dy; y++)
        for (let x = 0; x < dx; x++) {
          const d = data[z][y][x]
          if (d) {
            const c = this.colorMap[d]
            if (c) this.cubeAt(x - dx2, y - dy2, z - dz2, c)
          }
        }
    this.fireSceneChanged()
  }

  addListener(l: SceneListener) {
    this.listener.push(l)
    l.sceneChanged(this)
    return this
  }

  fireSceneChanged() {
    this.listener.forEach((l) => l.sceneChanged?.(this))
  }
}
