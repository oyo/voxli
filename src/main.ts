// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
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
} from '../lib/voxli'

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

//@ts-expect-error sample
const getNodeOrViewable = (c) =>
  Object.prototype.hasOwnProperty.call(c, 'view') ? c.view : c

//@ts-expect-error sample
const getTextNode = (c, tc) =>
  document.createTextNode(tc === 'string' ? c : '' + c)

//@ts-expect-error sample
const append = (n, c) => {
  const ca = Array.isArray(c) ? c : [c]
  ca.forEach((ci) => {
    const tc = typeof ci
    if (tc !== 'undefined')
      try {
        n.appendChild(
          tc === 'object' ? getNodeOrViewable(ci) : getTextNode(ci, tc)
        )
      } catch (e) {
        console.warn(e)
      }
  })
  return n
}

//@ts-expect-error sample
const N = (tag, c?, att?) => {
  const n = document.createElement(tag)
  if (att) Object.entries(att).forEach((a) => n.setAttribute(a[0], a[1]))
  if (typeof c === 'undefined' || c === null || c === false) return n
  return append(n, c)
}

//@ts-expect-error sample
const addEvents = (node, evts) => {
  Object.keys(evts).forEach((key) => node.addEventListener(key, evts[key]))
  return node
}

//@ts-expect-error sample
function debounce(func, timeout = 300) {
  let timer: NodeJS.Timeout
  //@ts-expect-error sample
  return (...args) => {
    clearTimeout(timer)
    //@ts-expect-error sample
    timer = setTimeout(() => func.apply(this, args), timeout)
  }
}

const samples = [
  `new Viewer(
  [[[1, 0, 1]]],
  document.getElementById('sample')
)
.input.setMove({u: -46.2, v: 12})`,
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

const changed = samples.map(() => false)

const setChanged = (i: number) => {
  if (changed[i]) return
  changed[i] = true
  const sample = document.getElementById(`sample${i}`)!
  sample.className += ' changed'
}

const runCode = (i: number) => {
  try {
    eval((document.getElementById(`code${i}`) as HTMLTextAreaElement)!.value)
  } catch (e) {
    console.warn(e)
  }
}

const checkChange = (i: number) => {
  const div = document.getElementById(`sample${i}`)!
  if (!changed[i]) return
  div.className = div.className.replace(' changed', '')
  changed[i] = false
  runCode(i)
}

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
            keypress: debounce(() => setChanged(i)),
            input: debounce(() => setChanged(i)),
            paste: debounce(() => setChanged(i)),
          }
        ),
        addEvents(
          N('div', null, {
            class: 'sample',
            id: `sample${i}`,
            tabindex: i * 2 + 2,
          }),
          {
            click: () => {
              const div = document.getElementById(`sample${i}`)!
              div.focus()
              checkChange(i)
            },
            focus: () => checkChange(i),
          }
        ),
      ])
    ),
    { class: 'samples' }
  )
)

samples.forEach((_, i) => runCode(i))

document.getElementById('code0')?.focus()
