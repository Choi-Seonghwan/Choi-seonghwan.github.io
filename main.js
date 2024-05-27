let shared;
let clickCount;
let rotateDeg;

function preload() {
	partyConnect(
		"wss://demoserver.p5party.org", 
		"hello_party"
	);
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  clickCount = partyLoadShared("clickCount", {value:0});
  rotateDeg = partyLoadShared("rotate", {value: 0});
}

function setup() {
  createCanvas(400, 400);
  noStroke();

  if (partyIsHost()) {
    clickCount.value = 0;
    shared.x = 200;
    shared.y = 200;
  }
}

function mousePressed() {
  shared.x = mouseX;
  shared.y = mouseY;
  clickCount.value++;
}

function draw() {
  background('#ffcccc');
  fill("#000066");
  rotateDeg.value = accelerationX;

  textAlign(CENTER, CENTER);
  text(clickCount.value, width/2, height/2);
  text(rotateDeg.value, width/2, 100);

  shared.x += rotateDeg.value;

  ellipse(shared.x, shared.y, 100, 100);
}