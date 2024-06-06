import { Model, ModelListener } from './Model'
import { VoxelScene } from './VoxelScene'
import { Simple3D } from './Simple3D'
import { MouseStatusType, UserInput, UserInputListener } from './UserInput'

export class Viewer implements UserInputListener, ModelListener {
  output: Simple3D
  model: Model

  constructor(data: Model | number[][][], node?: HTMLElement | null) {
    const parent = node ?? document.body
    new UserInput().bindTo(parent).addListener(this)
    this.output = new Simple3D(parent)
      .setCameraPos({ z: -6 })
      .setCamera({ fov: 60 })
    this.model = Array.isArray(data)
      ? new VoxelScene().addListener(this).setData(data)
      : data.addListener(this).updateModel()
  }

  keysChanged(keyMask: number) {
    if (keyMask === 0) return
    //console.log(keyMask)
    const speed = 0.5
    const pos = { x: 0, y: 0, z: 0 }
    if (keyMask & 1) pos.x += -speed
    if (keyMask & 2) pos.y += speed
    if (keyMask & 4) pos.x += speed
    if (keyMask & 8) pos.y += -speed
    this.output?.updateCameraPos(pos)
  }

  mouseChanged(vector: MouseStatusType) {
    this.output?.updateCameraRot({ x: vector.v / 360, y: vector.u / 360 })
  }

  zoomChanged(z: number) {
    this.output?.updateCameraPos({ z: -z * 0.2 })
  }

  modelChanged(model: Model) {
    this.output?.setModel(model)
  }
}
