import bezierEasing from "bezier-easing";

export class CubicBezierValue {
  time = 0;
  active = false;
  bezierFunction: (t: number) => number;
  animationTime: number;

  constructor(bezier: [number, number, number, number], animationTime: number) {
    this.bezierFunction = bezierEasing(...bezier);
    this.animationTime = animationTime;
  }

  value() {
    if (this.active && this.time <= 1) {
      this.time += 1 / (60 * this.animationTime);
    }
    if (!this.active && this.time >= 0) {
      this.time -= 1 / (60 * this.animationTime);
    }

    return this.bezierFunction(this.time);
  }
}

