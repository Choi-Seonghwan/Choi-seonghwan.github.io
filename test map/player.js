class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // this.img = img;
    this.size = 80;
    this.speed = 10;
    this.lastDirection = null;
    this.directions = { up: false, down: false, left: false, right: false };
  }

  move(obstacles) {
    let nextX = this.x;
    let nextY = this.y;

    switch (this.lastDirection) {
      case 'up':
        if (this.directions.up && !this.directions.down) {
          if (this.checkCollision('up', obstacles)) {
            nextY -= this.speed;
          }
        }
        break;
      case 'down':
        if (this.directions.down && !this.directions.up) {
          if (this.checkCollision('down', obstacles)) {
            nextY += this.speed;
          }
        }
        break;
      case 'left':
        if (this.directions.left && !this.directions.right) {
          if (this.checkCollision('left', obstacles)) {
            nextX -= this.speed;
          }
        }
        break;
      case 'right':
        if (this.directions.right && !this.directions.left) {
          if (this.checkCollision('right', obstacles)) {
            nextX += this.speed;
          }
        }
        break;
    }

    this.x = nextX;
    this.y = nextY;

    // 맵 경계를 벗어나지 않도록 제한
    this.x = constrain(this.x, this.size / 2, mapWidth - this.size / 2);
    this.y = constrain(this.y, this.size / 2, mapHeight - this.size / 2);
  }



  checkCollision(direction, obstacles) {
    let x = this.x;
    let y = this.y;
    switch (direction) {
      case 'up':
        y -= this.speed;
        break;
      case 'down':
        y += this.speed;
        break;
      case 'left':
        x -= this.speed;
        break;
      case 'right':
        x += this.speed;
        break;
    }

    for (let obstacle of obstacles) {
      if (x + this.size / 2 > obstacle.x &&
        x - this.size / 2 < obstacle.x + obstacle.width &&
        y + this.size / 2 + 10 > obstacle.y &&
        y + 10 < obstacle.y + obstacle.height) {
        return false;
      }
    }
    return true;
  }

  isInZone(zone) {
    return this.x > zone.x &&
      this.x < zone.x + zone.width &&
      this.y > zone.y &&
      this.y < zone.y + zone.height;
  }

  display(img) {
    noSmooth();

    image(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  setDirection(direction, state) {
    this.directions[direction] = state;
    if (state) {
      this.lastDirection = direction;
      this.lastDirection = direction;
    } else if (this.directions.up) {
      this.lastDirection = 'up';
    } else if (this.directions.down) {
      this.lastDirection = 'down';
    } else if (this.directions.left) {
      this.lastDirection = 'left';
    } else if (this.directions.right) {
      this.lastDirection = 'right';
    } else {
      this.lastDirection = null;
    }
  }
}
