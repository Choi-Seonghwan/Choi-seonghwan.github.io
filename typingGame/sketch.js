let dungGeunMoFont;
let buttonStart, buttonStartOver, buttonStartPressed;
let chatBot;

function preload() {
  dungGeunMoFont = loadFont('fonts/Galmuri7.ttf');
  buttonStart = loadImage('buttons/buttonStart.png');
  buttonStartOver = loadImage('buttons/buttonStartOver.png');
  buttonStartPressed = loadImage('buttons/buttonStartPressed.png');
  buttonAgain = loadImage('buttons/buttonAgain.png');
  buttonAgainOver = loadImage('buttons/buttonAgainOver.png');
  buttonAgainPressed = loadImage('buttons/buttonAgainPressed.png');
  buttonClose = loadImage('buttons/buttonClose.png');
  buttonCloseOver = loadImage('buttons/buttonCloseOver.png');
  buttonClosePressed = loadImage('buttons/buttonClosePressed.png');
}

class ChatBot {
  constructor() {
    this.initGame();
  }

  initGame() {
    this.userMessages = []; // 사용자의 입력 메시지를 저장하는 배열
    this.assistantMessages = []; // 챗봇의 응답 메시지를 저장하는 배열
    this.userInput = ""; // 사용자의 입력을 저장하는 변수
    this.expectedInputs = []; // 사용자가 입력해야 할 텍스트 목록
    this.currentInputIndex = 0; // 현재 입력해야 할 텍스트의 인덱스
    this.isGameOver = false; // 게임 오버 상태
    this.isGameSuccess = false; // 게임 성공 상태
    this.isGameStarted = false; // 게임 시작 상태

    this.inputBox = createInput(); // 사용자의 입력을 받는 입력창
    this.inputBox.position((windowWidth - (width - 1000)) / 2, height - 150);
    this.inputBox.size(width - 1000, 80);
    this.inputBox.changed(this.sendMessage.bind(this)); // 입력 완료 후 sendMessage() 함수 호출
    this.inputBox.hide(); // 처음에는 입력창을 숨김

    this.assistantMessages.push("구매문의 주신 분 맞으세요?");

    this.expectedInputs = [
      "네! 혹시 이 부품 팔렸을까요?",
      "그렇군요^^ 제가 구매하고 싶은데 혹시 얼마까지 생각하세요?",
      "아... 제가 학생이라 혹시 조금만 깎아주실 수 있을까요?",
      "사실...",
      "제가 고백하고 싶은 사람이 있습니다!",
      "혹시 조금만 깎아주실 수 있을까요?",
      "네 그럼 정가로 사겠습니다. 주소는 $%#^입니다."
    ];

    this.assistantReplies = [
      "아니요, 아직요.",
      "네고는 없습니다. 올린 가격으로 받아요.",
      "학생인데 이게 왜 필요하세요?",
      "네",
      "오",
      "아뇨",
      "알겠습니다. 배송 주소를 확인했습니다."
    ];

    this.resetTimer();
  }

  startGame() {
    this.isGameStarted = true;
    this.isGameOver = false;
    this.isGameSuccess = false;
    this.inputBox.show();
    this.resetTimer();
  }

  draw() {
    background(255);

    if (this.isGameStarted) {
      if (this.isGameOver) {
        this.drawGameOver();
      } else {
        this.drawGame();
      }
    } else {
      this.drawStartScreen();
    }
  }

  drawGame() {
    // 사용자가 입력해야 할 텍스트 표시
    fill(88);
    textAlign(CENTER);
    textSize(40);
    if (this.currentInputIndex < this.expectedInputs.length) {
      text("입력할 문구: " + this.expectedInputs[this.currentInputIndex], width / 2, height - 180);
    } else {
      this.gameSuccess(); // 모든 입력이 완료되었을 때 게임 성공 처리
    }

    // 사용자의 메시지 그리기
    for (let i = 0; i < this.userMessages.length; i++) {
      fill(0);
      textAlign(RIGHT);
      textSize(40);
      rect(width - 650, 340 + 480 * i, 150, 150); // 내 프로필 사진
      text(this.userMessages[i], width - 500, 540 + 500 * i);
    }

    // 챗봇의 메시지 그리기
    for (let i = 0; i < this.assistantMessages.length; i++) {
      fill(0, 100, 255);
      textAlign(LEFT);
      textSize(40);
      rect(500, 100 + 480 * i, 150, 150); // 상대방 프로필 사진
      text(this.assistantMessages[i], 500, 290 + 500 * i);
    }

       // 타이머 막대 그래프 표시
    let timePassed = millis() - this.timerStart;
    let timeLeft = this.timeLimit - timePassed;
    let barWidth = map(timeLeft, 0, this.timeLimit, 0, width - 1000);

    noFill();
    stroke(0);
    strokeWeight(5);
    rect(500, height - 270, width - 1000, 40); // 레트로 테두리

    noStroke();
    fill(0, 200, 0);
    rect(500, height - 270, barWidth, 40); // 레트로 스타일 타이머 막대

    if (timeLeft <= 0) {
      this.gameOver();
    }
  }

  drawGameOver() {
    // 게임 오버 메시지 표시
    fill(255, 0, 0);
    textSize(40);
    textAlign(CENTER);
    if (this.isGameSuccess) {
      text("게임 성공!", width / 2, height / 2 - 50);
    } else {
      text("시간 초과! 게임 오버", width / 2, height / 2 - 50); 
    }

    if (!this.isGameSuccess) {
      // 다시 시작 버튼 표시
      let img;
      if (this.isButtonPressedAgain) {
        img = buttonAgainPressed;
      } else if (this.isButtonOverAgain) {
        img = buttonAgainOver;
      } else {
        img = buttonAgain;
      }

      image(img, windowWidth / 2 - 160, windowHeight / 2 + 100, 320, 140); // 이미지 크기를 320x140px로 설정
    } else {
      // 게임 성공 시 닫기 버튼 표시
      let img;
      if (this.isButtonPressedClose) {
        img = buttonClosePressed;
      } else if (this.isButtonOverClose) {
        img = buttonCloseOver;
      } else {
        img = buttonClose;
      }
      noSmooth();
      image(img, windowWidth / 2 - 160, windowHeight / 2 + 100, 320, 140); // 이미지 크기를 320x140px로 설정
    }
  }

  drawStartScreen() {
    background(255);
    fill(0);
    textSize(60);
    textAlign(CENTER);
    text("챗봇 게임에 오신 것을 환영합니다!", width / 2, height / 2 - 50);
    textSize(40);
    text("게임 시작 버튼을 눌러주세요", width / 2, height / 2 + 50);

    let img;
    if (this.isButtonPressed) {
      img = buttonStartPressed;
    } else if (this.isButtonOver) {
      img = buttonStartOver;
    } else {
      img = buttonStart;
    }
    noSmooth();
    image(img, windowWidth / 2 - 160, windowHeight / 2 + 100, 320, 140); // 이미지 크기를 320x140px로 설정
  }

  sendMessage() {
    this.userInput = this.inputBox.value(); // 입력창의 값을 가져옴
    this.inputBox.value(""); // 입력창 비우기

    // 입력해야 할 텍스트가 올바른지 확인
    if (this.userInput === this.expectedInputs[this.currentInputIndex]) {
      this.userMessages.push(this.userInput); // 사용자의 입력 메시지를 배열에 추가
      this.assistantMessages.push(this.assistantReplies[this.currentInputIndex]);
      this.currentInputIndex++; // 다음 입력해야 할 텍스트로 이동    
      this.resetTimer(); // 타이머 리셋
    } else {
      text(this.expectedInputs[this.currentInputIndex], width / 2, height - 50);
    }

    // 채팅 수가 도합 5개를 넘으면 가장 오래된 채팅부터 사라짐
    if (this.userMessages.length + this.assistantMessages.length > 4) {
      this.userMessages.shift();
      this.assistantMessages.shift();
    }
  }

  resetTimer() {
    this.timerStart = millis(); // 타이머 리셋
    this.timeLimit = 20000; // 타이머 제한 시간 (20초)
  }

  gameOver() {
    this.isGameOver = true;
    this.inputBox.hide(); // 입력창 숨기기
  }

  gameSuccess() {
    this.isGameSuccess = true;
    this.gameOver();
  }

  closeGame() {
    noLoop(); // 게임 루프를 멈춥니다.
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  chatBot = new ChatBot();
  textFont(dungGeunMoFont);
}

function draw() {
  chatBot.draw();
}

function mousePressed() {
  if (!chatBot.isGameStarted && mouseX > windowWidth / 2 - 160 && mouseX < windowWidth / 2 + 160 && mouseY > windowHeight / 2 + 100 && mouseY < windowHeight / 2 + 240) {
    chatBot.isButtonPressed = true;
    chatBot.startGame();
  }

  if (chatBot.isGameOver && !chatBot.isGameSuccess && mouseX > windowWidth / 2 - 160 && mouseX < windowWidth / 2 + 160 && mouseY > windowHeight / 2 + 100 && mouseY < windowHeight / 2 + 240) {
    chatBot.isButtonPressedAgain = true;
    chatBot.initGame();
  }

  if (chatBot.isGameOver && chatBot.isGameSuccess && mouseX > windowWidth / 2 - 160 && mouseX < windowWidth / 2 + 160 && mouseY > windowHeight / 2 + 100 && mouseY < windowHeight / 2 + 240) {
    chatBot.isButtonPressedClose = true;
    chatBot.closeGame();
  }
}

function mouseReleased() {
  chatBot.isButtonPressed = false;
  chatBot.isButtonPressedAgain = false;
  chatBot.isButtonPressedClose = false;
}

function mouseMoved() {
  if (!chatBot.isGameStarted && mouseX > windowWidth / 2 - 160 && mouseX < windowWidth / 2 + 160 && mouseY > windowHeight / 2 + 100 && mouseY < windowHeight / 2 + 240) {
    chatBot.isButtonOver = true;
  } else {
    chatBot.isButtonOver = false;
  }

  if (chatBot.isGameOver && !chatBot.isGameSuccess && mouseX > windowWidth / 2 - 160 && mouseX < windowWidth / 2 + 160 && mouseY > windowHeight / 2 + 100 && mouseY < windowHeight / 2 + 240) {
    chatBot.isButtonOverAgain = true;
  } else {
    chatBot.isButtonOverAgain = false;
  }

  if (chatBot.isGameOver && chatBot.isGameSuccess && mouseX > windowWidth / 2 - 160 && mouseX < windowWidth / 2 + 160 && mouseY > windowHeight / 2 + 100 && mouseY < windowHeight / 2 + 240) {
    chatBot.isButtonOverClose = true;
  } else {
    chatBot.isButtonOverClose = false;
  }
}

