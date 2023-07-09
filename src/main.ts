import "./style.css";
import Stats from "stats.js";
import SettingsPanel from "./settingsPanel";

let settingsPanel: SettingsPanel = new SettingsPanel();

let circleNumber: { value: number} = { value: 23};

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

document.getElementById("stats").appendChild(stats.dom);
let lastUpdate: number = 0; // Timestamp of the last update
let delay: number = 100; // Delay between updates in milliseconds

settingsPanel.addSetting("Circles:", circleNumber, resetDrawing);

let drawing: ShakingCircle[] = [];
let canvas: HTMLCanvasElement | null = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
let context: CanvasRenderingContext2D = canvas.getContext("2d")!;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Now you can use the context to draw on the canvas

context.lineWidth = 0.6;
context.strokeStyle = "black";

type Point = {
  x: number;
  y: number;
};

class Circle {
  public points: Point[];
  public center: Point;

  constructor(cx: number, cy: number) {
    this.points = [];
    this.center = { x: cx, y: cy };
  }

  addPoint(point: Point): void {
    this.points.push(point);
  }

  draw(lineWidth: number) {
    context.lineWidth = lineWidth;
    //if (lineWidth < .7) context.strokeStyle = 'white';
    context.translate(this.center.x, this.center.y);
    for (let point of this.points) {
      context.lineTo(point.x, point.y);
    }
    context.resetTransform();
  }

  // Additional methods for the class...
}

class ShakingCircle {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shakyness: number;
  private cx: number;
  private cy: number;
  private hue: number;
  private circles: Circle[];
  private lineWidth: number;
  private rgba: string;
  private greyScale: string;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.shakyness = Math.random() * 25 + 10;
    this.cx = Math.floor(Math.random() * canvas.width);
    this.cy = Math.floor(Math.random() * canvas.height);
    this.hue = Math.floor(Math.random() * 360);
    this.rgba =
      "rgba(" +
      this.getRandomColor() +
      ", " +
      this.getRandomColor() +
      ", " +
      this.getRandomColor() +
      ", " +
      this.getRandomOpacity() +
      ")";
    this.greyScale = "rgba(255, 255, 255, " + this.getRandomOpacity() + ")";
    this.circles = [];
    this.lineWidth = Math.random() * 1 + 0.5;
    this.generateCircles();
  }

  getRandomOpacity() {
    return Math.random() * 0.5 + 0.5;
  }

  getRandomColor() {
    return Math.floor(Math.random() * 255);
  }

  generateCircles() {
    let baseRadius = Math.random() * 200 + 10;
    for (let i = 0; i < 5; i++) {
      let circle = new Circle(this.cx, this.cy);

      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        let r = baseRadius + Math.random() * 15 + 10;
        //let r = (Math.random() * this.shakyness + Math.random() * 40) + 80;
        circle.addPoint({ x: r * Math.cos(a), y: r * Math.sin(a) });
      }
      this.circles.push(circle);
    }
  }

  // Additional methods for the class...
  draw() {
    //context.strokeStyle = 'hsl(' + this.hue + ', 50%, 50%)';
    context.strokeStyle = this.greyScale;
    context.fillStyle = "rgba(255, 255, 255, 0";
    context.beginPath();
    this.circles[Math.floor(Math.random() * this.circles.length)].draw(
      this.lineWidth
    );

    this.circles[Math.floor(Math.random() * this.circles.length)].draw(
      this.lineWidth
    );
    context.fillStyle = this.rgba;
    this.circles[Math.floor(Math.random() * this.circles.length)].draw(
      this.lineWidth
    );
    context.fill();
    context.closePath();
    context.stroke();
  }

  update() {}
}

function resetDrawing() {
  drawing = [];
  for (let i = 0; i < circleNumber.value; i++) {
    drawing.push(new ShakingCircle(canvas, context));
  }
}
resetDrawing();
function animate(timestamp) {
  stats.begin();
  if (timestamp - lastUpdate >= delay) {
    // If the delay has passed
    lastUpdate = timestamp; // Update the last update timestamp

    // Update the animation here
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let shakingCircle of drawing) {
      context.resetTransform();
      shakingCircle.draw();
    }
  }

  stats.end();
  requestAnimationFrame(animate);
}
animate();
