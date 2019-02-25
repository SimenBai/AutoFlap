function Pipe() {
  this.top = random(height / 2.4);
  this.bottom = random(height / 2.4);
  this.x = width;
  this.w = 70;
  this.speed = 2;
  this.counted = false;

  this.show = function () { //pipene: forklares 10:07 i videoen
    fill(255);
    /*
    rect(this.x, 0, this.w, this.top)
    rect(this.x, height - this.bottom, this.w, this.bottom)
    */
    
    //Bilde skal sentreres på midten
    imageMode(CORNER);
    //Bilde som skal brukes, lokalisasjonen (0,0) siden translate funksjonen, 64 høy, 64 bred.
    translate(this.x, 0);
    rotate(PI);
    image(imgPipe, 0, 0  , -this.w, -this.top);
    rotate(-PI);
    translate(-this.x, 0);

    image(imgPipe, this.x, height - this.bottom, this.w, this.bottom);
  }


  this.hits = function (bird) {
    return this.detectHit(bird);
  }

  this.detectHit = function (bird) {
    let top = this.top;
    let bottom = this.bottom;
    let width = this.w;

    let bX = bird.x;
    let bY = bird.x;
    let bWidth = bird.width;
    let bHeight = bird.height;

    if (bird.y - bird.height / 2 < this.top && bird.x + (bird.width / 2) > this.x && bird.x - (bird.width / 2) < this.x + this.w) {
      this.highlight = true;
      return true;
    }
    else if (bird.y + bird.height / 2 > height - this.bottom && bird.x + bird.width / 2 > this.x && bird.x - bird.width / 2 < this.x + this.w) {
      this.highlight = true;
      return true;
    }
    this.highlight = false;
    return false;

  }

  this.update = function () {
    this.x -= this.speed;
  }

  this.offscreen = function () {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}