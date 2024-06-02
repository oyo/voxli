import {
  AnimatedScene,
  InterpolatedSurface,
  SceneViewer,
  Simple3D,
  UserInput,
} from './main'

new SceneViewer(
  new AnimatedScene(new InterpolatedSurface(100, 3, 1)).start(1000),
  new Simple3D(document.body).setPos({ z: -120 }).setCamFov(90),
  new UserInput().setMove({ u: 10, v: 5, w: -2 })
)
