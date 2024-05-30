let screws = [];
let selectedScrew = null;
let mode = "select"; // "select" 또는 "rotate" 모드
let machineImage;
const holeDepth = 100; // 구멍의 깊이 임의로 설정
let successed = 0;
let frame = 30;
let game;


//딜레이 주는 것
function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}


function preload() {
  machineImage = loadImage('machine_background.jpg'); // 기계 부품 배경 이미지 로드
}

function setup() {
  createCanvas(800, 600);

  //게임 실행
  game = new Game() ;
}

function draw() {
  background(150);
  // 기계 부품 배경 그리기
  image(machineImage, 0, 0, width, height);

  game.show();

  // 모든 나사를 그림
  for (let screw of screws) {
    screw.show();
  }

  // 선택된 나사를 강조 표시
  if (selectedScrew) {
    selectedScrew.highlight();
  }
}

function mousePressed() {
  selectedScrew = null; // 이전 선택을 초기화
  for (let screw of screws) {
    if (screw.isMouseOver()) {
      selectedScrew = screw;
      mode = "rotate";
      break;
    }
  }
}

function keyPressed() {
  if (mode === "rotate" && selectedScrew) {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      selectedScrew.move();
    }
  }
}

class Screw {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.depth = 0; // 나사의 구멍 속 깊이
    this.threadTurns = 20;
    this.threadHeight = 100;
    this.threadWidth = 10;
    this.spacing = this.threadHeight / this.threadTurns;
    this.angle = 0;
    this.animating = 0;
    this.frame = 0;
    this.successed = false;
  }

  // 나사 머리와 스크류를 그림
  show() {
    push();
    translate(this.x, this.y + this.depth); // 나사를 아래로 이동
    
    // 나사 스크류 그리기
    stroke(125);
    strokeWeight(15);
    noFill();
    beginShape();
    for (let i = 0; i <= this.threadTurns; i++) {
      let y = i * this.spacing;
      let x = (i % 2 === 0) ? -this.threadWidth / 2 : this.threadWidth / 2;
      vertex(x, y);
    }
    endShape();
    this.head();
    pop();


  }

  head() {
    // 나사 머리
    noStroke();
    fill(180);
    ellipse(0, 0, this.size, this.size); // 나사 머리의 기본 원

        // 입체감을 위한 음영 효과
    for (let i = 0; i < this.size / 2; i++) {
      let inter = map(i, 0, this.size / 2, 180, 100);
      fill(inter);
      ellipse(0, 0, this.size - i, this.size - i);
    }
      // 나사 슬롯 그리기
      stroke(0);
      strokeWeight(2);
      push();
      rotate(this.angle); // 슬롯을 각도만큼 회전시킴
      line(-this.size / 4, -this.size / 4, this.size / 4, this.size / 4);
      line(this.size / 4, -this.size / 4, -this.size / 4, this.size / 4);
      pop();
  }

  update() {
    this.angle += PI / (2*frame); // 각도를 4프레임에 걸쳐 45도(PI/4) 회전시킴
    if (this.angle >= TWO_PI) {
      this.angle = 0; // 각도가 360도를 넘어가면 초기화
    }
  }

  // 선택된 나사 강조 표시
  highlight() {
    push();
    translate(this.x, this.y + this.depth); // 강조할 때도 나사를 이동한 위치에 맞춤
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    ellipse(0, 0, this.size + 10, this.size + 10);
    pop();
  }

  // 마우스가 나사 위에 있는지 확인
  isMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y + this.depth);
    return d < this.size / 2;
  }

  // 나사 이동
  move() {
    // 나사가 구멍의 깊이를 초과하여 이동하지 않도록 제한
    if (this.depth + this.spacing <= holeDepth) {
      for (let i = 0; i < frame; i++) {
        setTimeout(() => {
          this.depth += this.spacing / frame; 
          if (i == frame - 1) {
            this.threadTurns -= 1;
            animating = false;
          }
          this.update(); // 각도를 업데이트
          sleep(500/frame);
        }, 0);
      }
      if (this.successed == false && this.depth == holeDepth) {
        successed += 1;
        this.successed = true;
      }
      // 나사를 구멍 속으로 이동
    } else {
      animating = false;
      this.depth = holeDepth; // 구멍의 최대 깊이로 설정
    }
  }
}
 
class Game {
  constructor() {
    this.initGame();
  }

  initGame(){
    this.restartButton = createButton("다시 시작");
    this.restartButton.position(width / 2 - 50, height / 2);
    this.restartButton.mousePressed(this.resetGame.bind(this));
    this.restartButton.hide(); // 처음에는 버튼을 숨김
    this.resetTimer();
    this.isGameSuccess = false;
    this.isGameOver = false; // 게임 오버 상태

    // 나사를 4군데 풀려있는 상태로 생성
    screws = [];
    screws.push(new Screw(200, 200));
    screws.push(new Screw(600, 200));
    screws.push(new Screw(200, 400));
    screws.push(new Screw(600, 400));

  }

  show(){
      //모든 나사를 조이면 게임 성공
    if (successed == 4){
      this.isGameSuccess = true ;
    }

  
    // 타이머 막대 그래프 표시
    let timePassed = millis() - this.timerStart;
    let timeLeft = this.timeLimit - timePassed;
    let barWidth;
    
    if (timeLeft <= 0) {
      this.gameOver();
      text("시간 초과! 게임 오버", width / 2, height / 2 - 50);
      this.restartButton.show();
    } else if (!this.isGameSuccess){
      barWidth = map(timeLeft, 0, this.timeLimit, 0, width - 20); //성공시 타이머 사라짐
      fill(255, 0, 0); 
      rect(10, height - 100, barWidth, 20);
    } else {
      fill(255, 0, 0); 
      rect(10, height - 100, barWidth, 20);
    }
      



    if (this.isGameOver == false) {
      // 게임 오버 메시지 표시
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER);
      
      if (this.isGameSuccess) {
        text("게임 성공!", width / 2, height / 2 - 50);
        
      } 

      } else {
        // 사용자가 입력해야 할 텍스트 표시
        fill(150);
        textAlign(CENTER);
        textSize(20);
    }
  }

  gameOver() {
     this.isGameOver = true;
    }

  resetTimer() {
    this.timerStart = millis(); // 타이머 리셋
    this.timeLimit = 15000; // 타이머 제한 시간 
    }

  resetGame() {
    this.restartButton.hide();
    this.initGame();
    // this.show(); // 게임 초기화=
  }
}
  



