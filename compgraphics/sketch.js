const bg_color = "#77C7F6";
const smolsphere_color = "#65CFA6";
const arc_colorl = "#FBDF3C";
const arc_colord = "#EBD338";
const square_colorl = "#ED7561";
const square_colord = "#D96555";
const hook_color = "#F3C8CE";
const darkgrey = "#4D4D4D";
const lightgrey = "#F3EBEA";

let controller = [];
let face = [];

var square,
    base1,
    base2,
    hook,
    semicircle,
    smolcircle,
    scaleFactor;

function setup() {
    createCanvas(1280,720); 

    square = new Square();
    hook = new Hook();
    semicircle = new SemiCircle();
    base1 = new Rect();
    base2 = new Rect();
    smolcircle = new Face();
}

function preload(){
    img1 = loadImage("crescendo_logo.png");
}

function draw(){
    background(bg_color);
    animation();
    if(square.translateX >= width) animation();

    scaleFactor = map(noise(frameCount * 0.01), 0, 1, 0.1, 1);
    image(img1, width-200, height-(height-10), 200 * scaleFactor, 100 * scaleFactor);

}

function animation(){
    noStroke();

    push();
    translate(base1.translateX, height/5*4.4);
    base1.drawRect(semicircle.semilength);
    base1.moveRect(semicircle.translateX);
    pop();

    push();
    translate(base2.translateX, height/5*4.4);
    base2.drawRect(square.squarelength);
    base2.moveRect(square.translateX);
    pop();

    push();
    translate(square.translateX, height/5*3.7);
    square.moveSquare();
    square.drawSquare();
    pop();

    push();
    translate(hook.translateX, height / 5 * 3.7);
    hook.moveHook(square.translateX);
    hook.drawHook();
    pop();

    push();
    translate(semicircle.translateX,height/5*2);
    semicircle.moveSemi(square.translateX);
    semicircle.drawSemi();
    pop();

    translateX = width/6.5;
    circleY = height/5*1.82;
    
    push();
    translate(smolcircle.translateX, smolcircle.translateY);
    smolcircle.moveFace(square.translateX);
    smolcircle.drawFace();
    pop();

}

class Square{
    constructor(){
        this.angleSquare = QUARTER_PI;
        this.angleCircle = 0;
        this.translateX = width/8;
        this.vertices = 4;
        this.maxVertices = 120;
        this.radius = 100;
        this.center = createVector(0,0);
        this.squarelength = 180;
    }

    drawSquare(){
        fill(square_colorl);
        rectMode(CENTER);
        //rect(0,0,180,180);

        if(this.translateX < width/3*1.1){
            rect(0,0,180,180);
        }else{
            if(this.vertices < this.maxVertices){
                this.vertices++;
            }
            beginShape();

            for (let i = 0; i < this.vertices; i++) {
                
                this.angleCircle = map(i, 0, this.vertices, 0, TWO_PI);
                // Calculate the x and y coordinates of each vertex
                let x = this.center.x + this.radius * cos(this.angleCircle - PI);
                let y = this.center.y + this.radius * sin(this.angleCircle - PI );
                vertex(x, y);
            }
            endShape(CLOSE);
        }

        if(this.translateX >= width) this.vertices = 4;

        //lower circle
        fill(darkgrey);
        ellipse(0,0,38,38);
    }

    moveSquare(){
        if(this.translateX < width/3*1.1){
            this.translateX += 3;
            rotate(this.angleSquare);
            this.angleSquare+=radians(3);
        }else if(this.translateX < width/3*1.28 && this.translateX > width/3*1.1){
            frameRate(8);
            this.translateX += 2;
        }else if(this.translateX < width+100 && this.translateX > width/3*1.28){
            frameRate(60);
            this.translateX += 3.5;
        }else if(this.translateX >= width){
            this.translateX = width/8;
        }
    }
}

class Hook{
    constructor(){
        this.translateX = width/8;
        this.circleY = height / 5 * 3.7;
        this.increX = 0;
        this.angle = 0;
    }

    drawHook(){
        fill(255);
        strokeWeight(2);

        // Draw the quad
        quad(
            (width / 4.5) - this.translateX + this.increX, (height / 5 * 2.35) - this.circleY,
            (width / 4.1) - this.translateX + this.increX, (height / 5 * 2.35) - this.circleY,
            (width / 7) - this.translateX + this.increX, (height / 5 * 3.6) - this.circleY,
            (width / 7.7) - this.translateX + this.increX, (height / 5 * 3.5) - this.circleY
        );

        // Draw the middle circle
        noStroke();
        fill(200); // lightgrey
        ellipse((width / 7.2) - this.translateX + this.increX, (height / 5 * 3.5) - this.circleY, 30, 30);

        // Draw the arcs
        noFill();
        strokeWeight(12);
        stroke(hook_color);
        arc(0, 0, 50, 50, PI, TWO_PI - QUARTER_PI, OPEN);
        arc(0, 0, 50, 50, TWO_PI - QUARTER_PI, QUARTER_PI, OPEN);

        // Draw the point
        stroke(0);
        strokeWeight(5);
        point((width / 7.5) - this.translateX + this.increX, (height / 5 * 3.55) - this.circleY);

    }

    moveHook(squareX){
        if(squareX < width/5){
            this.translateX += 3;
            this.increX += 3;
            this.angle -= 0.01;
            rotate(this.angle);
        } 
        else if(squareX < width/3*1.1 && squareX >= width/5){
            this.translateX += 3;
            this.increX += 3;
            this.angle -= 0.015;
            rotate(this.angle);
        }else if(squareX < width/3*1.28 && squareX > width/3*1.1){
            frameRate(8);
            this.translateX += 2;
            rotate(this.angle);
            this.increX += 2;
        }else{
            frameRate(60);
            this.translateX -= 4.2;
            if(this.translateX <= width/8) this.translateX = width/8;
            this.increX -= 4.2;
            if(this.increX <= 0) this.increX = 0;
            this.angle += 0.03;
            if(this.angle >= 0) this.angle = 0;
            rotate(this.angle);
        }
    }
}

class SemiCircle{
    constructor(){
        this.squareX = 0;
        this.translateX = width/4.5;
        this.angle = 0;
        this.semilength = 200;
        this.currentAngle = 0;
        this.increX = 0;
    }

    drawSemi(){
        fill(arc_colorl);
        //controller[1]
        rotate(this.angle);
        arc(0,0,200,200,0,PI,CHORD); 
    }

    moveSemi(squareX){
        this.squareX = squareX;
        //right down
        if(this.squareX > width/3*1.1 && squareX < width/3*1.28){
            this.angle += QUARTER_PI/105;
            if(this.angle >= QUARTER_PI / 4.5){
                this.angle = QUARTER_PI/4.5;
            }
            this.currentAngle = this.angle + QUARTER_PI/10;
            this.translateX += 2;
            this.increX = 2;
        //right up
        }else if(this.squareX >= width/3*1.28 && this.squareX < width/3*1.6){
            this.angle -= QUARTER_PI/200;
            if(this.angle <= 0) this.angle = 0;
            this.currentAngle = this.angle + QUARTER_PI/10;
            this.translateX += 2;
            this.increX = 2;
        //left down
        }else if(this.squareX >= width/3*1.6 && this.squareX < width/3*2){
            this.angle -= QUARTER_PI/200;
            if(this.angle <= -QUARTER_PI/4.5) this.angle = -QUARTER_PI/4.5;
            this.currentAngle = this.angle + QUARTER_PI/10;
            this.translateX -= 3.1;
            this.increX = 3.1;
        //left up
        }else if(this.squareX >= width/3*2){
            this.angle += QUARTER_PI/50;
            if(this.angle >= 0) this.angle = 0;
            this.currentAngle = this.angle + QUARTER_PI/10;
            this.translateX += 0;
            this.increX = 0;
        }   
    }    
}

//shadow
class Rect{
    constructor(){
        this.translateX = width/30;
    }

    drawRect(length){
        rectMode(CENTER);
        fill(0,0,0,18);
        rect(0,0, length+30, 20, 20);
    }

    moveRect(squareX){
        this.translateX = squareX;
    }
}

class Face{
    constructor(){
        this.translateX = width/6.5;
        this.translateY = height/5*1.82;
        this.angle = 0;
    }

    drawFace(){
        noStroke();
        fill(smolsphere_color);
        face[0] = ellipse(0,0,50,50);

        stroke(darkgrey);
        strokeWeight(8);
        //eyes
        face[1] = point((width/6.7) - translateX, (height/5*1.8) - circleY);
        face[2] = point((width/6) - translateX, (height/5*1.8) - circleY);
        //nose
        face[3] = line((width/6.3) - translateX, (height/5*1.75) - circleY, 
            (width/6.2) - translateX, (height/5*1.87) - circleY);
        face[4] = line((width/6.2) - translateX, (height/5*1.87) - circleY,
            (width/6.4) - translateX, (height/5*1.87) - circleY);
    }

    moveFace(squareX){
        //logic same as semicircle
        if(squareX > width/3*1.1 && squareX < width/3*1.3){
            this.translateX += 7;
            this.translateY += .4;
            rotate(this.angle);
            this.angle += QUARTER_PI / 4;
        }else if(squareX >= width/3*1.3 && squareX < width/3*1.6){
            this.translateX -= 3;
            this.translateY -= .4;
            rotate(this.angle);
            this.angle -= QUARTER_PI / 10;
        }else if(squareX >= width/3*1.6 && squareX < width/3*2.5){
            this.translateX -= 1.5;
            rotate(this.angle);
            this.angle -= QUARTER_PI / 17.5;
        }else if(squareX >= width/3*2.5){
            this.translateX -= 0;
            this.translateY = height/5*1.82;
            rotate(this.angle);
        }
    }
}
