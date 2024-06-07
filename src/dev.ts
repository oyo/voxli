import {
  COLOR,
  ConwayCubes,
  Gradient,
  InterpolatedSurface,
  Shape,
  UserInput,
  UserInputListener,
  Viewer,
  VoxelScene,
} from './main'

// blind code to have imports for samples
{
  const sample = document.getElementById('sample')!
  new Viewer([[[1, 0, 1]]], sample)

  class Sample extends VoxelScene implements UserInputListener {
    data = [[[1]]]
    style = { 1: { shape: Shape.DIAMOND, color: COLOR.YELLOW } }
    constructor() {
      super()
      new UserInput().bindTo(sample).addListener(this)
      this.updateModel()
    }
    keysChanged() {}
  }
  new Sample()
  new ConwayCubes()
  InterpolatedSurface.createRandom(10)
  new Gradient()
}
// end blind code

const getNodeOrViewable = (c) =>
  Object.prototype.hasOwnProperty.call(c, 'view') ? c.view : c

const getTextNode = (c, tc) =>
  document.createTextNode(tc === 'string' ? c : '' + c)

const append = (n, c) => {
  Array.isArray(c) || (c = [c])
  c.forEach((ci) => {
    const tc = typeof ci
    if (tc !== 'undefined')
      try {
        n.appendChild(
          tc === 'object' ? getNodeOrViewable(ci) : getTextNode(ci, tc)
        )
      } catch (e) {
        // ignore
      }
  })
  return n
}

const N = (tag, c?, att?) => {
  const n = document.createElement(tag)
  att && Object.entries(att).forEach((a) => n.setAttribute(a[0], a[1]))
  if (typeof c === 'undefined' || c === null || c === false) return n
  return append(n, c)
}

const addEvents = (node, evts) => {
  Object.keys(evts).forEach((key) => node.addEventListener(key, evts[key]))
  return node
}

const runCode = (i: number) => {
  try {
    eval((document.getElementById(`code${i}`) as HTMLTextAreaElement)!.value)
  } catch (e) {
    // ignore
  }
}

function debounce(func, timeout = 2000) {
  let timer: NodeJS.Timeout
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), timeout)
  }
}

const samples = [
  `new Viewer(
  [[[1, 0, 1]]],
  document.getElementById('sample')
)`,
  `class CustomScene extends VoxelScene {
  data = [[[1, 2, 3]]]
  style = {
    1: { shape: Shape.CUBE, color: COLOR.RED },
    2: { shape: Shape.DIAMOND, color: COLOR.YELLOW },
    3: { shape: Shape.STAR, color: COLOR.GREEN },
  }
}
new Viewer(
  new CustomScene(),
  document.getElementById('sample')
)`,
  `class CustomScene extends VoxelScene {
  data = [
    [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
  ]
  style = {
    2: { shape: Shape.DIAMOND, color: COLOR.YELLOW },
  }
  start() {
    setInterval(this.step.bind(this), 800)
    return this
  }
  step() {
    this.data[1][1][1] = this.data[1][1][1] ? 0 : 2
    this.updateModel()
  }
}
new Viewer(
  new CustomScene().start(),
  document.getElementById('sample')
)`,
  `new Viewer(
  InterpolatedSurface.createRandom(100).doFilter(),
  document.getElementById('sample')
)`,
  `class TextureScene extends VoxelScene {
  data = new InterpolatedSurface(80, 2, 2).doFilterSphere()
  style = new Gradient().getColorStyle(COLOR.LIGHTSKYBLUE)
}
new Viewer(
  new TextureScene(),
  document.getElementById('sample')
)`,
  `class ConwayScene extends VoxelScene {
  counter = 35
  constructor() {
    super()
    this.game = new ConwayCubes()
    this.data = this.game.getData()
    setInterval(this.step.bind(this), 800)
  }
  step() {
    if (--this.counter > 0)
      this.game.step()
    else {
      this.counter = 35
      this.game.init()
    }
    this.data = this.game.getData()
    this.updateModel()
  }
}
new Viewer(
  new ConwayScene(),
  document.getElementById('sample')
)`,
].map((source, i) => source.trim().replace('sample', `sample${i}`))

document.body.removeChild(document.getElementsByClassName('samples')[0])
document.body.appendChild(
  N(
    'ul',
    samples.map((source, i) =>
      N('li', [
        addEvents(
          N('textarea', source, {
            class: 'code',
            id: `code${i}`,
            tabindex: i * 2 + 1,
          }),
          {
            keyup: debounce(() => runCode(i)),
          }
        ),
        N('div', null, {
          class: 'sample',
          id: `sample${i}`,
          tabindex: i * 2 + 2,
        }),
      ])
    ),
    { class: 'samples' }
  )
)

samples.forEach((_, i) => runCode(i))

document.getElementById('code0')?.focus()
