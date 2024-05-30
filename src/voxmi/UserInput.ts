export type MouseStatusType = {
  button: boolean
  x: number
  y: number
  u: number
  v: number
  w: number
  max?: number
}

export type UserInputListener = {
  keysChanged?: (mask: number) => void
  mouseChanged?: (status: MouseStatusType) => void
  zoomChanged?: (y: number) => void
}

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
  keyMask: number = 0
  listener: UserInputListener[] = []
  keyTimer: NodeJS.Timeout | undefined
  slowDownTimer: NodeJS.Timeout | undefined

  constructor() {
    document.addEventListener('mousedown', this.mouseDown.bind(this))
    document.addEventListener('mouseup', this.mouseUp.bind(this))
    document.addEventListener('mouseout', this.mouseUp.bind(this))
    document.addEventListener('mousemove', this.mouseMove.bind(this))
    document.addEventListener('keydown', this.keyDown.bind(this))
    document.addEventListener('keyup', this.keyUp.bind(this))
    document.addEventListener('wheel', this.mouseWheel.bind(this))
    document.addEventListener('touchstart', this.touch2Mouse.bind(this), true)
    document.addEventListener('touchmove', this.touch2Mouse.bind(this), true)
    document.addEventListener('touchend', this.touch2Mouse.bind(this), true)
    this.mouseUp()
  }

  setMove(move: Partial<MouseStatusType>) {
    this.mouse = {
      ...this.mouse,
      ...move,
    }
    return this.move()
  }

  touch2Mouse(evt: TouchEvent) {
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

  mouseWheel(evt: WheelEvent) {
    this.fireZoomChanged(evt.deltaY)
  }

  mouseMove(evt: MouseEvent) {
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
  }

  slowDown() {
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

  move() {
    this.fireMouseChanged()
    return this
  }

  mouseDown(evt: MouseEvent) {
    this.mouse.button = true
    this.mouse.x = evt.clientX
    this.mouse.y = evt.clientY
    this.mouse.u = 0
    this.mouse.v = 0
    clearInterval(this.slowDownTimer)
  }

  mouseUp() {
    this.mouse.button = false
    this.slowDownTimer = setInterval(this.slowDown.bind(this), 20)
  }

  keyDown(evt: KeyboardEvent) {
    //console.log(evt.keyCode)
    switch (evt.keyCode) {
      case 37:
        this.startKeyTimer(1)
        break
      case 40:
        this.startKeyTimer(2)
        break
      case 39:
        this.startKeyTimer(4)
        break
      case 38:
        this.startKeyTimer(8)
        break
      case 187:
        this.startKeyTimer(16)
        break
      case 189:
        this.startKeyTimer(32)
        break
    }
  }

  keyUp(evt: KeyboardEvent) {
    switch (evt.keyCode) {
      case 37:
        this.keyMask &= ~1
        break //left
      case 40:
        this.keyMask &= ~2
        break //down
      case 39:
        this.keyMask &= ~4
        break //right
      case 38:
        this.keyMask &= ~8
        break //up
      case 187:
        this.keyMask &= ~16
        break //+
      case 189:
        this.keyMask &= ~32
        break //-
    }
  }

  startKeyTimer(mask: number) {
    this.keyMask |= mask
    if (this.keyTimer) return
    this.keyTimer = setInterval(this.processKeys.bind(this), 1)
  }

  processKeys() {
    if (this.keyMask === 0) {
      clearInterval(this.keyTimer)
      this.keyTimer = undefined
    }
    this.fireKeysChanged()
  }

  addListener(l: UserInputListener) {
    this.listener.push(l)
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
