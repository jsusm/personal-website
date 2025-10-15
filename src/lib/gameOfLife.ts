import type { Paintable } from "./anodized";

export default class GameOfLife implements Paintable {
  cols = 30;
  rows = 30;
  cells: number[][]
  cellsRef: number[][]
  run = true;

  constructor() {
    this.cells = Array(this.cols).fill(0).map(() => Array(this.rows).fill(0))
    this.cellsRef = Array(this.cols).fill(0).map(() => Array(this.rows).fill(0))
  }

  circularClamp(n: number) {
    if (n < 0) return this.cols + n;
    if (n >= this.cols) return n - this.cols;
    return n
  }

  updateRef() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.cellsRef[i][j] = this.cells[i][j];
      }
    }
  }

  clearCells() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.cells[i][j] = 0;
      }
    }
  }

  startStopButton: HTMLButtonElement | null = null
  updateButtonStartStopButton() {
    if (this.startStopButton) {
      if (this.run) {
        this.startStopButton.innerText = "[stop]"
      } else {
        this.startStopButton.innerText = "[play]"
      }
    }
  }

  mousePos = [0, 0]
  mousePress = false;
  killCell = true;

  resurectCellUnderMouse(cellWidth: number, cellHeight: number) {
    this.run = false;
    if (this.killCell) {
      this.cells[Math.floor(this.mousePos[0] / cellWidth - 0.1)][Math.floor(this.mousePos[1] / cellHeight - 0.2)] = 0
    } else {
      this.cells[Math.floor(this.mousePos[0] / cellWidth - 0.1)][Math.floor(this.mousePos[1] / cellHeight - 0.2)] = 1
    }
  }

  setup(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, animation: { start(): void; stop(): void; }): void {
    const elementRect = canvas.getBoundingClientRect()
    canvas.width = elementRect.width
    canvas.height = elementRect.height

    ctx.lineWidth = 1
    ctx.strokeStyle = "#999"
    ctx.fillStyle = "white"

    this.cells[5][5] = 1
    this.cells[5][6] = 1
    this.cells[5][7] = 1
    this.cells[4][7] = 1
    this.cells[3][6] = 1

    const startStopButton = document.
      getElementById("gol-canvas-control-start-stop") as HTMLButtonElement | null
    this.startStopButton = startStopButton;

    // Attach events to play button 
    if (startStopButton) {
      startStopButton.addEventListener("click", (e) => {
        this.run = !this.run
        this.updateButtonStartStopButton()
      })

    }

    // Attach events to next button 
    document.
      getElementById("gol-canvas-control-start-next")?.
      addEventListener("click", () => {
        this.run = false
        this.nextGeneration()
        this.updateButtonStartStopButton()
      })

    document.
      getElementById("gol-canvas-control-clear")?.
      addEventListener("click", () => {
        this.run = false
        this.clearCells()
        this.updateRef()
      })

    canvas.addEventListener("mousemove", (e) => {
      const elementRect = canvas.getBoundingClientRect()
      this.mousePos = [e.clientX - elementRect.left, e.clientY - elementRect.top]

      if (this.mousePress) {
        const cellWidth = canvas.width / this.cols
        const cellHeight = canvas.height / this.rows
        this.resurectCellUnderMouse(cellWidth, cellHeight)
      }
    })

    canvas.addEventListener("pointerdown", e => {
      this.mousePress = true;
      const cellWidth = canvas.width / this.cols
      const cellHeight = canvas.height / this.rows

      this.killCell = !!this.cells[Math.floor(this.mousePos[0] / cellWidth - 0.1)][Math.floor(this.mousePos[1] / cellHeight - 0.2)]

      this.resurectCellUnderMouse(cellWidth, cellHeight)
    })
    canvas.addEventListener("pointerup", e => {
      this.mousePress = false;
    })


  }
  counter = 0

  nextGeneration() {
    this.updateRef()
    this.clearCells()

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const up = this.circularClamp(i - 1);
        const down = this.circularClamp(i + 1);
        const left = this.circularClamp(j - 1);
        const right = this.circularClamp(j + 1);
        const neighboursCount =
          this.cellsRef[up][left] +
          this.cellsRef[up][j] +
          this.cellsRef[up][right] +
          this.cellsRef[i][left] +
          this.cellsRef[i][right] +
          this.cellsRef[down][left] +
          this.cellsRef[down][j] +
          this.cellsRef[down][right];


        if (this.cellsRef[i][j]) {
          if (neighboursCount == 2 || neighboursCount == 3) {
            this.cells[i][j] = 1;
          }
        } else {
          if (neighboursCount == 3) {
            this.cells[i][j] = 1
          }
        }
      }
    }

  }

  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    this.counter += 1;

    const cellWidth = canvas.width / this.cols
    const cellHeight = canvas.height / this.rows

    if (this.counter % 5 == 0 && this.run) {
      this.nextGeneration()
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.cells[i][j] == 1) {
          ctx.beginPath()
          ctx.fillRect(i * cellHeight, j * cellWidth, cellWidth, cellHeight)
        }
      }
    }
  }
}
