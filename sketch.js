/* Constants */
// terrain
const boxSize = 10;
const depth = 400;
const resolutionVal = 0.007;
const terrainRange = 100;
const width = 800;

// tile Levels
const skyLevel = -60;
const treeLevel = -50;
const sandLevel = -15;
const waterLevel = 5;
const deepWaterLevel = 15;
const bedrockLevel = 50;

// camera/movement
const rotateScale = 1.0;
const camHeight = -250;
const orbitRad = 65 * boxSize * 1.2;

// Fill Colors
const rockColor = "#62718E";
const sandColor = "#D4A463";
const grassColor = "#90A944";
const treeTrunkColor = "#725F4B";
const forestColor = "#6D973E";
const waterColor = "#1098A688";
const deepWaterColor = "#023ACA";
const snowColor = "#ffffff";

// generation logic
const yOffset = 2 * terrainRange;
const xOffset = 100;
const x0 = -width / 2 + xOffset;
const x1 = width / 2 - xOffset;
const z0 = -depth / 2;
const z1 = depth / 2;

/* Global variables */
var angle = 0;
var terrainChangeSpeed = 1;
let seed = 0;

// global

function setup() {
  let canv = createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, camHeight, orbitRad);
  cam.lookAt(0, 0, 0);
  initializeVars();
  draw();
}

function initializeVars() {
  seed = millis() * 10000;
}

function draw() {
  background(0);
  drawTerrain();
  orbitControl();
}

function drawTerrain() {
  // draw terrain
  for (let x = x0; x < x1; x += boxSize) {
    for (let z = z0; z < z1; z += boxSize) {
      let y =
        (noise(
          x * resolutionVal + seed + terrainChangeSpeed,
          z * resolutionVal + seed
        ) -
          0.5) *
        yOffset;

      // setup
      getTerrainColor(y);
      setStroke(y);

      // draw terrain
      push();
      drawBlock(x, y, z);
      drawUnderground(y);
      pop();
    }
  }
}

function drawBlock(x, y, z) {
  if (y > waterLevel) y = waterLevel;
  translate(x, y, z);
  box(boxSize);
}

function drawUnderground(y) {
  let boxesUntilBedrock = bedrockLevel - y;
  translate(0, boxesUntilBedrock / 2, 0);
  // no stone under water
  if (y > waterLevel) {
    fill(deepWaterColor);
  } else {
    fill(rockColor);
  }
  box(boxSize, boxesUntilBedrock - boxSize, boxSize);
  translate(0, -boxesUntilBedrock / 2, 0);
}

function getTerrainColor(y) {
  if (y < treeLevel) {
    fill(snowColor);
  } else if (y < sandLevel) {
    fill(grassColor);
  } else if (y < waterLevel) {
    fill(sandColor);
  } else if (y < deepWaterLevel) {
    fill(waterColor);
  } else {
    fill(deepWaterColor);
  }
}

function setStroke(y) {
  if (y > waterLevel) {
    noStroke();
  } else {
    stroke(0, 250);
  }
}
