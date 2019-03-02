const TOTAL = 0;
let birds = [];
let savedBirds = [];
let bird;
let pipes = [];
let score = 0;
let aiScore = 0;
let highScore = 1337;
let aiHighScore = 0;
let highscoreBrain = null;
let hitSound, flappSound, pointSound;
let img, imgPipe, bg;
let counter = 0;
let slider;
let generations = 24;
let trained_brain;

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
    bg = loadImage('Background.jpg');

    //Kjører når siden starter
    createCanvas(480, 400);

    //Lager en farts slider
    //slider = createSlider(1, 10, 1);
    slider = 1;
	
	
	let trained_brain_data = '{"input_nodes":5,"hidden_nodes":10,"output_nodes":2,"weights_ih":{"rows":10,"cols":5,"data":[[0.4013758399493532,0.08130508824245103,-0.5190615041503259,0.4810690318122437,0.6255430724052299],[-0.626548426863745,0.571114517130355,0.5630823743668545,-0.4957964439054377,-0.3000221287523965],[-1.0512895087566094,-0.07316522914090337,-0.8141292543228442,0.8214623313135561,-0.125461233198365],[0.7911435675382792,0.35905627284688446,0.860531347489613,-1.018768066801602,-0.8594076523471661],[-0.1345138171359998,-0.504133874858084,0.7996871697006012,-0.4582014705252959,0.940611543120159],[0.6759578905247947,0.6235467499541584,0.39327816179468816,-0.6000599411677763,0.5655456060716659],[0.9193371803187184,0.9176918903550564,0.13752601025367717,0.1835287728792159,0.47403278121672343],[0.06934853553659068,0.4011921458536798,0.37295472492023907,-0.08257207185319065,0.42565947096432877],[-0.1345105525336558,0.792377044522079,-0.6833786565592489,0.05625659228413338,-0.9567704997004177],[0.5221883650941115,0.37991296608458663,0.7233634111310603,-0.9123524995805817,0.7556316919941554]]},"weights_ho":{"rows":2,"cols":10,"data":[[0.4103825453434689,0.16728992803999254,-0.9539555241584211,0.6655332081022223,0.21630060653865657,0.33553127718547454,0.8238305404314219,0.17040464449171128,-0.8309526699600752,-0.5501384266516651],[-0.6928360908257696,-0.44272206337554953,0.3067015896057515,-0.9013563438061709,-0.039632077422375345,0.7399932196304115,-1.0935628063995493,0.9450206599990071,0.7175034997423804,0.40962564617207137]]},"bias_h":{"rows":10,"cols":1,"data":[[0.6629086923382517],[-0.45041517633977646],[0.6994847176480464],[0.47920819326504427],[-0.2929084729709546],[-0.5895066823809508],[0.13217199642632935],[0.24298096820113935],[0.3308642125315702],[-0.7066452076019001]]},"bias_o":{"rows":2,"cols":1,"data":[[-0.4805312986469783],[0.6787335655306724]]},"learning_rate":0.1,"activation_function":{}}';
	
	trained_brain = NeuralNetwork.deserialize(trained_brain_data);
	

    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird(null, true);
    }

    //Lager et nytt bird object
    bird = new Bird(trained_brain, true);
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
		bird.think(pipes);
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
    //drawAIScore();
    drawHighScore();
    //drawAIHighScore();
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
    bird = new Bird(trained_brain, true);
    pipes = [];
    score = 0;
    aiScore = 0;
    counter = 0;
}

function drawScore() {
    textSize(16);
    textFont("Arial");
    fill(0);
    text("AI score: " + score.toString(), 10, 20);
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
    text("AI highscore: " + highScore.toString(), 350, 20);
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