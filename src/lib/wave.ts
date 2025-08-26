import type { Paintable } from "./anodized";
import { CubicBezierValue } from "./cubicBezierValue";
import { wave } from "./sineWave";

export default class DrawWave implements Paintable {

  step = 0;
  offset = 0;
  ampl = 45;
  period = 11;
  speed = 0.5;
  mousePos = [0, 0];
  mouseIn = false;
  mouseClick = false;

  distorsion = new CubicBezierValue([0.76, 0, 0.24, 1], 1);
  periodChange = new CubicBezierValue([0.76, 0, 0.24, 1], 2);

  setup(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    animation: { start(): void; stop(): void },
  ): void {

    const elementRect = canvas.getBoundingClientRect()
    canvas.width = elementRect.width
    canvas.height = elementRect.height

    ctx.translate(0, canvas.height / 2);

    window.addEventListener("resize", () => {
      const elementRect = canvas.getBoundingClientRect()
      canvas.width = elementRect.width
      canvas.height = elementRect.height

      ctx.translate(0, canvas.height / 2);
    })


    ctx.strokeStyle = "oklch(54.6% 0.245 262.881)";

    this.mousePos = [canvas.width / 2, canvas.height / 2]

    ctx.lineWidth = 2;


    canvas.addEventListener("mouseenter", () => {
      this.distorsion.active = true;
      this.mouseIn = true;
    });
    canvas.addEventListener("mouseleave", () => {
      this.distorsion.active = false;
      this.mouseIn = false;
    });

    canvas.addEventListener("mousemove", (e) => {
      const elementRect = canvas.getBoundingClientRect()
      if (this.mouseIn) {
        this.mousePos = [e.clientX - elementRect.left, e.clientY - elementRect.top]
      }
    })
    canvas.addEventListener("mousedown", () => {
      this.periodChange.active = !this.periodChange.active;
    });
    canvas.addEventListener("mouseup", () => {
    });
  }
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const d = this.distorsion.value();
    const pc = this.periodChange.value();

    this.step = 0;
    this.offset += (d == 0 || d == 1) ? this.speed : this.speed * 0.5;
    ctx.strokeStyle = `oklch(54.6% 0.245 ${262.881 + 100 * pc})`

    ctx.beginPath();
    ctx.moveTo(
      0,
      wave(this.step, Math.sin((0) * (Math.PI + d * Math.PI * 5)) * (this.ampl + d * 90), this.period - 7 * d, this.offset),
    );
    for (let i = 0; i < canvas.width; i++) {
      this.step++;
      // ctx.lineTo(i, wave(step, ampl , period, offset));
      ctx.lineTo(
        i,
        wave(this.step, Math.pow(Math.abs(Math.cos(((i - this.mousePos[0]) / canvas.width) * (Math.PI))), 1 + d * 2) * (this.ampl + (this.mousePos[1] / canvas.height) * 20), this.period - pc * 5, this.offset),
      );
    }
    ctx.stroke();
  }
}
