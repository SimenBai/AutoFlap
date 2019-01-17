var bird;
var pipes = [];
let img;

function setup() {
    //Laster bildet
    img = loadImage("FlappyBird.png");

    //Kjører når siden starter
    createCanvas(400, 600);

    //Lager et nytt bird object
    bird = new Bird();

    //Legger til et pipe objekt i pipe arrayet.
    pipes.push(new Pipe());
}

function draw(){
    //Kjører 60 ganger i sekundet
    background(0);
    bird.update();
    bird.show();

    if (frameCount % 100 == 0) {
        pipes.push(new Pipe());
    }

    for(var i = 0; i < pipes.length; i++) {
        pipes[i].show();
        pipes[i].update();
    }


    //Draws the bird image sprite
    drawBirdImage();
}

function drawBirdImage(){
    //Setter bird.x og bird.y til (0,0)
    translate(bird.x, bird.y);

    //Sjekker om fuglen går opp eller ned
    if(0 < bird.velocity) {
        //Fuglen går nedover
        //Sjekker om fuglen har riktig vinkel, hvis den ikke har det endre den litt (slik at det ser mer animert ut);
        if(bird.angle < PI/180 * 45){
            //Legger til litt på vinkelen til fuglen
            bird.angle += 0.075;
        }
    }
    else if(bird.velocity < 0){
        //Fuglen går oppover
        //Sjekker om fuglen har riktig vinkel, hvis den ikke har det endre den litt (slik at det ser mer animert ut);
        if(bird.angle > PI/180 * -45){
            //Fjerner litt på vinkelen til fuglen
            bird.angle -= 0.1;
        }
    }
    //Roterer i forhold til fuglen sin vinkel.
    rotate(bird.angle);
  
    //Bilde skal sentreres på midten
    imageMode(CENTER);

    //Bilde som skal brukes, lokalisasjonen (0,0) siden translate funksjonen, 64 høy, 64 bred.
    image(img, 0 , 0  , 64 , 64);
}

function keyPressed(){ //Trykke SPACE for å fly
    if (key == ' '){
        bird.up();
        //console.log("SPACE"); SJEKKE OM TASTEN FUNKER
    }
}