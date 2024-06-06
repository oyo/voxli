export interface ModelListener {
  modelChanged: (model: Model) => void
}

export class Model {
  listener: ModelListener[] = []
  v: number[] = []
  c: number[] = []

  constructor() {
    this.updateModel()
  }

  clear() {
    this.v = []
    this.c = []
    this.fireModelChanged()
    return this
  }

  getBoundingBox() {
    const v = this.v
    const min = { x: Infinity, y: Infinity, z: Infinity }
    const max = { x: -Infinity, y: -Infinity, z: -Infinity }
    for (let i = 0; i < v.length; i += 3) {
      min.x = Math.min(min.x, v[i])
      min.y = Math.min(min.y, v[i + 1])
      min.z = Math.min(min.z, v[i + 2])
      max.x = Math.max(max.x, v[i])
      max.y = Math.max(max.y, v[i + 1])
      max.z = Math.max(max.z, v[i + 2])
    }
    return { min, max }
  }

  updateModel() {
    this.fireModelChanged()
    return this
  }

  addListener(l: ModelListener) {
    if (!this.listener.includes(l)) this.listener.push(l)
    l.modelChanged(this)
    return this
  }

  fireModelChanged() {
    this.listener.forEach((l) => l.modelChanged(this))
  }
}
