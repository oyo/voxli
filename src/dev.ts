import { SceneViewer, Scene, Simple3D, UserInput } from './main'

const dataModel = {
  getData: () => [
    [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
    ],
  ],
}

new SceneViewer(
  new Scene(dataModel),
  new Simple3D().setPos({ x: 0, y: 0, z: -15 }).setCamFov(40),
  new UserInput().setMove({ u: -45, v: -8, w: -2 })
)
