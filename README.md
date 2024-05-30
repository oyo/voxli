# voxmi

A minimalistic, zero dependency 3d engine for simple voxel visualizations based on WebGL.

[Sample Application](https://oyo.github.io/voxmi/)

![Sample Image](https://oyo.github.io/voxmi/sample.png)

## Usage (Typescript, vite and yarn)

    yarn create vite sample-voxmi --template vanilla-ts
    cd sample-voxmi
    yarn
    yarn add voxmi
    yarn dev
    # press o + Enter

Now go and overwrite `src/main.ts` with this:

    import { AnimatedScene,SampledInterpolator, SceneViewer, Simple3D, UserInput } from 'voxmi'

    new SceneViewer(
      new AnimatedScene(new SampledInterpolator(60, 3, 1)),
      new Simple3D().setPos({ x: 0, y: 0, z: -140 }).setCamFov(40),
      new UserInput().setMove({ u: 10, v: 5, w: -2 })
    )

and change `index.html` to this:

```diff
- <body>
+ <body style="margin: 0; overflow: hidden;">
```

You should see the content similar to the sample application above.
