/*
* Her lager vi en klasse
* this. viser til variabler som er spesifike for hvert objekt 
* som blir laget med klassen.
* Et objekt blir laget ved å skrive
* new bird();
*/
function Bird(){//fuglen trenger kun en y-pos
    this.y = height/2; //starter fuglen i midten av vinduet
    this.x = 64;
    
    this.gravity = 0.7;
    this.lift = -15;
    this.velocity = 0;

    this.show = function() { //Tegne fuglen
        fill(225);
        ellipse(this.x, this.y, 32, 32);//fuglen blir først en sirkel
    }

    this.up = function(){
        this.velocity += this.lift;
    }

    this.update = function() { //får den til å falle
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if(this.y > height){ //stopper når den treffer bakken
            this.y = height;
            this.velocity = 0; 
        }
        if(this.y < 0){ //stopper når den treffer himmel
            this.y = 0;
            this.velocity = 0; 
        }
    }
}