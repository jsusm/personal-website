export interface Paintable {
  setup(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    animation: { start(): void; stop(): void },
  ): void;
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
}

export default function draw(
  elementId: string,
  picture: Paintable,
  options = { clearCanvas: true },
) {
  // obtain canvas element
  const canvasElement = document.getElementById(
    elementId,
  ) as HTMLCanvasElement | null;
  if (canvasElement == null) {
    throw new Error(
      `Cannot draw without a canvas element, not found element with id: ${elementId}`,
    );
  }
  if (!canvasElement.getContext) {
    throw new Error(`Element with id: "${elementId}" is not a canvas element.`);
  }

  const ctx = canvasElement.getContext("2d");

  if (ctx == null) {
    throw new Error(
      `Cannot initialize rendering context for canvas element: ${canvasElement}`,
    );
  }

  // (Request Animation Frame)
  let raf: number;

  function stopAnimation() {
    window.cancelAnimationFrame(raf);
  }

  function startAnimation() {
    raf = window.requestAnimationFrame(frame);
  }

  picture.setup(ctx, canvasElement, {
    start: startAnimation,
    stop: stopAnimation,
  });

  function frame() {
    if (ctx != null && canvasElement != null) {
      if (options.clearCanvas) {
        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Restore the transform
        ctx.restore();
      }

      picture.draw(ctx, canvasElement);
      raf = window.requestAnimationFrame(frame);
    }
  }

  frame();
}
