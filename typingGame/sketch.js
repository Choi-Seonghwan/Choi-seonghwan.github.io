let dungGeunMoFont;

function preload() {
  dungGeunMoFont = loadFont('fonts/DungGeunMo.otf');
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
    this.inputBox.position((windowWidth-(windowWidth-1000))/2, windowHeight - 150);
    this.inputBox.size(windowWidth - 1000, 80);
    this.inputBox.changed(this.sendMessage.bind(this)); // 입력 완료 후 sendMessage() 함수 호출
    this.inputBox.hide(); // 처음에는 입력창을 숨김

    this.startButton = createButton("게임 시작");
    this.startButton.position(windowWidth / 2 - 100, windowHeight / 2 + 400);
    this.startButton.mousePressed(() => {
      this.startGame();
    });

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
    this.startButton.hide();
    this.inputBox.show();
    this.isGameStarted = true;
    this.isGameOver = false;
    this.isGameSuccess = false;
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
      text("입력할 문구: " + this.expectedInputs[this.currentInputIndex], windowWidth / 2, windowHeight - 180);
    } else {
      this.gameSuccess(); // 모든 입력이 완료되었을 때 게임 성공 처리
    }

    // 사용자의 메시지 그리기
    for (let i = 0; i < this.userMessages.length; i++) {
      fill(0);
      textAlign(RIGHT);
      textSize(30);
      rect(windowWidth - 650, 310 + 480 * i, 150, 150); // 내 프로필 사진
      text(this.userMessages[i], windowWidth - 500, 500 + 500 * i);
    }

    // 챗봇의 메시지 그리기
    for (let i = 0; i < this.assistantMessages.length; i++) {
      fill(0, 100, 255);
      textAlign(LEFT);
      textSize(30);
      rect(500, 70 + 480 * i, 150, 150); // 상대방 프로필 사진
      text(this.assistantMessages[i], 500, 260 + 480 * i);
    }

    // 타이머 막대 그래프 표시
    let timePassed = millis() - this.timerStart;
    let timeLeft = this.timeLimit - timePassed;
    let barWidth = map(timeLeft, 0, this.timeLimit, 0, windowWidth - 1000);

    fill(255, 0, 0);
    rect(500, windowHeight - 270, barWidth, 40);

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
      text("게임 성공!", windowWidth / 2, windowHeight / 2 - 50);
    } else {
      text("시간 초과! 게임 오버", windowWidth / 2, windowHeight / 2 - 50);
      this.startButton.html("다시 시작");
      this.startButton.show();
    }
  }

  drawStartScreen() {
    background(255);
    fill(0);
    textSize(60);
    textAlign(CENTER);
    text("챗봇 게임에 오신 것을 환영합니다!",windowWidth / 2, windowHeight / 2 - 50);
    textSize(40);
    text("게임 시작 버튼을 눌러주세요", windowWidth / 2, windowHeight / 2 + 50);
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
      text(this.expectedInputs[this.currentInputIndex], windowWidth / 2, windowHeight - 50);
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

  resetGame() {
    this.initGame(); // 게임 초기화
    this.startGame(); // 게임 시작
  }
}

let chatBot;

function setup() {
  createCanvas(windowWidth, windowHeight);
  chatBot = new ChatBot();
  textFont(dungGeunMoFont);
}

function draw() {
  chatBot.draw();
}
