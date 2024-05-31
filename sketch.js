let player;
let gameMap;
let camera;
let mapWidth = 1600;
let mapHeight = 1200;

let playerImgs = [];
let currentPlayerImgFrame = 0;
let currentPlayerImg;
let mapImg;

let playerInitX = 800;
let playerInitY = 600;

let keyPressedTrigger = false;
let activeTrigger = null;

function preload() {
  // 이미지 로드
// playerImgs = loadImage('assets/playerAnim0.png');
for (let i =0; i < 5; i++){
  playerImgs[i] = loadImage("assets/PlayerAnim"+i+".png");
}
currentPlayerImg = playerImgs[0]

  mapImg = loadImage('assets/map320*240(2).png');

}



function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(windowWidth,windowHeight);
  noStroke();
  player = new Player(playerInitX, playerInitY);
  gameMap = new GameMap(mapWidth, mapHeight, mapImg);
  camera = new Camera();


}

function draw() {
  background(60);
  // scale(0.5) //전체맵 확인용 스케일

  // 카메라 위치를 업데이트
  camera.update(player);

  // 카메라 적용
  camera.apply();

  gameMap.display();
  player.move(gameMap.obstacles);

  if (frameCount % 5 == 0) {
    currentPlayerImg = playerImgs[currentPlayerImgFrame++%5];
  }

  console.log(frameCount);
  player.display(currentPlayerImg);

  gameMap.displayTriggers();



  // 트리거 영역에 들어가면 activeTrigger에서 트리거 정보를 리턴한다
  activeTrigger = gameMap.checkTriggers(player);

  // 트리거 영역 안에서 있으면 텍스트가 자동으로 표시되고
  // 특정 키(Q)를 누르면 (keyPressedTrigger) 특정 행동을 할 수 있다
  // 텍스트 내용이나 인터렉션은 임시로 작성함
  if (activeTrigger) {
    fill(255);
    rect(player.x - 50, player.y - 60, 100, 30);
    fill(0);
    textAlign(CENTER, CENTER);
    text(activeTrigger.message, player.x, player.y - 45);
    if (keyPressedTrigger) {
      ellipse(player.x, player.y, 10);
      keyPressedTrigger = !keyPressedTrigger
    }
  }
}


function keyPressed() {

  //맵 인터렉션
  if (keyCode === 81) {
    activeTrigger = gameMap.checkTriggers(player);
    if (activeTrigger) {
      keyPressedTrigger = !keyPressedTrigger;
    }
  }

  switch (keyCode) {
    case 87:
      player.setDirection('up', true);
      break;
    case 83:
      player.setDirection('down', true);
      break;
    case 65:
      player.setDirection('left', true);
      break;
    case 68:
      player.setDirection('right', true);
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case 87:
      player.setDirection('up', false);
      break;
    case 83:
      player.setDirection('down', false);
      break;
    case 65:
      player.setDirection('left', false);
      break;
    case 68:
      player.setDirection('right', false);
      break;
  }
}
