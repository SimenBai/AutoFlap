var bird;
var pipes = [];
var score = 0;
var highScore = 0;
var hitSound;
var flappSound;
var pointSound
let img, imgPipe;
let bg;

function setup() {

    hitSound = new sound ("FLAPPY-BIRD-HIT-SOUND.mp3");
    pointSound = new sound ("FLAPPY-BIRD-POINT-SOUND.mp3");

    //Laster bildet
    
    img = loadImage("FlappyBird.png");
    imgPipe = loadImage("pipe.png");
    bg = loadImage('flappy-bird-background-png-6.png');

    //Kjører når siden starter
    createCanvas(480, 400);

    //Lager et nytt bird object
    bird = new Bird();

    //Legger til et pipe objekt i pipe arrayet.
    pipes.push(new Pipe());
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("cotrols", "none");
    this.sound.style.display="none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}

function draw(){
    //Kjører 60 ganger i sekundet
    imageMode(CORNER);
    image(bg, 0, 0, width, height)
    bird.update();
    bird.show();


    if (frameCount % 100 == 0) {
        pipes.push(new Pipe());
    }

    for(var i = pipes.length-1; i > 0; i--) {
        pipes[i].show();
        pipes[i].update();

        if(pipes[i].x + pipes[i].w < bird.x && !pipes[i].counted){
            console.log("X");
            pipes[i].counted = true;
            score++;
            pointSound.play();
        }

        
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            
        }

        if (pipes[i].hits(bird)) {
            console.log("HIT");
            hitSound.play();
            restart();
        }
    }
    
    //Draws the bird image sprite
    drawBirdImage();
    drawScore();
    drawHighScore();
}  

function drawBirdImage(){
    //Setter bird.x og bird.y til (0,0)
    translate(bird.x, bird.y);

    //Sjekker om fuglen går opp eller ned
    if(0 < bird.velocity) {
        //Fuglen går nedover
        //Sjekker om fuglen har riktig vinkel, hvis den ikke har det endre den litt (slik at det ser mer animert ut);
        if(bird.angle < PI/180 * 30){
            //Legger til litt på vinkelen til fuglen
            bird.angle += 0.075;
        }
    }
    else if(bird.velocity < 0){
        //Fuglen går oppover
        //Sjekker om fuglen har riktig vinkel, hvis den ikke har det endre den litt (slik at det ser mer animert ut);
        if(bird.angle > PI/180 * -30){
            //Fjerner litt på vinkelen til fuglen
            bird.angle -= 0.1;
        }
    }
    //Roterer i forhold til fuglen sin vinkel.
    rotate(bird.angle);
/*
    ellipseMode(CENTER);
    ellipse(0,0, bird.height, bird.width);
*/

    //Bilde skal sentreres på midten
    imageMode(CENTER);


    //Bilde som skal brukes, lokalisasjonen (0,0) siden translate funksjonen, 64 høy, 64 bred.
    image(img, 0 , 0  , bird.height*2, bird.width*2);

    rotate(-bird.angle); 
    translate(-bird.x, -bird.y);

}
    

function keyPressed(){ //Trykke SPACE for å fly
    if (key == ' '){
        bird.up();
        //console.log("SPACE"); SJEKKE OM TASTEN FUNKER  
        flappSound = new sound ("FLAPPY-BIRD-FLAPP-SOUND.mp3");
        flappSound.play();
        return false;
    }
}

function restart(){
    bird = new Bird();
    pipes = [];
    score = 0; 
}

function drawScore() {
    textSize(16); 
    textFont("Arial");
    fill(0);
    text("Score: " +  score.toString(), 10, 20);
}
function drawHighScore() {
    textSize(16); 
    textFont("Arial");
    fill(0);
    text("Highscore: " + highScore.toString(), 380, 20);
    if (highScore < score){
            highScore = score;
    }
    else if (highScore > score) {
            highScore = highScore;
    }
}

