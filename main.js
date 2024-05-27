let shared;
let rotateIs;

function preload() {
	partyConnect(
		"wss://demoserver.p5party.org", 
		"hello_party"
	);
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  rotateIs = partyLoadShared("rotateCheck", 0);
}

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function mousePressed() {
  shared.x = mouseX;
  shared.y = mouseY;
}

function draw() {
  rotateIs.set(rotationX);
  background(radians(rotationX));

  fill("#000066");

  ellipse(shared.x, shared.y, 100, 100);
}