import type { Paintable } from "./anodized";
import { CubicBezierValue } from "./cubicBezierValue";
import { wave } from "./sineWave";

export default class FallingSand implements Paintable {
  cols = 32;
  rows = 156;
  particles: Array<number[]> = []
  particlesRef: Array<number[]> = []

  updateRef() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.particlesRef[i][j] = this.particles[i][j];
      }
    }
  }
  clearParticles() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.particles[i][j] = 0;
      }
    }
  }
  constructor() {
    this.particles = []
    this.particlesRef = []
    for (let i = 0; i < this.cols; i++) {
      this.particles.push([]);
      this.particlesRef.push([]);
      for (let j = 0; j < this.rows; j++) {
        this.particles[i].push(0);
        this.particlesRef[i].push(0);
      }
    }
    this.particles[1][0] = 1
    this.particles[1][this.rows - 1] = 1
  }

  distorsion = new CubicBezierValue([0.76, 0, 0.24, 1], 1.5);
  counter = 0;
  mouseIn = false;
  mouseClick = false;
  mousePos = [0, 0];

  setup(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    animation: { start(): void; stop(): void },
  ): void {
    ctx.strokeStyle = "oklch(54.6% 0.245 262.881)";
    ctx.fillStyle = "white"

    ctx.lineWidth = 2;

    canvas.addEventListener("mouseenter", () => {
      this.mouseIn = true;
    });
    canvas.addEventListener("mouseleave", () => {
      this.mouseIn = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      const elementRect = canvas.getBoundingClientRect()
      if (this.mouseIn) {
        this.mousePos = [e.clientX - elementRect.left, e.clientY - elementRect.top]
      }
    })
    canvas.addEventListener("mousedown", () => {
      this.mouseClick = true;
    });
    canvas.addEventListener("mouseup", () => {
      this.mouseClick = false;
    });
  }
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    this.counter++;
    if (1) {
      if (this.mouseIn && this.mouseClick && Math.round(this.mousePos[0] / 4) < this.cols) {
        console.log(Math.round(this.mousePos[0] / 4), Math.round(this.mousePos[1] / 4))
        this.particles[Math.round(this.mousePos[0] / 4)][Math.round(this.mousePos[1] / 4)] = 1
      }
      let takeLeft = Math.random() >= 0.5

      if (this.counter % 4 == 0) {
        this.particles[16][0] = 1
      }
      this.updateRef()
      this.clearParticles()

      for (let i = 0; i < this.cols; i++) {
        for (let j = this.rows - 1; j >= 0; j--) {
          // last row
          if (this.particlesRef[i][j] == 0) continue
          else if (j == this.rows - 1) {
            this.particles[i][j] = 1;
          }
          else if (this.particlesRef[i][j + 1] == 0) {
            this.particles[i][j + 1] = 1;
          }
          else if (i < this.cols - 1 && this.particlesRef[i + 1][j + 1] == 0 && !takeLeft) {
            this.particles[i + 1][j + 1] = 1;
          }
          else if (i > 0 && this.particlesRef[i - 1][j + 1] == 0) {
            this.particles[i - 1][j + 1] = 1;
          }
          else if (i < this.cols - 1 && this.particlesRef[i + 1][j + 1] == 0 && takeLeft) {
            this.particles[i + 1][j + 1] = 1;
          }
          else {
            this.particles[i][j] = 1;
          }
        }
      }
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.particles[i][j] == 1) {
          ctx.fillRect(i * 4, j * 4, 4, 4);
        }
      }
    }
    // ctx.fill()
  }
}
