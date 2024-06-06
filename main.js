let shared;
let clickCount;
let guests;
let me;
let game;
let totalDegX;
let totalDegY;
let lastDirectionText = "";
let boostIntroBg;
let buttonStart, buttonStartOver, buttonStartPressed;
let buttonAgain, buttonAgainOver, buttonAgainPressed;
let buttonClose, buttonCloseOver, buttonClosePressed;

let boostImgBg;
let boostImgs = [];
let boostButtonImgs = [];
let successBg, gameoverBg;

document.addEventListener("DOMContentLoaded", function () {
  const activateButton = document.getElementById('activateButton');
  if (activateButton) {
    activateButton.addEventListener('click', onClick);
  } else {
    console.error("Activate button not found.");
  }
});

function onClick() {
  console.log("Activate button clicked");
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          console.log("Permission granted");
          window.addEventListener('deviceorientation', cb);
        } else {
          console.log("Permission denied");
        }
      })
      .catch(error => {
        console.error("Error requesting permission:", error);
      });
  } else {
    console.log("DeviceOrientationEvent.requestPermission is not a function");
    window.addEventListener('deviceorientation', cb);
  }
}

function cb(event) {
  console.log("Device orientation event triggered");
  if (event.gamma !== null) {
    me.degY = radians(event.gamma);
    console.log("degY:", me.degY);
  }
  if (event.beta !== null) {
    me.degX = radians(event.beta);
    console.log("degX:", me.degX);
  }
  // Sync with party.js
  partySetShared(me);
  console.log("Shared me:", me);
}

function preload() {
  console.log("preload called");
  partyConnect(
    "wss://demoserver.p5party.org",
    "party_circle"
  );
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  guests = partyLoadGuestShareds();
  me = partyLoadMyShared({ degX: 0, degY: 0 });
  console.log("me initialized:", me);

  dungGeunMoFont = loadFont('fonts/DungGeunMo.otf');

  buttonStart = loadImage('buttons/buttonStart.png');
  buttonStartOver = loadImage('buttons/buttonStartOver.png');
  buttonStartPressed = loadImage('buttons/buttonStartPressed.png');
  buttonAgain = loadImage('buttons/buttonAgain.png');
  buttonAgainOver = loadImage('buttons/buttonAgainOver.png');
  buttonAgainPressed = loadImage('buttons/buttonAgainPressed.png');
  buttonClose = loadImage('buttons/buttonClose.png');
  buttonCloseOver = loadImage('buttons/buttonCloseOver.png');
  buttonClosePressed = loadImage('buttons/buttonClosePressed.png');

  boostIntroBg = loadImage('assets/boost/boostIntroBg.png');
  boostImgBg = loadImage('assets/boost/boostBg.png');
  for (i = 0; i < 5; i++) {
    boostImgs[i] = loadImage('assets/boost/boost' + i + '.png');
  }
  boostButtonImgs[0] = loadImage('assets/boost/boostButton0.png');
  boostButtonImgs[1] = loadImage('assets/boost/boostButton1.png');

  successBg = loadImage('assets/successBg.png');
  gameoverBg = loadImage('assets/gameoverBg.png');
}

function setup() {
  console.log("setup called");
  createCanvas(800, 600);
  noStroke();
  textFont(dungGeunMoFont);

  if (partyIsHost()) {
    shared.x = 200;
    shared.y = 200;
  }

  game = new MovingGame();
  totalDegX = 0;
  totalDegY = 0;

  // 엔터키 이벤트 핸들러 추가
  window.addEventListener('keydown', handleKeyDown);
}

function draw() {
  totalDegX = 0;
  totalDegY = 0;
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] && guests[i].degX !== undefined && guests[i].degY !== undefined) {
      totalDegX += guests[i].degX;
      totalDegY += guests[i].degY;
    }
  }
  console.log("totalDegX:", totalDegX, "totalDegY:", totalDegY);
  game.update();
  game.draw(totalDegX, totalDegY);
}

// 엔터키 이벤트 핸들러
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    console.log("Enter key pressed");
    game.degmatch(totalDegX, totalDegY);
  }
}

class MovingGame {
  constructor() {
    this.directions = [];
    this.currentDirections = [];
    this.round = 1;
    this.maxRounds = 5;
    this.baseTimeLimit = 30000;
    this.startTime = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton = createButton('Restart');
    this.restartButton.position(width / 2 - 100, height - 200);
    this.restartButton.size(100, 50);
    this.restartButton.mousePressed(() => this.resetGame());
    this.restartButton.hide();
    this.isButtonPressed = false;
    this.isButtonOver = false;
    this.isButtonPressedAgain = false;
    this.isButtonOverAgain = false;
    this.isButtonPressedClose = false;
    this.isButtonOverClose = false;
  }

  startNewRound() {
    if (this.round > this.maxRounds) {
      this.success = true;
      this.gameOver = true;
      return;
    }

    this.directions = [];
    for (let i = 0; i < 2 * this.round + 3; i++) {
      this.directions.push(this.randomDirection());
    }
    this.currentDirections = [...this.directions];
    this.startTime = millis();
  }

  randomDirection() {
    const directions = ['UP', 'LEFT', 'DOWN', 'RIGHT'];
    return random(directions);
  }

  getTimeLimit() {
    return this.baseTimeLimit + this.round * 1000;
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (millis() - this.startTime > this.getTimeLimit()) {
      this.gameOver = true;
    }
  }

  draw(storedDegX, storedDegY) {
    background(220, 0);

    if (!this.gameStarted) {
      this.drawStartScreen();
      return;
    }

    if (this.gameOver) {
      if (this.success) {
        this.drawSuccessScreen();
      } else {
        this.drawGameOverScreen();
      }
      return;
    }

    image(boostImgBg, 0, 0, 800, 600);
    let boostButtonPressed = 0;
    if (keyIsPressed === true && keyCode === ENTER) boostButtonPressed = 1;
    else boostButtonPressed = 0;
    image(boostButtonImgs[boostButtonPressed], 0, 0, 800, 600);

    let boostDirection = 0;
    if (storedDegY > 0.5) {
      boostDirection = 4;
    } else if (storedDegY < -0.5) {
      boostDirection = 3;
    } else if (storedDegX > 0.5) {
      boostDirection = 2;
    } else if (storedDegX < -0.5) {
      boostDirection = 1;
    }

    image(boostImgs[boostDirection], 0, 0, 800, 600);

    this.drawDirections();
    this.drawTimer();
  }

  drawStartScreen() {
    image(boostIntroBg, 0, 0, 800, 600);
    let img;
    if (this.isButtonPressed) {
      img = buttonStartPressed;
    } else if (this.isButtonOver) {
      img = buttonStartOver;
    } else {
      img = buttonStart;
    }
    noSmooth();
    imageMode(CENTER);
    image(img, width / 2, height * 5 / 6, 200, 87.5);
    imageMode(CORNER);
  }

  drawGameOverScreen() {
    image(gameoverBg, 0, 0, 800, 600);
    let img;
    if (this.isButtonPressedAgain) {
      img = buttonAgainPressed;
    } else if (this.isButtonOverAgain) {
      img = buttonAgainOver;
    } else {
      img = buttonAgain;
    }
    imageMode(CENTER);
    image(img, width / 2, height * 5 / 6, 200, 87.5);
    imageMode(CORNER);
  }

  drawSuccessScreen() {
    image(successBg, 0, 0, 800, 600);
    let img;
    if (this.isButtonPressedClose) {
      img = buttonClosePressed;
    } else if (this.isButtonOverClose) {
      img = buttonCloseOver;
    } else {
      img = buttonClose;
    }
    imageMode(CENTER);
    image(img, width / 2, height * 5 / 6, 200, 87.5);
    imageMode(CORNER);
  }

  drawDirections() {
    textSize(100);
    fill('#A6E31E');   
    stroke('#31293d');
    strokeWeight(10);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.currentDirections.length; i++) {
      text(this.getArrowSymbol(this.currentDirections[i]), width / 2 + (i - this.currentDirections.length / 2) * 100 + 50, height * 1 / 6);
    }
    textSize(32);
  }

  drawTimer() {
    let elapsedTime = millis() - this.startTime;
    let timerWidth = map(elapsedTime, 150, this.getTimeLimit(), width, 0);

    fill('#31293d');
    stroke('#31293d');
    strokeWeight(5);
    rect(50, height - 64, width - 100, 20);
    noStroke();
    fill('#A6E31E');
    rect(50, height - 62, timerWidth - 100, 16);
  }

  handleKeyPressed() {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startNewRound();
      return;
    }

    if (this.gameOver) {
      return;
    }
  }

  degmatch(storedDegX, storedDegY) {
    let inputDirection = null;
    fill(0);
    if (storedDegY > 0.5) {
      inputDirection = 'RIGHT';
    } else if (storedDegY < -0.5) {
      inputDirection = 'LEFT';
    } else if (storedDegX > 0.5) {
      inputDirection = 'DOWN';
    } else if (storedDegX < -0.5) {
      inputDirection = 'UP';
    }

    if (inputDirection && this.currentDirections.length > 0 && inputDirection === this.currentDirections[0]) {
      this.currentDirections.shift();
      console.log("Input matched:", inputDirection, "Remaining directions:", this.currentDirections);
      if (this.currentDirections.length === 0) {
        this.round++;
        this.startNewRound();
      } else {
        lastDirectionText = `StoredDegX: ${storedDegX.toFixed(2)}, StoredDegY: ${storedDegY.toFixed(2)}, Direction: ${inputDirection}`;
      }
    }
  }

  resetGame() {
    this.round = 1;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton.hide();
    this.startNewRound();
  }

  getArrowSymbol(direction) {
    switch (direction) {
      case 'UP':
        return '↑';
      case 'LEFT':
        return '←';
      case 'DOWN':
        return '↓';
      case 'RIGHT':
        return '→';
    }
  }
}

function mousePressed() {
  if (game && typeof game.handleKeyPressed === 'function') {
    game.handleKeyPressed();
  } else {
    console.error("game.handleKeyPressed is not a function or game is not defined");
  }

  if (!game.gameStarted && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
    game.isButtonPressed = true;
    game.startGame();
  }

  if (game.gameOver && !game.success && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
    game.isButtonPressedAgain = true;
    game.resetGame();
  }

  if (game.gameOver && game.success && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
    game.isButtonPressedClose = true;
    game.closeGame();
  }
}

function mouseReleased() {
  game.isButtonPressed = false;
  game.isButtonPressedAgain = false;
  game.isButtonPressedClose = false;
}

function mouseMoved() {
  if (!game.gameStarted && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
    game.isButtonOver = true;
  } else {
    game.isButtonOver = false;
  }

  if (game.gameOver && !game.success && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
    game.isButtonOverAgain = true;
  } else {
    game.isButtonOverAgain = false;
  }

  if (game.gameOver && game.success && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height * 5 / 6 - 43.75 && mouseY < height * 5 / 6 + 43.75) {
    game.isButtonOverClose = true;
  } else {
    game.isButtonOverClose = false;
  }
}


