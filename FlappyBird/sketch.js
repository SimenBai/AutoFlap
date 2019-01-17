var bird;
var pipes = [];
function setup() {
    //Kjører når siden starter
    createCanvas(400, 600);
    bird = new Bird();
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
}

function keyPressed(){ //Trykke SPACE for å fly
    if (key == ' '){
        bird.up();
        //console.log("SPACE"); SJEKKE OM TASTEN FUNKER
    }
}