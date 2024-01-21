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
const leavesColor = "#6D973E";
const waterColor = "#1098A688";
const deepWaterColor = "#023ACA";
const snowColor = "#ffffff";
const cloudColor = "#ffffffa6";

// generation logic
const yMultiplier = 2 * terrainRange;
const xOffset = 100;
const x0 = -width / 2 + xOffset;
const x1 = width / 2 - xOffset;
const z0 = -depth / 2;
const z1 = depth / 2;

/* Global variables */
var angle = 0;
var terrainChangeSpeed = 1;
var seedX = 0;
var seedZ = 0;
var generateClouds = false;
var generateTrees = false;

// global

function setup() {
  let canv = createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, camHeight, orbitRad);
  cam.lookAt(0, 0, 0);
  initializeVars();
  initializeUI();
  draw();
}

function initializeVars() {
  seedX = 1; //millis() * 10000;
  seedZ = 1;
}

function initializeUI() {
  isMoveTerrain = createCheckbox("  Move Terrain", true);
  isClouds = createCheckbox("  Enable Clouds", true);
  isTrees = createCheckbox("  Enable Trees", true);

  isMoveTerrain.position(windowWidth * 0.05, windowHeight * 0.87);
  isClouds.position(windowWidth * 0.05, windowHeight * 0.89);
  isTrees.position(windowWidth * 0.05, windowHeight * 0.91);
}

function handleUI() {
  if (isMoveTerrain.checked()) {
    terrainChangeSpeed = 0.05;
    seedX += terrainChangeSpeed;
  } else {
    terrainChangeSpeed = 0;
  }

  if (isTrees.checked()) {
    generateTrees = true;
  } else {
    generateTrees = false;
  }

  if (isClouds.checked()) {
    generateClouds = true;
  } else {
    generateClouds = false;
  }
}

function draw() {
  background(0);
  handleUI();
  ambientLight(255);
  drawTerrain();
  orbitControl();
}

function drawTerrain() {
  // draw terrain
  for (let x = x0; x < x1; x += boxSize) {
    for (let z = z0; z < z1; z += boxSize) {
      let y = getNoiseValue(x, z, 0, yMultiplier);

      // setup
      getTerrainColor(y);
      setStroke(y);

      // draw terrain
      push();
      drawBlock(x, y, z);
      drawUnderground(y);
      if (generateTrees) drawTrees(x, y, z);
      if (generateClouds) drawClouds(x, z);
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
  noStroke();
  if (y > waterLevel) y = waterLevel;
  let boxesUntilBedrock = bedrockLevel - y;
  translate(0, boxesUntilBedrock / 2, 0);
  // no stone under water
  if (y == waterLevel) {
    fill(deepWaterColor);
  } else {
    fill(rockColor);
  }
  box(boxSize, boxesUntilBedrock - boxSize, boxSize);
  translate(0, -boxesUntilBedrock / 2, 0);
}

function drawClouds(x, z) {
  translate(0, skyLevel * 2, 0);
  let cloudY = getNoiseValue(x, z, 5000, yMultiplier);
  if (cloudY < skyLevel + 15) {
    fill(cloudColor);
    box(boxSize, boxSize, boxSize, 100);
  }
}

function drawTrees(x, y, z) {
  stroke(0);
  let treeChance = getNoiseValue(x, z, 10000, 90);
  if (treeChance > 15 && y > treeLevel && y < sandLevel) {
    // draw tree trunk
    translate(0, -boxSize * 1.5, 0);
    fill(treeTrunkColor);
    box(boxSize, boxSize * 2, boxSize);

    // draw minecraft leaves
    translate(-boxSize, -boxSize, -boxSize);
    fill(leavesColor);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          box(boxSize * 1);
          translate(0, 0, boxSize);
        }
        translate(boxSize, 0, -boxSize * 3);
      }
      translate(-boxSize * 3, -boxSize, 0);
    }
    translate(boxSize, 0, boxSize);
    box(boxSize);
    translate(0, boxSize * 4, 0);
  }
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

function getNoiseValue(x, z, seedOffset, valueMultiplier) {
  return (
    (noise(
      x * resolutionVal + seedX + seedOffset + terrainChangeSpeed,
      z * resolutionVal + seedZ + seedOffset
    ) -
      0.5) *
    valueMultiplier
  );
}

function setStroke(y) {
  if (y > waterLevel) {
    noStroke();
  } else {
    stroke(0, 250);
  }
}
