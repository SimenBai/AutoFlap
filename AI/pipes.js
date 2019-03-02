function Pipe() {
	this.spacing = random(125, 175);
    this.top = random(height/6 , 4/6 * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 80;
    this.speed = 4;
    this.counted = false;

    this.show = function () { //pipene: forklares 10:07 i videoen
        /** Background box */

        fill(255);
        //rectMode(CORNER);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, height - this.bottom, this.w, this.bottom);


        //Bilde skal sentreres på midten
        imageMode(CORNER);
        //Bilde som skal brukes, lokalisasjonen (0,0) siden translate funksjonen, 64 høy, 64 bred.
        translate(this.x, 0);
        rotate(PI);
        image(imgPipe, 0, 0  , -this.w, -this.top);
        rotate(-PI);
        translate(-this.x, 0);

        image(imgPipe, this.x, height - this.bottom, this.w, this.bottom);
    };


    this.hits = function (bird) {
        if (bird.y - (bird.height / 2) < this.top && bird.x + (bird.width / 2) > this.x && bird.x - (bird.width / 2) < this.x + this.w) {
            return true;
        }
        else if (bird.y + bird.height / 2 > height - this.bottom && bird.x + bird.width / 2 > this.x && bird.x - bird.width / 2 < this.x + this.w) {
            return true;
        }
        return false;
    };

    this.update = function () {
        this.x -= this.speed;
    };

    this.offscreen = function () {
        return this.x < -this.w;
    };
}