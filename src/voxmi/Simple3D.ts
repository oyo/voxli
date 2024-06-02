import type { Model } from './Model'
import type { Color, Vector2, Vector3 } from './Types'

export class Simple3D {
  parent: HTMLElement
  cam = { fov: 40 }
  pos: Vector3 = { x: 0, y: 0, z: -20 }
  rot: Vector2 = { x: 0, y: 0 }
  col: Color = { r: 0.7, g: 0.9, b: 1, a: 1 } //{ r: 0.059, g: 0.059, b: 0.137, a: 1 }//{ r: 0, g: 0.1, b: 0.25, a: 1 } // { r: 0.9, g: 0.95, b: 1, a: 1 }
  rMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  mode = true
  uniRM: WebGLUniformLocation | null = null
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  shader: WebGLProgram | null = null
  vertexPositionAttribute: number = 0
  vertexColorAttribute: number = 0
  scene: Model | null = null
  pMatrix: Float32Array = new Float32Array()
  resizeTimer: NodeJS.Timeout | null = null
  numItems: number = 0

  constructor(parent: HTMLElement) {
    this.parent = parent
    this.canvas = document.createElement('canvas')
    try {
      this.gl = this.canvas.getContext('webgl') ?? new WebGLRenderingContext()
    } catch (e) {
      alert('WebGL not initialized!')
      this.gl = new WebGLRenderingContext()
      return
    }
    this.gl.clearColor(this.col.r, this.col.g, this.col.b, this.col.a ?? 0)
    this.gl.clearDepth(1)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.parent.appendChild(this.canvas)
    this.initShaders()
    this.parent.addEventListener('resize', this.requestResize.bind(this))
    window.addEventListener('resize', this.requestResize.bind(this))
    requestAnimationFrame(this.render.bind(this))
  }

  initShaders() {
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

  getShader(type: number, source: string) {
    const s = this.gl.createShader(type) ?? new WebGLShader()
    this.gl.shaderSource(s, source)
    this.gl.compileShader(s)
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
      alert('GLSL compile error:\n' + this.gl.getShaderInfoLog(s))
    return s
  }

  perspective(fov: number, aspect: number, near: number, far: number) {
    const f = 1.0 / Math.tan((fov * Math.PI) / 360)
    const ri = 1 / (near - far)
    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * ri,
      -1,
      0,
      0,
      near * far * ri * 2,
      0,
    ]
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    if (!this.scene) return
    const cx = Math.cos(this.rot.x),
      sx = Math.sin(this.rot.x),
      cy = Math.cos(this.rot.y),
      sy = Math.sin(this.rot.y),
      r = this.rMatrix
    r[0] = cy
    r[1] = sx * sy
    r[2] = -cx * sy
    r[5] = cx
    r[6] = sx
    r[8] = sy
    r[9] = -sx * cy
    r[10] = cx * cy
    r[12] = this.pos.x
    r[13] = this.pos.y
    r[14] = this.pos.z
    this.gl.uniformMatrix4fv(this.uniRM, false, r)
    this.gl.drawArrays(
      this.mode ? this.gl.TRIANGLES : this.gl.LINES,
      0,
      this.numItems
    )
    requestAnimationFrame(this.render.bind(this))
  }

  requestResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(this.resize.bind(this), 30)
  }

  resize() {
    this.canvas.width = this.parent.clientWidth
    this.canvas.height = this.parent.clientHeight
    this.pMatrix = new Float32Array(
      this.perspective(
        this.cam.fov,
        this.canvas.width / this.canvas.height,
        0.5,
        1000
      )
    )
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    if (this.shader)
      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(this.shader, 'uPMatrix'),
        false,
        this.pMatrix
      )
  }

  setScene(scene: Model) {
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
    this.scene = scene
    arrayToBuffer(scene.c, 3, this.vertexColorAttribute)
    arrayToBuffer(scene.v, 3, this.vertexPositionAttribute)
    this.numItems = scene.v.length / 3
    return this
  }

  setCamFov(fov: number) {
    this.cam.fov = fov
    this.resize()
    return this
  }

  setPos(p: Partial<Vector3>) {
    this.pos = { ...this.pos, ...p }
    return this
  }

  setRot(r: Partial<Vector2>) {
    this.rot = { ...this.rot, ...r }
    return this
  }

  updatePos(c: number[]) {
    this.pos.x += c[0]
    this.pos.y += c[1]
    this.pos.z += c[2]
    if (this.pos.z > 0) this.pos.z = 0
    return this
  }

  updateRot(r: number[]) {
    this.rot.y += r[0] / 360
    this.rot.x += r[1] / 360
    if (this.rot.x > Math.PI / 2) this.rot.x = Math.PI / 2
    else if (this.rot.x < -Math.PI / 2) this.rot.x = -Math.PI / 2
    return this
  }
}
