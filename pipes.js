function Pipe(){
    this.top = random(height/2);
    this.bottom = random(height/2);
    this.x = width;
    this.w = 60;
    this.speed = 2;

    this.show = function(){ //pipene: forklares 10:07 i videoen
        fill(255);
        rect(this.x, 0, this.w, this.top)
        rect(this.x, height-this.bottom, this.w, this.bottom)
    }


    this.hits = function(bird) {
        if (bird.y < this.top || bird.y > height - this.bottom) {
          if (bird.x > this.x && bird.x < this.x + this.w) {
            this.highlight = true;
            return true;
          }
        }
        this.highlight = false;
        return false;
      }
    
      this.update = function() {
        this.x -= this.speed;
      }
    
      this.offscreen = function() {
        if (this.x < -this.w) {
          return true;
        } else {
          return false;
        }
      }
}