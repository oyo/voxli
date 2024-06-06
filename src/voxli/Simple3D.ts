import {
  COLOR,
  type Camera,
  type Color,
  type Vector2,
  type Vector3,
} from '../voxli/Types'
import { Model } from './Model'

export class Simple3D {
  parent: HTMLElement
  cam: Camera = { fov: 60, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0 } }
  background: Color = COLOR.DEFAULT_BACKGROUND
  rMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  pMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 1])
  uniRM: WebGLUniformLocation | null = null
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  shader: WebGLProgram | null = null
  vertexPositionAttribute: number = 0
  vertexColorAttribute: number = 0
  model: Model = new Model()
  resizeTimer: NodeJS.Timeout | null = null
  numItems: number = 0

  constructor(parent?: HTMLElement) {
    this.parent = parent ?? document.body
    this.canvas = document.createElement('canvas')
    while (this.parent.firstChild)
      this.parent.removeChild(this.parent.firstChild)
    this.parent.appendChild(this.canvas)
    try {
      this.gl = this.canvas.getContext('webgl') ?? new WebGLRenderingContext()
    } catch (e) {
      alert('WebGL not initialized!')
      this.gl = new WebGLRenderingContext()
      return
    }
    this.setBackgroundColor(this.background)
    this.gl.clearDepth(1)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.initShaders()
    window.addEventListener('resize', this.requestResize.bind(this))
    requestAnimationFrame(this.render.bind(this))
  }

  private initShaders() {
    const sh = this.gl.createProgram() ?? new WebGLProgram()
    const vs = this.getShader(
      this.gl.VERTEX_SHADER,
      `attribute vec3 aPos;
attribute vec4 aCol;
uniform mat4 uMVMatrix,uPMatrix;
varying vec4 vColor;
void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aPos, 1.0);
  vColor = aCol;
}`
    )
    const fs = this.getShader(
      this.gl.FRAGMENT_SHADER,
      `varying lowp vec4 vColor;
void main(void) {
	gl_FragColor = vColor;
}`
    )
    this.gl.attachShader(sh, vs)
    this.gl.attachShader(sh, fs)
    this.gl.linkProgram(sh)
    if (!this.gl.getProgramParameter(sh, this.gl.LINK_STATUS))
      alert('Shaders not initialized!')
    this.gl.useProgram(sh)
    this.vertexPositionAttribute = this.gl.getAttribLocation(sh, 'aPos')
    this.vertexColorAttribute = this.gl.getAttribLocation(sh, 'aCol')
    this.uniRM = this.gl.getUniformLocation(sh, 'uMVMatrix')
    this.shader = sh
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute)
    this.gl.enableVertexAttribArray(this.vertexColorAttribute)
  }

  private getShader(type: number, source: string) {
    const s = this.gl.createShader(type) ?? new WebGLShader()
    this.gl.shaderSource(s, source)
    this.gl.compileShader(s)
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
      alert('GLSL compile error:\n' + this.gl.getShaderInfoLog(s))
    return s
  }

  private perspective(fov: number, aspect: number, near: number, far: number) {
    const f = 1.0 / Math.tan((fov * Math.PI) / 360)
    const ri = 1 / (near - far)
    const p = this.pMatrix
    p[0] = f / aspect
    p[5] = f
    p[10] = (near + far) * ri
    p[14] = near * far * ri * 2
  }

  private render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    const cx = Math.cos(this.cam.rot.x),
      sx = Math.sin(this.cam.rot.x),
      cy = Math.cos(this.cam.rot.y),
      sy = Math.sin(this.cam.rot.y),
      r = this.rMatrix
    r[0] = cy
    r[1] = sx * sy
    r[2] = -cx * sy
    r[5] = cx
    r[6] = sx
    r[8] = sy
    r[9] = -sx * cy
    r[10] = cx * cy
    r[12] = this.cam.pos.x
    r[13] = this.cam.pos.y
    r[14] = this.cam.pos.z
    this.gl.uniformMatrix4fv(this.uniRM, false, r)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numItems)
    requestAnimationFrame(this.render.bind(this))
  }

  private requestResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(this.resize.bind(this), 10)
  }

  private resize() {
    const cs = getComputedStyle(this.parent)
    const px = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
    const py = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    const bx = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
    const by = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    this.canvas.width = this.parent.clientWidth - px - bx
    this.canvas.height = this.parent.clientHeight - py - by
    this.perspective(
      this.cam.fov,
      this.canvas.width / this.canvas.height,
      -0.4,
      1000
    )
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    if (!this.shader) return
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.shader, 'uPMatrix'),
      false,
      this.pMatrix
    )
  }

  setModel(model: Model) {
    const arrayToBuffer = (arr: number[], itemSize: number, ptr: number) => {
      const buf = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf)
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(arr),
        this.gl.STATIC_DRAW
      )
      this.gl.vertexAttribPointer(ptr, itemSize, this.gl.FLOAT, false, 0, 0)
      return buf
    }
    this.model = model
    arrayToBuffer(model.c, 3, this.vertexColorAttribute)
    arrayToBuffer(model.v, 3, this.vertexPositionAttribute)
    this.numItems = model.v.length / 3
    return this
  }

  setBackgroundColor(color: Color) {
    this.background = color
    this.gl.clearColor(color.r, color.g, color.b, color.a ?? 1)
    return this
  }

  setCamera(camera: Partial<Camera>) {
    this.cam = { ...this.cam, ...camera }
    this.resize()
    return this
  }

  setCameraPos(p: Partial<Vector3>) {
    this.cam.pos = { ...this.cam.pos, ...p }
    return this
  }

  setCameraRot(r: Partial<Vector2>) {
    this.cam.rot = { ...this.cam.rot, ...r }
    return this
  }

  updateCameraPos(pos: Partial<Vector3>) {
    this.cam.pos.x += pos.x ?? 0
    this.cam.pos.y += pos.y ?? 0
    this.cam.pos.z += pos.z ?? 0
    if (this.cam.pos.z > 0) this.cam.pos.z = 0
    return this
  }

  updateCameraRot(rot: Partial<Vector3>) {
    this.cam.rot.y += rot.y ?? 0
    this.cam.rot.x += rot.x ?? 0
    if (this.cam.rot.x > Math.PI / 2) this.cam.rot.x = Math.PI / 2
    else if (this.cam.rot.x < -Math.PI / 2) this.cam.rot.x = -Math.PI / 2
    return this
  }
}
