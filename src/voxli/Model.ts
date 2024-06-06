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
