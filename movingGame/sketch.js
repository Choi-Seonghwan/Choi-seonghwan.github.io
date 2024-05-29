class Game {
  constructor() {
    this.directions = [];
    this.currentDirections = [];
    this.round = 1;
    this.maxRounds = 5;
    this.baseTimeLimit = 3000; // 기본 3초
    this.startTime = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton = createButton('Restart');
    this.restartButton.position(width / 2 - 50, height / 2 + 20);
    this.restartButton.size(100, 50);
    this.restartButton.mousePressed(() => this.resetGame());
    this.restartButton.hide();
  }

  startNewRound() {
    if (this.round > this.maxRounds) {
      this.success = true;
      this.gameOver = true;
      this.restartButton.show();
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
    return this.baseTimeLimit + this.round * 1000; // 라운드마다 1초 추가
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (millis() - this.startTime > this.getTimeLimit()) {
      this.gameOver = true;
      this.restartButton.show();
    }
  }

  draw() {
    background(220);

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

    this.drawDirections();
    this.drawTimer();
  }

  drawStartScreen() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Press any key to start', width / 2, height / 2);
  }

  drawGameOverScreen() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Time\'s Up! You Lost!', width / 2, height / 2 - 40);
    this.restartButton.show();
  }

  drawSuccessScreen() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Congratulations! You Won!', width / 2, height / 2 - 40);
    this.restartButton.show();
  }

  drawDirections() {
    textSize(32);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.currentDirections.length; i++) {
      text(this.getArrowSymbol(this.currentDirections[i]), width / 2 + (i - this.currentDirections.length / 2) * 50, height / 2);
    }
  }

  drawTimer() {
    let elapsedTime = millis() - this.startTime;
    let timerWidth = map(elapsedTime, 0, this.getTimeLimit(), width, 0);
    fill(255, 0, 0);
    rect(0, height - 20, timerWidth, 20);
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

    let inputDirection;
    if (key === 'W' || key === 'w') {
      inputDirection = 'UP';
    } else if (key === 'A' || key === 'a') {
      inputDirection = 'LEFT';
    } else if (key === 'S' || key === 's') {
      inputDirection = 'DOWN';
    } else if (key === 'D' || key === 'd') {
      inputDirection = 'RIGHT';
    }

    if (inputDirection) {
      let keyIndex = this.currentDirections.indexOf(inputDirection);
      if (keyIndex !== -1) {
        this.currentDirections.splice(keyIndex, 1);
        if (this.currentDirections.length === 0) {
          this.round++;
          this.startNewRound();
        }
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

let game;

function setup() {
  createCanvas(800, 600);
  game = new Game();
}

function draw() {
  game.update();
  game.draw();
}

function keyPressed() {
  game.handleKeyPressed();
}
