import type { Paintable } from "./anodized";
import { CubicBezierValue } from "./cubicBezierValue";
import { wave } from "./sineWave";

export default class DrawWave implements Paintable {

  // step = 0;
  // offset = 0;
  // ampl = 80;
  // period = 6;
  // distorsionFactor = new CubicBezierValue([0.87, 0, 0.13, 1], 0.9);

  // setup(
  //   ctx: CanvasRenderingContext2D,
  //   canvas: HTMLCanvasElement,
  //   animation: { start(): void; stop(): void },
  // ): void {
  //   ctx.strokeStyle = "#d6d3d1";

  //   ctx.lineWidth = 2;
  //   ctx.translate(0, canvas.height / 2);

  //   canvas.addEventListener("mouseenter", () => {
  //     this.distorsionFactor.active = true;
  //   });
  //   canvas.addEventListener("mouseleave", () => {
  //     this.distorsionFactor.active = false;
  //   });
  // }

  // draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  //   // amplitude distorsion
  //   const distorsion = this.distorsionFactor.value();

  //   this.step = 0;
  //   this.offset += 0.1;

  //   ctx.beginPath();
  //   ctx.moveTo(0, wave(this.step, 0, this.period, this.offset));
  //   for (let i = 0; i < canvas.width; i++) {
  //     this.step++;
  //     // ctx.lineTo(i, wave(step, ampl , period, offset));
  //     ctx.lineTo(
  //       i,
  //       wave(
  //         this.step,
  //         this.ampl * distorsion +
  //         (this.ampl *
  //           (1 - distorsion) *
  //           Math.sin((Math.PI * i) / canvas.width) +
  //           3),
  //         this.period,
  //         this.offset,
  //       ),
  //     );
  //   }
  //   ctx.stroke();
  // }
  step = 0;
  offset = 0;
  ampl = 45;
  period = 11;
  speed = 0.5;

  distorsion = new CubicBezierValue([0.76, 0, 0.24, 1], 3);

  setup(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    animation: { start(): void; stop(): void },
  ): void {
    ctx.strokeStyle = "oklch(54.6% 0.245 262.881)";

    ctx.lineWidth = 2;

    ctx.translate(0, canvas.height / 2);

    canvas.addEventListener("mouseenter", () => {
      this.distorsion.active = true;
    });
    canvas.addEventListener("mouseleave", () => {
      this.distorsion.active = false;
    });
  }
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const d = this.distorsion.value();

    this.step = 0;
    this.offset += (d == 0 || d == 1) ? this.speed : this.speed * 0.5;
    ctx.strokeStyle = `oklch(54.6% ${0.245 + 0.4 * d} 262.881)`

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
        wave(this.step, Math.sin((i / canvas.width) * (Math.PI + d * Math.PI * 5)) * (this.ampl + d * 90), this.period - 7 * d, this.offset),
      );
    }
    ctx.stroke();
  }
}
