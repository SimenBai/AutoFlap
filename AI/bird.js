/*
* Her lager vi en klasse
* this. viser til variabler som er spesifike for hvert objekt
* som blir laget med klassen.
* Et objekt blir laget ved å skrive
* new bird();
*/
function Bird(brain, isAI) {//fuglen trenger kun en y-pos
    this.y = height / 2; //starter fuglen i midten av vinduet
    this.x = 64;
    this.width = 32;
    this.height = 32;

    this.gravity = 0.7;
    this.lift = -17;
    this.velocity = 0;

    this.angle = 0;
    this.isAI = isAI;
    this.dead = false;

    this.points = 0;

    /** AI stuff*/
    this.score = 0;
    this.fitness = 0;

    if (brain && brain instanceof NeuralNetwork) {
        this.brain = brain.copy();
    } else {
        //5 input 8 hidden 2 output
        this.brain = new NeuralNetwork(5, 8, 2)
    }


    this.show = function () { //Tegne fuglen
        stroke(255);
        fill(225);
        ellipse(this.x, this.y, 32, 32);//fuglen blir først en sirkel
    };

    this.up = function () {
        this.velocity += this.lift;
    };

    this.mutate = function () {
        if (this.isAI) {
            this.brain.mutate(0.1);
        }
    };

    this.think = function (pipes) {
        if (this.isAI) {
            //Find closest pipe
            let closest = null;
            let closestD = Infinity;
            for (let i = 0; i < pipes.length; i++) {
                let d = (pipes[i].x + pipes[i].w) - this.x;
                if (d < closestD && d > 0) {
                    closest = pipes[i];
                    closestD = d;
                }
            }

            //Inputs
            let inputs = [];
            inputs[0] = this.y / height;
            inputs[1] = closest.top / height;
            inputs[2] = closest.bottom / height;
            inputs[3] = closest.x / width;
            inputs[4] = this.velocity / 10;
            
            let output = this.brain.predict(inputs);

            if (output[0] > output[1]) {
                this.up();
            }
        }
    };

    this.offscreen = function () {
        return (this.y > height || this.y < 0);
    };

    this.update = function () { //får den til å falle
        this.score++;

        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if (this.y > height) { //stopper når den treffer bakken, brukes for vinkel til fuglen
            this.y = height;
            this.velocity = 0;
        } else if (this.y < 0) { //stopper når den treffer himmel, brukes for vinkel til fuglen
            this.y = 0;
            this.velocity = 0;
        }
    };
}