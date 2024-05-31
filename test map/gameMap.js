class GameMap {
  constructor(width, height, img) {
    this.width = width; //1600
    this.height = height; //1200
    this.img = img;
    this.obstacles = [ //타일 한 칸당 80px로 계산
      { x: 0, y: 0, width: 1600, height: 240 }, //top wall
      { x: 480, y: 720, width: 80, height: 160 }, //spawn wall left
      { x: 640, y: 400, width: 320, height: 160 }, //spawn wall middle
      { x: 960, y: 720, width: 160, height: 160 }, //spawn wall right


      { x: 0, y: 400, width: 320, height: 160 }, //zone 1 wall 1
      { x: 240, y: 480, width: 80, height: 160 }, //zone 1 wall 2

      { x: 0, y: 800, width: 240, height: 160 }, //zone 2 wall top
      { x: 0, y: 1040, width: 480, height: 160 }, //zone 2 wall bottom

      { x: 1280, y: 320, width: 320, height: 160 }, //zone 3 wall top

      { x: 1360, y: 800, width: 240, height: 160 }, //zone 4 wall top
      { x: 1120, y: 1040, width: 80, height: 160 }, //zone 4 wall bottom
    ];
    this.triggers = [
      { x: 560, y: 480, width: 480, height: 400, message: "spawn zone \n press Q to interact" },

      { x: 0, y: 560, width: 320, height: 240, message: "zone 1" }, //왼쪽 위
      { x: 0, y: 960, width: 400, height: 240, message: "zone 2" }, //왼쪽 아래

      { x: 1280, y: 480, width: 320, height: 320, message: "zone 3" }, //오른쪽 위
      { x: 1200, y: 960, width: 400, height: 240, message: "zone 4" } //오른쪽 아래
    ];
  }

  display() {
    // fill(100);
    // rect(0, 0, this.width, this.height);
    noSmooth();
    image(this.img, 0, 0, this.width, this.height);

    // obstacle
    // fill(255, 0, 0, 100);
    fill(255, 0, 0, 0); //obstacle 투명화
    for (let obstacle of this.obstacles) {
      rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }


  displayTriggers() {
    // 트리거 영역 그리기
    // fill(0, 255, 0, 100);
    fill(0, 255, 0, 0); //트리거 영역 투명화
    for (let trigger of this.triggers) {
      rect(trigger.x, trigger.y, trigger.width, trigger.height);
    }
  }

  checkTriggers(player) {
    for (let trigger of this.triggers) {
      if (player.isInZone(trigger)) {
        return trigger;
      }
    }
    return null;
  }
}
