import { Scene } from './Scene'
import { DataModel } from './Types'

export class AnimatedScene extends Scene {
  timer: NodeJS.Timeout | undefined

  constructor(model: DataModel) {
    super(model)
  }

  start(speed: number = 300) {
    this.stop()
    this.timer = setInterval(this.step.bind(this), speed)
    return this
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    return this
  }

  step() {
    if (!this.model) return this
    if (this.model.step) this.model.step()
    this.create()
    this.fireSceneChanged()
    return this
  }
}
