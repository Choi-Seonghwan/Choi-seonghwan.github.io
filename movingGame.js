class MovingGame {
    constructor() {
      this.directions = [];
      this.currentDirections = [];
      this.round = 1;
      this.maxRounds = 5;
      this.baseTimeLimit = 30000; // 기본 30초
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
      // 만약 라운드가 다 달성되면 게임이 종료되고 재시작 버튼이 나옴
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
      const directions = ['UP', 'LEFT', 'DOWN', 'RIGHT'];  //string으로 direction을 저장
      return random(directions);
    }
  
    getTimeLimit() {
      return this.baseTimeLimit + this.round * 1000; // 라운드마다 1초 추가
    }
  
    update() {
      if (this.gameOver) {
        return;
      }
  
      // 시간 초과시 게임오버 및 재시작 버튼 등장
      if (millis() - this.startTime > this.getTimeLimit()) {
        this.gameOver = true;
        this.restartButton.show();
      }
    }
  
    draw() {
  
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
      //방향키 화면에 띄우기
      this.drawDirections();
      //타이머 화면에 띄우기
      this.drawTimer();
    }
  
    //게임시작시 화면
    drawStartScreen() {
        fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text('Press any key to start', shared.slime.x, shared.slime.y - 100);
    }
  
    //시간 초과시 화면
    drawGameOverScreen() {
        fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text('Times Up! You Lost!', shared.slime.x, shared.slime.y - 40);
      this.restartButton.show();
    }
  
    //게임완료 시 화면
    drawSuccessScreen() {
        fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text('Congratulations! You Won!', shared.slime.x, shared.slime.y - 40);
      this.restartButton.show();
    }
  
    //화면에 방향키 띄우기
    drawDirections() {
        fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      for (let i = 0; i < this.currentDirections.length; i++) {
        text(this.getArrowSymbol(this.currentDirections[i]), shared.slime.x + (i - this.currentDirections.length / 2) * 50, shared.slime.y);
      }
    }
    //화면에 타이머 띄우기
    drawTimer() {
      let elapsedTime = millis() - this.startTime;
      let timerWidth = map(elapsedTime, 0, this.getTimeLimit(), shared.slime.x - windowWidth * 0.4, shared.slime.x + windowWidth * 0.4);
      fill(255, 0, 0);
      rectMode(CORNER);
      rect(shared.slime.x - windowWidth * 0.4, shared.slime.y + windowHeight * 0.4 - 20, shared.slime.x + windowWidth * 0.4 - timerWidth, 20);
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
  
    //방향키대로 기울이는지 확인
    degmatch() {
      let inputDirection = null;
      if (radians(totalDegX) > 1) {
        inputDirection = 'RIGHT';
      } else if (radians(totalDegX) < -1) {
        inputDirection = 'LEFT';
      } else if (radians(totalDegY) > 1) {
        inputDirection = 'UP';
      } else if (radians(totalDegY) < -1) {
        inputDirection = 'DOWN';
      }
  
      // 첫 번째 방향과 현재 방향을 비교하여 일치하면 첫 번째 방향만 제거
      if (inputDirection && this.currentDirections.length > 0 && inputDirection === this.currentDirections[0]) {
        this.currentDirections.shift(); // 첫 번째 방향만 제거
        console.log("Input matched:", inputDirection, "Remaining directions:", this.currentDirections);
        if (this.currentDirections.length === 0) {
          this.round++;
          this.startNewRound();
        }
      }
    }
  
    //리셋게임
    resetGame() {
      this.round = 1;
      this.gameOver = false;
      this.gameStarted = false;
      this.success = false;
      this.restartButton.hide();
      this.startNewRound();
    }
  
    //입력한 방향을 방향키로 적용하는 함수
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