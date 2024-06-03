//p5.party 기본
let shared;
let me;
let guests;

let sumDeg = 0;

//game Map & character
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

// zone trigger
let keyPressedTrigger = false;
let activeTrigger = null;

// device classification
let device;

//moving game
let movingGame;
let totalDegX;
let totalDegY;

// document.addEventListener("DOMContentLoaded", function() {
//   const activateButton = document.getElementById('activateButton');
//   if (activateButton) {
//     activateButton.addEventListener('click', onClick);
//   } else {
//     console.error("Activate button not found.");
//   }
// });

// function onClick() {
//   console.log("Activate button clicked");
//   if (typeof DeviceOrientationEvent.requestPermission === 'function') {
//     DeviceOrientationEvent.requestPermission()
//       .then(permissionState => {
//         if (permissionState === 'granted') {
//           console.log("Permission granted");
//           window.addEventListener('deviceorientation', cb);
//         } else {
//           console.log("Permission denied");
//         }
//       })
//       .catch(error => {
//         console.error("Error requesting permission:", error);
//       });
//   } else {
//     console.log("DeviceOrientationEvent.requestPermission is not a function");
//     window.addEventListener('deviceorientation', cb);
//   }
// }

// function cb(event) {
//   console.log("Device orientation event triggered");
//   if (event.gamma !== null) {
//     me.degY = radians(event.gamma);
//     console.log("degY:", me.degY);
//   }
//   if (event.beta !== null) {
//     me.degX = radians(event.beta);
//     console.log("degX:", me.degX);
//   }
//   // party.js와 동기화
//   partySetShared(me);
//   console.log("Shared me:", me);
// }

function preload() {
  // 이미지 로드
// playerImgs = loadImage('assets/playerAnim0.png');

  dungGeunMoFont = loadFont('fonts/DungGeunMo.otf');

  for (let i =0; i < 5; i++){
    playerImgs[i] = loadImage("assets/playerAnim"+i+".png");
  }
  currentPlayerImg = playerImgs[0]

  mapImg = loadImage('assets/map320_240(2).png');

  partyConnect(
		"wss://demoserver.p5party.org", 
		"slime_map"
	);

  shared = partyLoadShared("shared");
  me = partyLoadMyShared({ degX: 0, degY: 0}, console.log("my object is called!"));
  guests = partyLoadGuestShareds(console.log("guests shared!"));

}



function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(windowWidth,windowHeight);
  noStroke();

  textFont(dungGeunMoFont);

  shared.slime = new Player(playerInitX, playerInitY);
  camera = new Camera();
  gameMap = new GameMap(mapWidth, mapHeight, mapImg);

  shared.test = 10;
  shared.zone = 0;

  if (partyIsHost()) {
    console.log("slime online!")
  }

  console.log(radians(rotationX));

  if (radians(rotationX) == 0) {
    device = 'Computer'
  } else {
    device = 'Mobile'
  }

  movingGame = new MovingGame();
  totalDegX = 0;
  totalDegY = 0;
}

function draw() {
  background(60);
  //scale(0.5) //전체맵 확인용 스케일

  me.degX = rotationX;
  me.degY = rotationY;

  totalDegX = 0; // 합산된 회전 값을 초기화
  totalDegY = 0;

  for (let i = 0; i < guests.length; i++) {
    if (guests[i] && guests[i].degX !== undefined && guests[i].degY !== undefined) {
      totalDegX += guests[i].degX; // 각 게스트의 X축 기울기를 합산
      totalDegY += guests[i].degY; // 각 게스트의 Y축 기울기를 합산
    }
  }
  console.log("totalDegX:", totalDegX, "totalDegY:", totalDegY);

  if (device == 'Mobile') {

  // 카메라 위치를 업데이트
  camera.update(shared.slime);

  // 카메라 적용
  camera.apply();
  
  gameMap.display();

  me.rotateDeg = accelerationX;

  if (frameCount % 5 == 0) {
    currentPlayerImg = playerImgs[currentPlayerImgFrame++%5];
  }

  shared.slime.move(gameMap.obstacles);

  gameMap.displayTriggers();

  // 트리거 영역에 들어가면 activeTrigger에서 트리거 정보를 리턴한다
  activeTrigger = gameMap.checkTriggers(shared.slime);
  
  shared.slime.display(currentPlayerImg);

    // 트리거 영역 안에서 있으면 텍스트가 자동으로 표시되고
    // 특정 키(Q)를 누르면 (keyPressedTrigger) 특정 행동을 할 수 있다
    if (activeTrigger) {
      fill(255);
      rectMode(CORNER);
      rect(shared.slime.x - 50, shared.slime.y - 60, 100, 30);
      fill(0);
      textSize(10);
      textAlign(CENTER, CENTER);
      text(activeTrigger.message, shared.slime.x, shared.slime.y - 45);
      if (shared.moveStop) {

        switch(activeTrigger.message) {
          case "spawn zone \n press Q to interact":
            rectMode(CENTER);
            rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
            fill(255);
            textSize(50);
            text('Spawn Zone', shared.slime.x, shared.slime.y)
            shared.zone = 0;     
            break;
          case "zone 1":
            shared.zone = 1; 
            fill(255);
            rectMode(CENTER);
            rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
            movingGame.update();
            movingGame.draw();
            movingGame.degmatch();   
            break;
          case "zone 2":
            rectMode(CENTER);
            rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
            fill(255);
            textSize(50);
            text('Zone 2', shared.slime.x, shared.slime.y) 
            shared.zone = 2;    
            break;
          case "zone 3":
            rectMode(CENTER);
            rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
            fill(255);
            textSize(50);
            text('Zone 3', shared.slime.x, shared.slime.y)  
            shared.zone = 3;   
            break;
          case "zone 4":
            rectMode(CENTER);
            rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
            fill(255);
            textSize(50);
            text('Zone 4', shared.slime.x, shared.slime.y)   
            shared.zone = 4;  
            break;
        }
      } 
    }
    textSize(50);
    fill(0);
    text(radians(rotationX), windowWidth/2, windowHeight/2);
  } else {
    rectMode(CORNER);
    fill('#ffcccc');
    rect(0,0,windowWidth,windowHeight);
    fill(0);
    stroke(0);
    line(0,windowHeight/4,windowWidth,windowHeight/4);
    line(0,windowHeight/2,windowWidth,windowHeight/2);
    line(0,windowHeight/4 * 3,windowWidth,windowHeight/4 * 3);
    line(0,windowHeight,windowWidth,windowHeight);
    textSize(50);
    textAlign(CENTER, CENTER);
    text(shared.moveStop, windowWidth/2, windowHeight/4);

    if (shared.moveStop) {
      textAlign(CENTER, CENTER);
      switch(shared.zone) {
        case 0:
          fill(255);
          textSize(50);
          text('Spawn Zone', windowWidth/2, windowHeight/2)     
          break;
        case 1:
          fill(255);
          textSize(50);
          text('Zone 1', windowWidth/2, windowHeight/2)     
          break;
        case 2:
          fill(255);
          textSize(50);
          text('Zone 2', windowWidth/2, windowHeight/2)     
          break;
        case 3:
          fill(255);
          textSize(50);
          text('Zone 3', windowWidth/2, windowHeight/2)     
          break;
        case 4:
          fill(255);
          textSize(50);
          text('Zone 4', windowWidth/2, windowHeight/2)     
          break;
      }
    } 
  }
}

function keyPressed() {

  //맵 인터렉션
  // if (keyCode === 81) {
  //   activeTrigger = gameMap.checkTriggers(shared.slime);
  //   if (activeTrigger) {
  //     shared.moveStop = !shared.moveStop;
  //   }

  //   if (!shared.moveStop) {
  //     switch (shared.zone) {
  //       case 1:
  //         movingGame.resetGame();
  //     }
  //   }
  // }

  switch (keyCode) {
    case 87:
      shared.slime.setDirection('up', true);
      break;
    case 83:
      shared.slime.setDirection('down', true);
      break;
    case 65:
      shared.slime.setDirection('left', true);
      break;
    case 68:
      shared.slime.setDirection('right', true);
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case 87:
      shared.slime.setDirection('up', false);
      break;
    case 83:
      shared.slime.setDirection('down', false);
      break;
    case 65:
      shared.slime.setDirection('left', false);
      break;
    case 68:
      shared.slime.setDirection('right', false);
      break;
  }
}

function mousePressed() {
  if (movingGame && typeof movingGame.handleKeyPressed === 'function') {
    movingGame.handleKeyPressed();
  } else {
    console.error("game.handleKeyPressed is not a function or game is not defined");
  }

  if (device == 'Mobile') {

  } else {
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight / 4) {
      activeTrigger = gameMap.checkTriggers(shared.slime);
      if (activeTrigger) {
        shared.moveStop = !shared.moveStop;
      }
      if (!shared.moveStop) {
        switch (shared.zone) {
          case 1:
            movingGame.resetGame();
        }
      }
    }
  }
}