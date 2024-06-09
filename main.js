//p5.party 기본
let shared; // 현재 mainStage, slime, zone, moveStop 있음
let me;
let guests;

// computer & mobile intro image & instruction & ending
let computerTitle, mobileTitle;
let instructionBg;
let endingBg;

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

let progress = 3; // 0은 채팅 게임, 1은 나사 게임, 2는 모터 게임, 3은 조종 게임, 4는 닷지 게임

// zone trigger
let keyPressedTrigger = false;
let activeTrigger = null;

// device classification
let device;

// chat game
let chatIntroImg;
let chatBgImg;
let chatPfpPurple, chatPfpMe;

// screw game
let screwGame;
let checkpointPassed = [false, false, false]; // 체크포인트 통과 여부를 저장
let rotationCount = 0; // 회전 수를 저장
let screwImgs = new Array(8);
let screwSelectedImgs = new Array(8);
let screwBgImg;
let screwIntroImg;

let centerX, centerY;
let totalDeg, pTotalDeg;
let halfCount = 0
let count = 0;
let pCount
let pANum = 0;
let areaNum = 0;
let clockWise = {
  1: false,
  2: false,
  3: false,
};
let antiClockWise = {
  1: false,
  2: false,
  3: false,
};

// moving game
let movingGame;
let totalDegX = 0;
let totalDegY = 0;
let lastDirectionText = "";
let boostIntroBg;
let boostImgBg;
let boostImgs = [];
let boostButtonImgs = [];

let saveDegX = 0;
let saveDegY = 0;

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

// font
let dungGeunMoFont, galmuriFont, galmuriFontChat;

// minigame success and over image
let successBg, gameoverBg;

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
  galmuriFont = loadFont('fonts/Galmuri7.ttf');
  galmuriFontChat = loadFont('fonts/Galmuri9.ttf');

  // title & instruction & ending image load
  computerTitle = loadImage('assets/titleBg.png');
  mobileTitle = loadImage("assets/titleMobile.png");
  instructionBg = loadImage("assets/instruction.png");
  endingBg = loadImage("assets/ending.png");

  // player image load
  for (let i = 0; i < 5; i++) {
    playerImgs[i] = loadImage("assets/playerAnim" + i + ".png");
  }
  currentPlayerImg = playerImgs[0]

  // map image load
  mapImg = loadImage('assets/map320_240(2).png');

  // minigame success & over image load
  successBg = loadImage("assets/successBg.png");
  gameoverBg = loadImage('assets/gameoverBg.png');

  // chat game image load
  chatIntroImg = loadImage('assets/chatIntroBg.png');
  chatBgImg = loadImage('assets/chatBg.png');
  chatPfpPurple = loadImage('assets/chatPfpPurple.png');
  chatPfpMe = loadImage('assets/chatPfpMe.png');

  // screw game image load
  for (let i = 0; i < 4; i++) { // 파일이름이 1부터 4임 (0부터 3이 아님)
    screwSelectedImgs[i] = loadImage("assets/screwSelected" + (i + 1) + ".png");
  }
  for (let i = 0; i < 8; i++) { // 파일이름이 1부터 8임 (0부터 7이 아님)
    screwImgs[i] = loadImage("assets/screw" + (i + 1) + ".png");
  }

  screwBgImg = loadImage("assets/screwBg.png");
  screwIntroImg = loadImage("assets/screwIntroBg.png"); // 시작 화면 이미지 파일 로드

  // motorgame image load
  for (let i = 1; i < 9; i++) { // 파일이름이 1부터 8임 (0부터 7이 아님)
    motorImgs[i] = loadImage("assets/motor" + i + ".png");
    motorBatteryImgs[i] = loadImage("assets/motor_battery" + i + ".png");
  }
  motorBgImg = loadImage("assets/motor_bg.png");
  motorIntroImg = loadImage("assets/motorIntroBg.png"); // 시작 화면 이미지 파일 로드

  // movinggame image load
  boostIntroBg = loadImage('assets/boostIntroBg.png');
  boostImgBg = loadImage('assets/boostBg.png');
  for (i = 0; i < 5; i++) {
    boostImgs[i] = loadImage('assets/boost' + i + '.png');
  }
  boostButtonImgs[0] = loadImage('assets/boostButton0.png');
  boostButtonImgs[1] = loadImage('assets/boostButton1.png');

  // button image load
  buttonStartImg = loadImage("assets/buttonStart.png");
  buttonStartOverImg = loadImage("assets/buttonStartOver.png");
  buttonStartPressedImg = loadImage("assets/buttonStartPressed.png");
  buttonAgainImg = loadImage('assets/buttonAgain.png');
  buttonAgainOverImg = loadImage('assets/buttonAgainOver.png');
  buttonAgainPressedImg = loadImage('assets/buttonAgainPressed.png');
  buttonCloseImg = loadImage('assets/buttonClose.png');
  buttonCloseOverImg = loadImage('assets/buttonCloseOver.png');
  buttonClosePressedImg = loadImage('assets/buttonClosePressed.png');

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

  chatGame = new ChatBot();

  screwGame = new ScrewGame();
  screwGame.setup();
  totalDeg = 0;

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

  textFont(galmuriFont); // 채팅 게임이 끝나도 폰트 재지정

  // 마우스 좌표 재지정
  mapMouseX = mouseX - windowWidth / 2 + shared.slime.x;
  mapMouseY = mouseY - windowHeight / 2 + shared.slime.y;

  background(60);
  //scale(0.5) //전체맵 확인용 스케일

  totalDegX = 0; // 합산된 회전 값을 초기화
  totalDegY = 0;

  for (let i = 0; i < guests.length; i++) {
    if (guests[i] && guests[i].degX !== undefined && guests[i].degY !== undefined) {
      totalDegX += guests[i].degX; // 각 게스트의 X축 기울기를 합산
      totalDegY += guests[i].degY; // 각 게스트의 Y축 기울기를 합산
    }
  }
  console.log("totalDegX:", totalDegX, "totalDegY:", totalDegY);

  // 본격적으로 게임 그리기
  switch (shared.mainStage) {
    case 0: // Intro 화면
      if (device == 'Computer') {
        background('#31293D');
        imageMode(CENTER);
        noSmooth();
        image(computerTitle, windowWidth / 2, windowHeight / 2 - 50, computerTitle.width * 3, computerTitle.height * 3);
        imageMode(CORNER);
      } else {
        background('#31293D');
        imageMode(CENTER);
        image(mobileTitle, windowWidth / 2, windowHeight / 2, image.width, image.height); // 집 가서 태블릿으로 맞출 예정
        imageMode(CORNER);
      }
      activateButton.style.display = 'inline';
      break;



    case 1: // 스토리 설명
      background('#31293D');
      imageMode(CENTER);
      noSmooth();
      image(instructionBg, windowWidth / 2, windowHeight / 2, computerTitle.width * 3, computerTitle.height * 3);
      imageMode(CORNER);
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
                if (progress == 4) {
                  rectMode(CENTER);
                  rect(shared.slime.x, shared.slime.y, windowWidth * 0.8, windowHeight * 0.8);
                  fill(255);
                  textSize(50);
                  text('Spawn Zone', shared.slime.x, shared.slime.y);
                } else {
                  console.log('You Should Clear Manipulation Game.');
                  shared.moveStop = !shared.moveStop;
                }
                break;

              case 1: // 중고거래 채팅 게임(타이핑 게임)

                if (progress >= 0) {                
                  textFont(galmuriFontChat);
                  buttonX = shared.slime.x - buttonWidth / 2;
                  buttonY = shared.slime.y + 200 - buttonHeight / 2 - 10;
  
                  chatGame.draw();
                } else {
                  console.log("You've already cleared chat game.");
                  shared.moveStop = !shared.moveStop;
                }

                break;

              case 2: // 부품 조립 게임(나사 게임)

                if (progress >= 1) {
                  if (screwGame.gameState === "intro") {
                    // 시작 화면 표시
                    image(screwIntroImg, shared.slime.x - 400, shared.slime.y - 300, 800, 600); //맵 중앙에 800*600
                
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
                  } else {
                    // 게임 화면 표시
                    // 애니메이션 배경 그리기
                    noSmooth();
                    noStroke();
                    image(screwBgImg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);
                
                    // 각 게스트의 회전 값을 합산
                    totalDeg = 0; // 합산된 회전 값을 초기화
                    for (let i = 0; i < guests.length; i++) {
                      totalDeg += guests[i].degY; // 각 게스트의 y축 기울기를 합산
                    }
                    console.log("totalDeg");
                    console.log(totalDeg);

                    screwGame.draw();

                    console.log(totalDeg);
                  }
                } else {
                  if (progress < 1) {
                  console.log('You Should Clear Chat Game.');
                  shared.moveStop = !shared.moveStop;
                  } else {
                    console.log("You've already cleared Assemble game.");
                    shared.moveStop = !shared.moveStop;
                  }
                }

                break;

              case 3: // 배터리 충전 게임(모터 게임)
                if (progress >= 2) {
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

                    if (keyIsPressed) { // 아무 키나 누르면 가속도가 오름(추후 삭제)
                      totalAccelerationChange += 100;
                    } else {
                      totalAccelerationChange--;
                    }

                    batteryChargeGame.update(totalAccelerationChange);
                    batteryChargeGame.display();
                  }
                } else {
                  console.log('You Should Clear Assemble Game.');
                  shared.moveStop = !shared.moveStop;
                }
                break;

              case 4: // 부스터 조종 게임(방향 게임)

                if (progress >= 3) {
                  buttonX = shared.slime.x - buttonWidth / 2;
                  buttonY = shared.slime.y + 200 - buttonHeight / 2 - 10;

                  movingGame.update();
                  movingGame.draw(totalDegX, totalDegY);
                } else {
                  console.log('You Should Clear Motor Game.');
                  shared.moveStop = !shared.moveStop;
                }

                break;
            }
          } else { // 미니게임 창이 꺼지면 게임 진행 상황 초기화(추후 변경 및 클리어 이후 상태 추가 필요)
            switch (activeTrigger.message) {
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
                fill(255, 255, 0);
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
            if (!chatGame.isGameOver && !chatGame.isGameSuccess) {
              chatGame.inputBox.hide();
              chatGame.initGame();
            }
            if (!screwGame.isGameSuccess) {
              screwGame.resetGame();
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

  //맵 인터렉션 (추후 삭제)
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

  // 나사 스페이스바로 돌리기(추후 삭제)
  if (key === ' ') { // 스페이스바를 눌렀을 때
    if (screwGame.selectedScrew) { // 선택된 나사가 있는 경우
      screwGame.selectedScrew.move(); // 나사를 회전시킴
    }
  }

  if (keyCode === ENTER){

    saveDegX = totalDegX
    saveDegY = totalDegY
    movingGame.degmatch(saveDegX, saveDegY);
    saveDegX = 0
    saveDegY = 0
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

      switch (keyCode) { // 방향 조작
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
  // if (movingGame && typeof movingGame.handleKeyPressed === 'function') {
  //   movingGame.handleKeyPressed();
  // } else {
  //   console.error("game.handleKeyPressed is not a function or game is not defined");
  // }

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
            if (!chatGame.isGameStarted && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              chatGame.isButtonPressed = true;
            }

            if (chatGame.isGameOver && !chatGame.isGameSuccess && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              chatGame.isButtonPressedAgain = true;
            }

            // if (chatGame.isGameOver && chatGame.isGameSuccess && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
            //   chatGame.isButtonPressedClose = true;
            //   chatGame.closeGame();
            // }
            break;
          case 2:
            screwGame.mousePressed(); // 미니게임 1 마우스 클릭 처리
            if (screwGame.gameState === "intro") {
              // 시작 화면에서 시작 버튼을 누르면 게임 시작
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                buttonState = "pressed";
              }
            } else if (screwGame.isGameOver || screwGame.isGameSuccess) {
              // 게임 오버 또는 성공 화면에서 다시 시작 버튼을 누르면 게임 리셋
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                buttonState = "pressed";
              }
            }
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
            if (!movingGame.gameStarted && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              movingGame.isButtonPressed = true;
            }
          
            if (movingGame.gameOver && !movingGame.success && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              movingGame.isButtonPressedAgain = true;
            }
          
            // if (movingGame.gameOver && movingGame.success && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
            //   movingGame.isButtonPressedClose = true;
            //   movingGame.closeGame();
            // }
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
            if (!chatGame.isGameStarted) {
              chatGame.isButtonPressed = false;
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                chatGame.startGame();
              }
            }
            if (chatGame.isGameOver && !chatGame.isGameSuccess) {
              chatGame.isButtonPressedAgain = false;
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                chatGame.initGame();
              }
            }
            // chatGame.isButtonPressedClose = false;
            break;
          case 2:
            if (screwGame.gameState === "intro" && buttonState === "pressed") {
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                screwGame.gameState = "playing";
              }
              buttonState = "normal";
            } else if ((screwGame.isGameOver || screwGame.isGameSuccess) && buttonState === "pressed") {
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                screwGame.resetGame();
              }
              buttonState = "normal";
            }
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
            if (!movingGame.gameStarted) {
              movingGame.isButtonPressed = false;
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                movingGame.handleKeyPressed();
              }
            }
            if (movingGame.gameOver && !movingGame.success) {
              movingGame.isButtonPressedAgain = false;
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                movingGame.resetGame();
              }
            }
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
            if (!chatGame.isGameStarted && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              chatGame.isButtonOver = true;
            } else {
              chatGame.isButtonOver = false;
            }

            if (chatGame.isGameOver && !chatGame.isGameSuccess && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              chatGame.isButtonOverAgain = true;
            } else {
              chatGame.isButtonOverAgain = false;
            }

            // if (chatGame.isGameOver && chatGame.isGameSuccess && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
            //   chatGame.isButtonOverClose = true;
            // } else {
            //   chatGame.isButtonOverClose = false;
            // }
            break;
          case 2:
            if (screwGame.gameState === "intro") {
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                buttonState = "over";
              } else {
                buttonState = "normal";
              }
            } else if (screwGame.isGameOver || screwGame.isGameSuccess) {
              // 게임 오버 또는 성공 화면에서 버튼 위에 마우스가 있을 때 상태 업데이트
              if (mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
                buttonState = "over";
              } else {
                buttonState = "normal";
              }
            }
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
            if (!movingGame.gameStarted && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              movingGame.isButtonOver = true;
            } else {
              movingGame.isButtonOver = false;
            }
          
            if (movingGame.gameOver && !movingGame.success && mapMouseX > buttonX && mapMouseX < buttonX + buttonWidth && mapMouseY > buttonY && mapMouseY < buttonY + buttonHeight) {
              movingGame.isButtonOverAgain = true;
            } else {
              movingGame.isButtonOverAgain = false;
            }
          
            // if (game.gameOver && game.success && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
            //   game.isButtonOverClose = true;
            // } else {
            //   game.isButtonOverClose = false;
            // }
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

function area(totalDeg) {
  if (totalDeg > PI / 2 / 4 && totalDeg < (PI / 2 * 3) / 4) {
    return 1;
  } else if (totalDeg > -PI / 2 / 4 && totalDeg < PI / 2 / 4) {
    return 2;
  } else if (totalDeg > (-PI / 2 * 3) / 4 && totalDeg < -PI / 2 / 4) {
    return 3;
  }
  return 0;
}

function updateDirection() {
  if (pANum == 0) {
    if (areaNum == 1) {
      clockWise[1] = true;
    } else if (areaNum == 3) {
      antiClockWise[3] = true;
    }
  } else if (pANum == 1) {
    if (areaNum == 0) {
      clockWise[1] = false;
    } else if (areaNum == 2) {
      clockWise[2] = true;
      antiClockWise[1] = false;
    }
  } else if (pANum == 2) {
    if (areaNum == 1) {
      clockWise[2] = false;
      antiClockWise[1] = true;
    } else if (areaNum == 3) {
      clockWise[3] = true;
      antiClockWise[2] = false;
    }
  } else if (pANum == 3) {
    if (areaNum == 0) {
      antiClockWise[3] = false;
    } else if (areaNum == 2) {
      clockWise[3] = false;
      antiClockWise[2] = true;
    }
  }
}

function updateCount() {
  if (totalDeg < 0 && pTotalDeg > 0) {
    // anticlockwise
    if (antiClockWise[1] && antiClockWise[2] && antiClockWise[3]) {
      halfCount += 1;
      antiClockWise = {
        1: false,
        2: false,
        3: false,
      };
      // game.selectedScrew.move();
      // halfCount =0; // 카운트 초기화 // 나사를 회전시킴
    }
  }
  if (totalDeg > 0 && pTotalDeg < 0) {
    // clockwise
    if (clockWise[1] && clockWise[2] && clockWise[3]) {
      halfCount -= 1;
      clockWise = {
        1: false,
        2: false,
        3: false,
      };
    }
  }
  count = int(halfCount / 2)
}

// // radians() 함수는 degrees를 라디안으로 변환합니다.
// function radians(degrees) {
//   return degrees * (Math.PI / 180);
// }