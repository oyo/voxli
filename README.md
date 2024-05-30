# voxmi

A minimalistic, zero dependency 3d engine for simple voxel visualizations based on WebGL.

[Sample Application](https://oyo.github.io/voxmi/)

![Sample Image](https://oyo.github.io/voxmi/sample-2.png)

## Usage (Typescript, vite and yarn)

    yarn create vite sample-voxmi --template vanilla-ts
    cd sample-voxmi
    yarn
    yarn add voxmi
    yarn dev
    # press o + Enter

You will see the Vite default app page. From there first
change `index.html` to remove any margins from the body:

```diff
- <body>
+ <body style="margin: 0; overflow: hidden;">
```

Then go and overwrite `src/main.ts` with this:

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

You should see a 3D rendering of your 3 x 3 x 3 data matrix.

![Sample Image](https://oyo.github.io/voxmi/sample-1.png)

Now take this more sophisticated example:

    import { AnimatedScene,SampledInterpolator, SceneViewer, Simple3D, UserInput } from 'voxmi'

    new SceneViewer(
      new AnimatedScene(new SampledInterpolator(60, 3, 1)),
      new Simple3D().setPos({ x: 0, y: 0, z: -140 }).setCamFov(40),
      new UserInput().setMove({ u: 10, v: 5, w: -2 })
    )

You should see the content similar to the sample application above.
