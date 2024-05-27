let shared;
let rotateIs;

function preload() {
	partyConnect(
		"wss://demoserver.p5party.org", 
		"hello_party"
	);
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  rotateIs = partyLoadShared("rotateCheck", {deg: 0});
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
  rotateIs = {deg: rotationX}
  background(radians(rotateIs));

  fill(0);
  console.log(rotationX);
  console.log(rotateIs);

  fill("#000066");

  ellipse(shared.x, shared.y, 100, 100);
}