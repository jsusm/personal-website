import type { Paintable } from "./anodized";
import { CubicBezierValue } from "./cubicBezierValue";



export default class RotatingCube implements Paintable {

  points = [
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
  ]

  projectionMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]

  angle = 0;
  angleBezier = new CubicBezierValue([0.45, 0.05, 0.55, 0.95], 1);
  touchBezier = new CubicBezierValue([0.68, -0.55, 0.27, 1.55], 0.5);

  colors = [
    "white",
    "oklch(54.6% 0.245 262.881)",
    "oklch(58.6% 0.253 17.585)",
    "oklch(68.1% 0.162 75.834)",
    "oklch(62.7% 0.194 149.214)"
  ]

  coloridx = 0;

  setup(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, animation: { start(): void; stop(): void; }): void {
    const elementRect = canvas.getBoundingClientRect()
    canvas.width = elementRect.width
    canvas.height = elementRect.height
    ctx.strokeStyle = "#fff"
    ctx.fillStyle = "#fff"
    ctx.lineWidth = 3
    ctx.translate(canvas.width / 2, canvas.height / 2);

    canvas.addEventListener("mouseenter", () => {
      this.angleBezier.active = true
    });
    canvas.addEventListener("mouseleave", () => {
      this.angleBezier.active = false
    });
    canvas.addEventListener("pointerdown", () => {
      this.touchBezier.active = true
      this.coloridx = (this.coloridx + 1) % this.colors.length;
      ctx.fillStyle = this.colors[this.coloridx]
      ctx.strokeStyle = this.colors[this.coloridx]
    })
  }
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle)
    const rotateZ = [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1],
    ]
    const rotateX = [
      [1, 0, 0],
      [0, cos, -sin],
      [0, sin, cos],
    ]
    const rotateY = [
      [cos, 0, sin],
      [0, 1, 0],
      [-sin, 0, cos],
    ]


    const rotation3d = this.matrixMult(rotateZ, this.matrixMult(rotateX, rotateY))
    const rotatedPoints = this.matrixMult(this.points, rotation3d)
    // const scaledPoints = this.matrixScale(100, rotatedPoints)


    let projectedPoints = Array(8).fill(0)

    for (let i = 0; i < rotatedPoints.length; i++) {
      const distance = 2;
      const z = 1 / (distance - rotatedPoints[i][2])

      const projectionMatrix = [
        [z, 0, 0],
        [0, z, 0],
        [0, 0, 0],
      ]
      projectedPoints[i] = this.matrixMult([[...rotatedPoints[i]]], projectionMatrix).flat()
    }

    if (this.touchBezier.time >= 1) {
      this.touchBezier.active = false
    }

    const scale = 280 - this.touchBezier.value() * 100

    projectedPoints = this.matrixScale(scale, projectedPoints)

    this.angle -= 0.005 + this.angleBezier.value() * 0.02;

    for (let point of projectedPoints) {
      ctx.beginPath()
      ctx.ellipse(point[0], point[1], 3, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    this.linePoint(ctx, projectedPoints[0], projectedPoints[1]);
    this.linePoint(ctx, projectedPoints[1], projectedPoints[2]);
    this.linePoint(ctx, projectedPoints[2], projectedPoints[3]);
    this.linePoint(ctx, projectedPoints[3], projectedPoints[0]);

    this.linePoint(ctx, projectedPoints[4], projectedPoints[5]);
    this.linePoint(ctx, projectedPoints[5], projectedPoints[6]);
    this.linePoint(ctx, projectedPoints[6], projectedPoints[7]);
    this.linePoint(ctx, projectedPoints[7], projectedPoints[4]);

    this.linePoint(ctx, projectedPoints[4], projectedPoints[0]);
    this.linePoint(ctx, projectedPoints[5], projectedPoints[1]);
    this.linePoint(ctx, projectedPoints[6], projectedPoints[2]);
    this.linePoint(ctx, projectedPoints[7], projectedPoints[3]);

  }

  linePoint(ctx: CanvasRenderingContext2D, p1: number[], p2: number[]) {
    ctx.beginPath()
    ctx.moveTo(p1[0], p1[1])
    ctx.lineTo(p2[0], p2[1])
    ctx.stroke()
  }

  matrixScale(scalar: number, m: number[][]): number[][] {
    const rows = m.length;
    const cols = m[0]?.length || 0;

    const result: number[][] = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[i][j] += m[i][j] * scalar;
      }
    }
    return result;
  }
  matrixMult(m1: number[][], m2: number[][]): number[][] {

    // Get the dimensions of the matrices
    const rows1 = m1.length;
    const cols1 = m1[0]?.length || 0;
    const rows2 = m2.length;
    const cols2 = m2[0]?.length || 0;

    // Check if the matrices are compatible for multiplication
    // The number of columns in matrixA must equal the number of rows in matrixB
    if (cols1 !== rows2) {
      throw new Error(
        "Matrix dimensions are not compatible for multiplication. " +
        `Matrix A columns (${cols1}) must equal Matrix B rows (${rows2}).`
      );
    }

    const result: number[][] = Array(rows1)
      .fill(0)
      .map(() => Array(cols2).fill(0));

    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols2; j++) {
        for (let k = 0; k < cols1; k++) {
          result[i][j] += m1[i][k] * m2[k][j];
        }
      }
    }

    return result;
  }
}
