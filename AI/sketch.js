const TOTAL = 500;
let birds = [];
let savedBirds = [];
let bird;
let pipes = [];
let score = 0;
let aiScore = 0;
let highScore = 0;
let aiHighScore = 0;
let highscoreBrain = null;
let hitSound, flappSound, pointSound;
let img, imgPipe, bg;
let counter = 0;
let slider;
let generations = 0;

function keyPressed() {
    if (key === 'S') {
        let bird = birds[0];
        saveJSON(bird.brain, 'bird.json');
    }
    else if (key == ' ') {
        bird.up();
        flappSound = new sound("FLAPPY-BIRD-FLAPP-SOUND.mp3");
        flappSound.play();
        return false;
    }
}

function setup() {
    hitSound = new sound("FLAPPY-BIRD-HIT-SOUND.mp3");
    pointSound = new sound("FLAPPY-BIRD-POINT-SOUND.mp3");

    //Laster bildet

    img = loadImage("FlappyBird.png");
    imgPipe = loadImage("pipe.png");
    bg = loadImage('flappy-bird-background-png-6.png');

    //Kjører når siden starter
    createCanvas(480, 400);

    //Lager en farts slider
    //slider = createSlider(1, 10, 1);
    slider = 1;

    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird(null, true);
    }

    //Lager et nytt bird object
    bird = new Bird(null, false);
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("cotrols", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    }
}

function draw() {
    //Kjører 60 ganger i sekundet
    imageMode(CORNER);
    image(bg, 0, 0, width, height);

    for (let n = 0; n < slider; n++) {
        if (counter % 100 == 0) {
            pipes.push(new Pipe());
        }
        counter++;



        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();

            /** Check if bird gets a point*/
            if (pipes[i].x + pipes[i].w < bird.x && !pipes[i].counted) {
                pipes[i].counted = true;

                if(!bird.dead) {
                    score++;
                    pointSound.play();
                }
                if(birds.length > 0){
                    aiScore++;
                }
                for(let aiBird of birds){
                    aiBird.points++;
                }
            }

            if (pipes[i].hits(bird) && !bird.dead) {
                hitSound.play();
                bird.dead = true;
            }

            //Remove pipe if offscreen
            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }

            //Check for AI birds
            for (let j = birds.length - 1; j >= 0; j--) {
                if (pipes[i].hits(birds[j])) {
                    savedBirds.push(birds.splice(j, 1)[0]);
                }
            }
        }

        //Check if the birds are offscreen
        for (let i = birds.length - 1; i >= 0; i--) {
            if (birds[i].offscreen()) {
                savedBirds.push(birds.splice(i, 1)[0]);
            }
        }
        if (bird.offscreen()) {
            bird.dead = true;
        }

        //Let bird think and update it
        for (let i = birds.length - 1; i >= 0; i--) {
            birds[i].think(pipes);
            birds[i].update();
        }
        bird.update();

        if (birds.length === 0 && bird.dead) {
            restart();
        }

        if(aiScore > aiHighScore){
            aiHighScore = aiScore;
        }
    }

    //Draw AI birds
    for(let aiBird of birds){
        aiBird.show();
    }

    //Draws the bird image sprite
    drawBirdImage();

    for(let pipe of pipes){
        pipe.show();
    }

    drawScore();
    drawAIScore();
    drawHighScore();
    drawAIHighScore();
    drawGeneration();
    //noLoop();
}

function drawBirdImage() {
    //Setter bird.x og bird.y til (0,0)
    translate(bird.x, bird.y);

    //Sjekker om fuglen går opp eller ned
    if (0 < bird.velocity) {
        //Fuglen går nedover
        //Sjekker om fuglen har riktig vinkel, hvis den ikke har det endre den litt (slik at det ser mer animert ut);
        if (bird.angle < PI / 180 * 30) {
            //Legger til litt på vinkelen til fuglen
            bird.angle += 0.075;
        }
    } else if (bird.velocity < 0) {
        //Fuglen går oppover
        //Sjekker om fuglen har riktig vinkel, hvis den ikke har det endre den litt (slik at det ser mer animert ut);
        if (bird.angle > PI / 180 * -30) {
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
    image(img, 0, 0, bird.height * 2, bird.width * 2);

    rotate(-bird.angle);
    translate(-bird.x, -bird.y);

}

function restart() {
    bird = new Bird();
    nextGeneration();
    pipes = [];
    score = 0;
    aiScore = 0;
    counter = 0;
}

function drawScore() {
    textSize(16);
    textFont("Arial");
    fill(0);
    text("Score: " + score.toString(), 10, 20);
}

function drawGeneration() {
    textSize(16);
    textFont("Arial");
    fill(0);
    text("Generation: " + generations.toString(), 10, height-20);
}

function drawHighScore() {
    textSize(16);
    textFont("Arial");
    fill(0);
    text("Highscore: " + highScore.toString(), 380, 20);
    if (highScore < score) {
        highScore = score;
    }
}

function drawAIHighScore() {
    textSize(16);
    textFont("Arial");
    fill(0);
    text("AI highscore: " + aiHighScore.toString(), 350, height-20);
}

function drawAIScore() {
    textSize(16);
    textFont("Arial");
    fill(0);
    text("AI score: " + aiScore.toString(), 380, height-40);
}