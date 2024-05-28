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

    this.inputBox = createInput(); // 사용자의 입력을 받는 입력창
    this.inputBox.position(10, height - 30);
    this.inputBox.size(width - 20, 20);
    this.inputBox.changed(this.sendMessage.bind(this)); // 입력 완료 후 sendMessage() 함수 호출

    this.restartButton = createButton("다시 시작");
    this.restartButton.position(width / 2 - 50, height / 2);
    this.restartButton.mousePressed(this.resetGame.bind(this));
    this.restartButton.hide(); // 처음에는 버튼을 숨김

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

  draw() {
    background(255);

    if (this.isGameOver) {
      // 게임 오버 메시지 표시
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER);
      if (this.isGameSuccess) {
        text("게임 성공!", width / 2, height / 2 - 50);
      } else {
        text("시간 초과! 게임 오버", width / 2, height / 2 - 50);
      }
      this.restartButton.show();
    } else {
      // 사용자가 입력해야 할 텍스트 표시
      fill(150);
      textAlign(CENTER);
      textSize(20);
      if (this.currentInputIndex < this.expectedInputs.length) {
        text(this.expectedInputs[this.currentInputIndex], width / 2, height - 50);
      } else {
        this.gameSuccess(); // 모든 입력이 완료되었을 때 게임 성공 처리
      }

      // 사용자의 메시지 그리기
      for (let i = 0; i < this.userMessages.length; i++) {
        fill(0);
        textAlign(RIGHT);
        textSize(20);
        text(this.userMessages[i], width - 20, 60 * (i + 1));
      }

      // 챗봇의 메시지 그리기
      for (let i = 0; i < this.assistantMessages.length; i++) {
        fill(0, 100, 255);
        textAlign(LEFT);
        textSize(20);
        text(this.assistantMessages[i], 20, 30 + 60 * i);
      }

      // 타이머 막대 그래프 표시
      let timePassed = millis() - this.timerStart;
      let timeLeft = this.timeLimit - timePassed;
      let barWidth = map(timeLeft, 0, this.timeLimit, 0, width - 20);

      fill(255, 0, 0);
      rect(10, height - 100, barWidth, 20);

      if (timeLeft <= 0) {
        this.gameOver();
      }
    }
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
  }

  resetTimer() {
    this.timerStart = millis(); // 타이머 리셋
    this.timeLimit = 20000; // 타이머 제한 시간 (3초)
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
    this.isGameOver = false;
    this.isGameSuccess = false;
    this.restartButton.hide(); // 다시 시작 버튼 숨기기
    this.inputBox.show(); // 입력창 다시 보이기
  }
}

let chatBot;

function setup() {
  createCanvas(800, 600);
  chatBot = new ChatBot();
}

function draw() {
  chatBot.draw();
}
