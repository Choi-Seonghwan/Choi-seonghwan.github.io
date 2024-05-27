let shared;
let clickCount;

function preload() {
	partyConnect(
		"wss://demoserver.p5party.org", 
		"hello_party"
	);
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  clickCount = partyLoadShared("clickCount");
}

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function mousePressed() {
  shared.x = mouseX;
  shared.y = mouseY;
  clickCount++;
}

function draw() {
  background('#ffcccc');
  fill("#000066");

  textAlign(CENTER, CENTER);
  text(clickCount, width/2, height/2);

  ellipse(shared.x, shared.y, 100, 100);
}