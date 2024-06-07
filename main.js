//p5.party 기본
let shared; // 현재 mainStage, slime, zone, moveStop 있음
let me;
let guests;

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

let mapMouseX, mapMouseY;

let progress = 0;

// zone trigger
let keyPressedTrigger = false;
let activeTrigger = null;

// device classification
let device;

// moving game
let movingGame;
let totalDegX = 0;
let totalDegY = 0;

// motor game
// 애니메이션은 모터와 배터리 두 종류가 있음
// 나중에 다른 파일과 합쳐졌을 때를 대비해서
// 모터 미니게임의 에셋들의 파일 이름과 변수는 motor로 시작
let motorImgs = []; // 모터 돌아가는 모션, 8프레임
let motorBatteryImgs = []; // 배터리가 늘어나는 모션, 8프레임인데 마지막은 초록색 충전 완료 표시
let motorBgImg; // 배경 및 안움직이는 그림
let motorImg; // Imgs: 모든 프레임, Img: 현재 프레임
let motorImgNow = 0; //~ImgNow: 애니메이션이 몇번째 프레임인지
let motorBatteryImg;
let motorBatteryImgNow = 0;
let motorIntroImg; // 시작 화면 이미지

let totalAccelerationChange;
let lastMotionTime;

const threshold = 2; // 가속도 변화율 기준치 설정 (필요에 따라 조정 가능)
const decayRate = 0.9; // 가속도 감소율
const initialIgnoreCount = 5; // 초기 측정값 무시 횟수
let ignoreCount = initialIgnoreCount;

// button
let buttonStartImg;
let buttonStartOverImg;
let buttonStartPressedImg;
let buttonState = "normal"; // 버튼 상태: "normal", "over", "pressed"
let buttonX, buttonY, buttonWidth, buttonHeight;

function preload() {

  //p5.party basic properties
  partyConnect(
    "wss://demoserver.p5party.org",
    "slime_map" // set server name as project name
  );

  // set p5.party variables
  shared = partyLoadShared("shared", console.log('shared object is called!'));
  me = partyLoadMyShared({ degX: 0, degY: 0, accelerationChange: 0 }, console.log("my object is called!"));
  guests = partyLoadGuestShareds(console.log("guests shared!"));

  // font configure
  dungGeunMoFont = loadFont('fonts/DungGeunMo.otf');
  galmuriFont = loadFont('fonts/Galmuri7.ttf')

  // player image load
  for (let i = 0; i < 5; i++) {
    playerImgs[i] = loadImage("assets/playerAnim" + i + ".png");
  }
  currentPlayerImg = playerImgs[0]

  // map image load
  mapImg = loadImage('assets/map320_240(2).png');

  // motorgame image load
  for (let i = 1; i < 9; i++) { // 파일이름이 1부터 8임 (0부터 7이 아님)
    motorImgs[i] = loadImage("assets/motor" + i + ".png");
    motorBatteryImgs[i] = loadImage("assets/motor_battery" + i + ".png");
  }
  motorBgImg = loadImage("assets/motor_bg.png");
  motorIntroImg = loadImage("assets/motorIntroBg.png"); // 시작 화면 이미지 파일 로드

  // button image load
  buttonStartImg = loadImage("assets/buttonStart.png");
  buttonStartOverImg = loadImage("assets/buttonStartOver.png");
  buttonStartPressedImg = loadImage("assets/buttonStartPressed.png");

}

function setup() {

  // host check
  if (partyIsHost()) {
    console.log("slime online!")
  }

  // canvas draw and basic style
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont(galmuriFont);

  // shared variable setting
  shared.mainStage = 0; // 지금 어디 페이지인가?

  shared.slime = new Player(playerInitX, playerInitY);
  camera = new Camera();
  gameMap = new GameMap(mapWidth, mapHeight, mapImg);
  movingGame = new MovingGame();
  batteryChargeGame = new Motorgame();

  shared.zone = 0; // 지금 어느 미니게임 존에 있는가?
  shared.moveStop = false; // 미니게임이 열려있는가?

  // device check
  if (radians(rotationX) == 0) {
    device = 'Computer'
  } else {
    device = 'Mobile'
  }

  // motorgame 초기 설정: 총 가속도 변화율 초기화
  totalAccelerationChange = 0;
  lastMotionTime = millis();

  // 버튼 이미지 로드 완료 후 크기 설정
  buttonStartImg.loadPixels();
  buttonWidth = buttonStartImg.width;
  buttonHeight = buttonStartImg.height;

}

function draw() {

  // 마우스 좌표 재지정
  mapMouseX = mouseX - windowWidth / 2 + shared.slime.x;
  mapMouseY = mouseY - windowHeight / 2 + shared.slime.y;

  background(60);
  //scale(0.5) //전체맵 확인용 스케일

  // 각도 합산 (추후 삭제될 예정)
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
  //console.log("totalDegX:", totalDegX, "totalDegY:", totalDegY);

  // 본격적으로 게임 그리기
  switch (shared.mainStage) {
    case 0: // Intro 화면
      console.log("Intro");
      fill(220);
      rect(0, 0, windowWidth, windowHeight);
      activateButton.style.display = 'inline';
      break;



    case 1: // 스토리 설명
      console.log("Instruction");
      fill(0);
      rect(0, 0, windowWidth, windowHeight);
      activateButton.style.display = 'inline';
      break;



    case 2: // 메인 게임
      activateButton.style.display = 'none'; // 버튼 안 보이게 숨기기

      if (device == 'Computer') { // 만약 컴퓨터로 접속한다면

        // 카메라 적용 + 맵 그리기
        camera.update(shared.slime);
        camera.apply();
        gameMap.display();

        // 맵 트리거
        gameMap.displayTriggers();
        activeTrigger = gameMap.checkTriggers(shared.slime);

        // 플레이어 이미지 찾기
        if (frameCount % 5 == 0) {
          currentPlayerImg = playerImgs[currentPlayerImgFrame++ % 5];
        }

        // 캐릭터 그리기
        shared.slime.move(gameMap.obstacles);
        shared.slime.display(currentPlayerImg);

        // 트리거 영역 관련 메인 코드
        if (activeTrigger) {

          fill(255);
          rectMode(CORNER);
          rect(shared.slime.x - 50, shared.slime.y - 60, 100, 30); // 머리 위 말풍선
          fill(0);
          textSize(10);
          textAlign(CENTER, CENTER);
          text(activeTrigger.message, shared.slime.x, shared.slime.y - 45); // 말풍선 속 텍스트

          if (shared.moveStop) {
            switch (shared.zone) {
              case 0: // 5번째 미니게임 & 상태 확인(?)
                rectMode(CENTER);
                rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
                fill(255);
                textSize(50);
                text('Spawn Zone', shared.slime.x, shared.slime.y);
                break;

              case 1: // 중고거래 채팅 게임(타이핑 게임)
                rectMode(CENTER);
                rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
                fill(255);
                textSize(50);
                text('Zone 1', shared.slime.x, shared.slime.y)
                break;

              case 2: // 부품 조립 게임(나사 게임)
                rectMode(CENTER);
                rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
                fill(255);
                textSize(50);
                text('Zone 2', shared.slime.x, shared.slime.y)
                break;

              case 3: // 배터리 충전 게임(모터 게임)
                if (batteryChargeGame.gameState === "intro") {
                  // 시작 화면 표시
                  image(motorIntroImg, shared.slime.x - 400, shared.slime.y - 300, 800, 600); //맵 중앙에 800*600

                  buttonX = shared.slime.x - buttonWidth / 2;
                  buttonY = shared.slime.y + 200 - buttonHeight / 2 - 10;

                  let buttonImg;
                  if (buttonState === "normal") {
                    buttonImg = buttonStartImg;
                  } else if (buttonState === "over") {
                    buttonImg = buttonStartOverImg;
                  } else if (buttonState === "pressed") {
                    buttonImg = buttonStartPressedImg;
                  }

                  image(buttonImg, buttonX, buttonY, buttonWidth, buttonHeight);

                  console.log(`mapMouseX is ${mapMouseX}, mapMouseY is ${mapMouseY} // buttonX is ${buttonX}, buttonY is ${buttonY}`);
                } else {
                  // 게임 화면 표시
                  // 애니메이션 배경 그리기
                  noSmooth();
                  noStroke();
                  image(motorBgImg, shared.slime.x - 400, shared.slime.y - 300, 800, 600); // 6.25배 확대

                  totalAccelerationChange = 0; // 초기화

                  // 기준치를 넘는 경우에만 현재 기기의 가속도 변화를 저장
                  if (me.accelerationChange > threshold) {
                    totalAccelerationChange = me.accelerationChange;
                  }

                  // 각 게스트의 가속도 변화 값을 합산
                  for (let i = 0; i < guests.length; i++) {
                    if (guests[i].accelerationChange > threshold) {
                      totalAccelerationChange += guests[i].accelerationChange;
                    }
                  }

                  console.log(`Total Acceleration Change: ${totalAccelerationChange}`); // 합산된 가속도 변화 값을 콘솔에 출력

                  batteryChargeGame.update(totalAccelerationChange);
                  batteryChargeGame.display();
                }
                break;

              case 4: // 부스터 조종 게임(방향 게임)
                fill(255);
                rectMode(CENTER);
                rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
                movingGame.update();
                movingGame.draw();
                movingGame.degmatch();
                break;
            }
          } else { // 미니게임 창이 꺼지면 게임 진행 상황 초기화(추후 변경 및 클리어 이후 상태 추가 필요)
            switch(activeTrigger.message) {
              case "spawn zone \n press Q to interact": // 5번째 미니게임 & 스폰
                push();
                translate(700, 350);
                rectMode(CORNER);
                fill(255);
                stroke(0);
                strokeWeight(5);
                rect(0, 0, 200, 30);
                textAlign(CENTER, BOTTOM);
                textSize(30);
                text('진  행  상  황', 100, -10);
                fill(255,255,0);
                noStroke();
                rect(2.5, 2.5, progress * 50 - 2.5, 25);
                pop();
                break;
              case "Zone 1": // 중고거래 채팅 게임(타이핑 게임)
                break;
              case "Zone 2": // 부품 조립 게임(나사 게임)
                break;
              case "Zone 3": // 배터리 충전 게임(모터 게임)
                break;
              case "Zone 4": // 부스터 조종 게임(방향 게임)
                break;
            }
            if (batteryChargeGame.gameState !== 'success') {
              batteryChargeGame.reset();
            }
            movingGame.resetGame();
          }
        }
      } else { // 핸드폰으로 접속한다면
        rectMode(CORNER);
        fill('#ffcccc');
        rect(0, 0, windowWidth, windowHeight);
        fill(0);
        stroke(0);
        line(0, windowHeight / 5, windowWidth, windowHeight / 5);
        line(0, windowHeight / 5 * 2, windowWidth, windowHeight / 5 * 2);
        line(0, windowHeight / 5 * 3, windowWidth, windowHeight / 5 * 3);
        line(0, windowHeight / 5 * 4, windowWidth, windowHeight / 5 * 4);
        line(0, windowHeight, windowWidth, windowHeight);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("Spawn Zone", windowWidth / 2, windowHeight / 10);
        text("Zone 1", windowWidth / 2, windowHeight / 5 * 1.5);
        text("Zone 2", windowWidth / 2, windowHeight / 5 * 2.5);
        text("Zone 3", windowWidth / 2, windowHeight / 5 * 3.5);
        text("Zone 4", windowWidth / 2, windowHeight / 5 * 4.5);

        if (shared.moveStop) {
          textAlign(CENTER, CENTER);
          switch (shared.zone) {
            case 0:
              fill(255);
              textSize(50);
              text("Spawn Zone", windowWidth / 2, windowHeight / 10);
              break;
            case 1:
              fill(255);
              textSize(50);
              text("Zone 1", windowWidth / 2, windowHeight / 5 * 1.5);
              break;
            case 2:
              fill(255);
              textSize(50);
              text("Zone 2", windowWidth / 2, windowHeight / 5 * 2.5);
              break;
            case 3:
              fill(255);
              textSize(50);
              text("Zone 3", windowWidth / 2, windowHeight / 5 * 3.5);
              break;
            case 4:
              fill(255);
              textSize(50);
              text("Zone 4", windowWidth / 2, windowHeight / 5 * 4.5);
              break;
          }
        }
      }
      break;
    case 3:
      console.log("Ending");
      break;
  }


}

function keyPressed() {

  //맵 인터렉션
  if (keyCode === 81) {
    activeTrigger = gameMap.checkTriggers(shared.slime);
    switch (activeTrigger.message) {
      case "spawn zone \n press Q to interact":
        shared.moveStop = !shared.moveStop;
        shared.zone = 0;
        break;
      case "zone 1":
        shared.moveStop = !shared.moveStop;
        shared.zone = 1;
        break;
      case "zone 2":
        shared.moveStop = !shared.moveStop;
        shared.zone = 2;
        break;
      case "zone 3":
        shared.moveStop = !shared.moveStop;
        shared.zone = 3;
        break;
      case "zone 4":
        shared.moveStop = !shared.moveStop;
        shared.zone = 4;
        break;
    }
  }

  switch (shared.mainStage) {
    case 0:
      break;
    case 1:
      break;
    case 2: // 메인 게임
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
      break;
  }
}

function keyReleased() {
  switch (shared.mainStage) {
    case 0:
      break;
    case 1:
      break;
    case 2: // 메인 게임
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
      break;
  }
}

function mousePressed() {
  if (movingGame && typeof movingGame.handleKeyPressed === 'function') {
    movingGame.handleKeyPressed();
  } else {
    console.error("game.handleKeyPressed is not a function or game is not defined");
  }

  switch (shared.mainStage) {
    case 0:
      shared.mainStage = 1;
      break;
    case 1:
      shared.mainStage = 2;
      break;
    case 2:
      if (shared.moveStop) {
        switch (shared.zone) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            if (batteryChargeGame.gameState === "intro") {
              // 시작 화면에서 시작 버튼을 누르면 게임 시작
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                buttonState = "pressed";
              }
            }
            break;
          case 4:
            break;
        }
      }
      break;
  }
}

function mouseReleased() {

  switch (shared.mainStage) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      if (shared.moveStop) {
        switch (shared.zone) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            if (batteryChargeGame.gameState === "intro" && buttonState === "pressed") {
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                batteryChargeGame.gameState = "playing";
              }

              buttonState = "normal";
            }
            break;
          case 4:
            break;
        }
      }
      break;
  }
}

function mouseMoved() {

  switch (shared.mainStage) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      if (shared.moveStop) {
        switch (shared.zone) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            if (batteryChargeGame.gameState === "intro") {
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                buttonState = "over";
              } else {
                buttonState = "normal";
              }
            }
            break;
          case 4:
            break;
        }
      }
      break;
  }
}

function touchStarted() {
  if (device == 'Computer') {

  } else {
    for (let touch of touches) {
      activeTrigger = gameMap.checkTriggers(shared.slime);
      switch (activeTrigger.message) {
        case "spawn zone \n press Q to interact":
          if (touch.x > 0 && touch.x < windowWidth && touch.y > 0 && touch.y < windowHeight / 5) {
            shared.moveStop = !shared.moveStop;
            shared.zone = 0;
          }
          break;
        case "zone 1":
          if (touch.x > 0 && touch.x < windowWidth && touch.y > windowHeight / 5 && touch.y < windowHeight / 5 * 2) {
            shared.moveStop = !shared.moveStop;
            shared.zone = 1;
          }
          break;
        case "zone 2":
          if (touch.x > 0 && touch.x < windowWidth && touch.y > windowHeight / 5 * 2 && touch.y < windowHeight / 5 * 3) {
            shared.moveStop = !shared.moveStop;
            shared.zone = 2;
          }
          break;
        case "zone 3":
          if (touch.x > 0 && touch.x < windowWidth && touch.y > windowHeight / 5 * 3 && touch.y < windowHeight / 5 * 4) {
            shared.moveStop = !shared.moveStop;
            shared.zone = 3;
          }
          break;
        case "zone 4":
          if (touch.x > 0 && touch.x < windowWidth && touch.y > windowHeight / 5 * 4 && touch.y < windowHeight) {
            shared.moveStop = !shared.moveStop;
            shared.zone = 4;
          }
          break;
      }
    }
  }
}