export type MouseStatusType = {
  button: boolean
  x: number
  y: number
  u: number
  v: number
  w: number
  max?: number
}

export interface UserInputListener {
  keysChanged?: (mask: number) => void
  mouseChanged?: (status: MouseStatusType) => void
  zoomChanged?: (y: number) => void
}

export const KEYS: Array<number> = [
  37, //left
  38, //up
  39, //right
  40, //down
].concat(new Array(26).fill(0).map((_, i) => i + 65)) //a-z

export class UserInput {
  mouse: MouseStatusType = {
    button: false,
    x: 0,
    y: 0,
    u: 0,
    v: 0,
    w: 0,
    max: 70,
  }
  keyMap: Record<number, number> = this.generateKeyMap()
  keyMask: number = 0
  listener: UserInputListener[] = []
  keyTimer: NodeJS.Timeout | undefined
  slowDownTimer: NodeJS.Timeout | undefined

  bindTo(node: HTMLElement | null) {
    const parent = node ?? document.body
    parent.addEventListener('mousedown', this.mouseDown.bind(this))
    parent.addEventListener('mouseup', this.mouseUp.bind(this))
    parent.addEventListener('mouseout', this.mouseUp.bind(this))
    parent.addEventListener('mousemove', this.mouseMove.bind(this))
    parent.addEventListener('keydown', this.keyDown.bind(this))
    parent.addEventListener('keyup', this.keyUp.bind(this))
    parent.addEventListener('wheel', this.mouseWheel.bind(this))
    parent.addEventListener('touchstart', this.touch2Mouse.bind(this), true)
    parent.addEventListener('touchmove', this.touch2Mouse.bind(this), true)
    parent.addEventListener('touchend', this.touch2Mouse.bind(this), true)
    this.mouseUp()
    this.startKeyTimer()
    return this
  }

  private generateKeyMap() {
    return KEYS.reduce((acc: Record<number, number>, key, i) => {
      acc[key] = 1 << i
      return acc
    }, {})
  }

  private touch2Mouse(evt: TouchEvent) {
    const touch = evt.changedTouches[0]
    let mouseEv
    switch (evt.type) {
      case 'touchstart':
        mouseEv = 'mousedown'
        break
      case 'touchend':
        mouseEv = 'mouseup'
        break
      case 'touchmove':
        mouseEv = 'mousemove'
        break
      default:
        return
    }
    const mouseEvent = document.createEvent('MouseEvent')
    mouseEvent.initMouseEvent(
      mouseEv,
      true,
      true,
      window,
      1,
      touch.screenX << 1,
      touch.screenY << 1,
      touch.clientX << 1,
      touch.clientY << 1,
      false,
      false,
      false,
      false,
      0,
      null
    )
    touch.target.dispatchEvent(mouseEvent)
    evt.preventDefault()
  }

  private mouseWheel(evt: WheelEvent) {
    this.fireZoomChanged(evt.deltaY)
    evt.preventDefault()
  }

  private mouseMove(evt: MouseEvent) {
    if (!this.mouse.button) return
    this.mouse.u = evt.clientX - this.mouse.x
    this.mouse.v = evt.clientY - this.mouse.y
    if (this.mouse.max) {
      if (this.mouse.u > this.mouse.max) this.mouse.u = this.mouse.max
      else if (this.mouse.u < -this.mouse.max) this.mouse.u = -this.mouse.max
      if (this.mouse.v > this.mouse.max) this.mouse.v = this.mouse.max
      else if (this.mouse.v < -this.mouse.max) this.mouse.v = -this.mouse.max
    }
    this.move()
    this.mouse.x = evt.clientX
    this.mouse.y = evt.clientY
    evt.preventDefault()
  }

  private slowDown() {
    this.mouse.u *= 0.98
    this.mouse.v *= 0.9
    this.mouse.w *= 0.9
    let stop = true
    if (
      this.mouse.u > 1 ||
      this.mouse.v > 1 ||
      this.mouse.u < -1 ||
      this.mouse.v < -1
    ) {
      this.move()
      stop = false
    }
    if (this.mouse.w > 1 || this.mouse.w) {
      this.fireZoomChanged(this.mouse.w)
      stop = false
    }
    if (stop) clearInterval(this.slowDownTimer)
  }

  private move() {
    this.fireMouseChanged()
    return this
  }

  private mouseDown(evt: MouseEvent) {
    this.mouse.button = true
    this.mouse.x = evt.clientX
    this.mouse.y = evt.clientY
    this.mouse.u = 0
    this.mouse.v = 0
    clearInterval(this.slowDownTimer)
  }

  private mouseUp() {
    this.mouse.button = false
    this.slowDownTimer = setInterval(this.slowDown.bind(this), 20)
  }

  private keyDown(evt: KeyboardEvent) {
    this.keyMask |= this.keyMap[evt.keyCode]
    if (!this.keyTimer) this.startKeyTimer()
  }

  private keyUp(evt: KeyboardEvent) {
    this.keyMask = this.keyMask & ~this.keyMap[evt.keyCode]
    if (this.keyMask === 0) {
      clearInterval(this.keyTimer)
      this.keyTimer = undefined
    }
  }

  private startKeyTimer() {
    if (this.keyTimer) return
    this.keyTimer = setInterval(this.fireKeysChanged.bind(this), 10)
  }

  setMove(move: Partial<MouseStatusType>) {
    this.mouse = {
      ...this.mouse,
      ...move,
    }
    return this.move()
  }

  addListener(l: UserInputListener) {
    if (!this.listener.includes(l)) this.listener.push(l)
    l.keysChanged?.(this.keyMask)
    l.mouseChanged?.(this.mouse)
    l.zoomChanged?.(this.mouse.w)
    return this
  }

  fireKeysChanged() {
    this.listener.forEach((l) => l.keysChanged?.(this.keyMask))
  }

  fireMouseChanged() {
    this.listener.forEach((l) => l.mouseChanged?.(this.mouse))
  }

  fireZoomChanged(y: number) {
    this.listener.forEach((l) => l.zoomChanged?.(y))
  }
}
