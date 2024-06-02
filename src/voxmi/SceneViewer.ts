import { Scene, type SceneListener } from './Scene'
import { Simple3D } from './Simple3D'
import { MouseStatusType, UserInput, type UserInputListener } from './UserInput'

export class SceneViewer implements SceneListener, UserInputListener {
  input: UserInput
  output: Simple3D
  scene: Scene

  constructor(scene: Scene, output?: Simple3D, input?: UserInput) {
    this.input = (input ?? new UserInput()).addListener(this)
    this.output = output ?? new Simple3D(document.body)
    this.scene = scene.addListener(this)
  }

  keysChanged(keyMask: number) {
    const speed = 0.5
    const camEvent = [0, 0, 0]
    if (keyMask & 1) camEvent[0] = -speed
    if (keyMask & 2) camEvent[1] = -speed
    if (keyMask & 4) camEvent[0] = speed
    if (keyMask & 8) camEvent[1] = speed
    if (keyMask & 16) camEvent[2] = speed
    if (keyMask & 32) camEvent[2] = -speed
    this.output.updatePos(camEvent)
  }

  mouseChanged(vector: MouseStatusType) {
    this.output.updateRot([vector.u, vector.v])
  }

  zoomChanged(y: number) {
    this.output.updatePos([0, 0, -y * 0.2])
  }

  sceneChanged(scene: Scene) {
    this.output.setScene(scene)
  }
}
