# voxli

A minimalistic, zero dependency 3d engine for simple voxel visualizations based on WebGL.

- [GitHub Repository](https://github.com/oyo/voxli)
- [Sample Application](https://oyo.github.io/voxli/)
- [NPM Package](https://www.npmjs.com/package/voxli)

![Sample Image](https://oyo.github.io/voxli/sample-2.png)

## Usage (Typescript, vite and yarn)

    yarn create vite sample-voxli --template vanilla-ts
    cd sample-voxli
    yarn
    yarn add voxli
    yarn dev
    # press o + Enter

You will see the Vite default app page. From there first
change `index.html` to remove any margins from the body:

```diff
- <body>
+ <body style="margin: 0; height: 100vh; overflow: hidden;">
```

Then go and overwrite `src/main.ts` with this:

    import { Viewer } from 'voxli'

    new Viewer([[[1, 0, 1]]])

In the browser you should now see a 3D rendering showing two cubes.

![Sample Image](https://oyo.github.io/voxli/sample-1.png)

Open the [Sample Application](https://oyo.github.io/voxli/) to see some examples
