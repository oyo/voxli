import {
  AnimatedScene,
  SampledInterpolator,
  SceneViewer,
  Simple3D,
  UserInput,
} from './main'

new SceneViewer(
  new AnimatedScene(new SampledInterpolator(60, 3, 1)).start(300),
  new Simple3D().setPos({ x: 0, y: 0, z: -140 }).setCamFov(40),
  new UserInput().setMove({ u: 10, v: 5, w: -2 })
)
