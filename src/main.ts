import "./style.css";
import Stats from "stats.js";
import SettingsPanel from "./settingsPanel";

let settingsPanel: SettingsPanel = new SettingsPanel();

let circleNumber: { value: number } = { value: 23 };
let circleAverageRadius: { value: number } = { value: 100 };
let borderColor: { value: string } = { value: "#000000" };
let shakyness: { value: number } = { value: 15};
let circleColor: { value: string} = { value: "#ffffff" };
let circleRandomColor: {value: boolean} = { value: true };

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

document!.getElementById("stats")!.appendChild(stats.dom);

let lastUpdate: number = 0; // Timestamp of the last update
let delay: number = 100; // Delay between updates in milliseconds

let input = document.createElement("input");
input.type = "range";
input.min = "1";
input.max = "2000";
input.value = circleNumber.value.toString();
input.className = "slider";
input.id = "circleNumber";
settingsPanel.addSetting("Circles:", input, circleNumber, resetDrawing);

let radiusInput = document.createElement("input");
radiusInput.type = "range";
radiusInput.min = "15";
radiusInput.max = "200";
radiusInput.value = circleAverageRadius.value.toString();
radiusInput.className = "slider";
radiusInput.id = "circleRadius";
settingsPanel.addSetting("Circles Radius:", radiusInput, circleAverageRadius, resetDrawing);

let borderColorInput = document.createElement("input");
borderColorInput.type = "color";
borderColorInput.className = "borderColor";
borderColorInput.value = borderColor.value.toString();
settingsPanel.addSetting("Border color:", borderColorInput, borderColor, resetDrawing);

let shakynessInput = document.createElement("input");
shakynessInput.type = "range";
shakynessInput.min = "5";
shakynessInput.max = "50";
shakynessInput.value = shakyness.value.toString();
shakynessInput.className = "slider";
shakynessInput.id = "shakynessInput";
settingsPanel.addSetting("waves size:", shakynessInput, shakyness, resetDrawing);

let circleColorInput = document.createElement("input");
circleColorInput.type = "color";
circleColorInput.className = "circleColor";
circleColorInput.value = circleColor.value.toString();
settingsPanel.addSetting("Circle color:", circleColorInput, circleColor, resetDrawing);

let randomColorInput = document.createElement('input');
randomColorInput.type = "checkbox";
randomColorInput.checked = circleRandomColor.value;
settingsPanel.addSetting("Random circle color:", randomColorInput, circleRandomColor, resetDrawing);

let drawing: ShakingCircle[] = [];
let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.id = "canvas";
document.body.prepend(canvas);
let context: CanvasRenderingContext2D = canvas.getContext("2d")!;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.lineWidth = 0.6;
//context.strokeStyle = "black";

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
  protected canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  //private shakyness: number;
  private cx: number;
  private cy: number;
  private circles: Circle[];
  private lineWidth: number;
  private rgba: string;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    //this.shakyness = Math.random() * 25 + 10;
    this.cx = Math.floor(Math.random() * this.canvas.width);
    this.cy = Math.floor(Math.random() * this.canvas.height);
    this.rgba = !circleRandomColor.value ? circleColor.value :
      "rgba(" +
      this.getRandomColor() +
      ", " +
      this.getRandomColor() +
      ", " +
      this.getRandomColor() +
      ", " +
      this.getRandomOpacity() +
      ")";
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
    for (let i = 0; i < 5; i++) {
      let circle = new Circle(this.cx, this.cy);

      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        let r = circleAverageRadius.value + (Math.random() * shakyness.value);
        circle.addPoint({ x: r * Math.cos(a), y: r * Math.sin(a) });
      }
      this.circles.push(circle);
    }
  }

  // Additional methods for the class...
  draw() {
    this.context.strokeStyle = borderColor.value;
    this.context.beginPath();
    context.fillStyle = this.rgba;

    this.circles[Math.floor(Math.random() * this.circles.length)].draw(
      this.lineWidth
    );
    this.circles[Math.floor(Math.random() * this.circles.length)].draw(
      this.lineWidth
    );
    this.circles[Math.floor(Math.random() * this.circles.length)].draw(
      this.lineWidth
    );
    this.context.fill();
    this.context.closePath();
    this.context.stroke();
  }

  update() {
    
  }
}

function resetDrawing() {
  drawing = [];
  for (let i = 0; i < circleNumber.value; i++) {
    drawing.push(new ShakingCircle(canvas, context));
  }
}
resetDrawing();

function animate(timestamp: number) {
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
requestAnimationFrame(animate)
