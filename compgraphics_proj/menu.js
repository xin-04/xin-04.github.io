const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events;

let engine,
    currentRender,
    renderMenu,
    runner;

var bird1,
    title,
    ground,
    walltop,
    bottom;

var button1,
    button2,
    buttonP,
    buttonR,
    buttonM;

var birdLift = -10;

let birdOriginalTexture = 'img/bird_yellow.png';
var birdFlapTexture = 'img/bird1_pressed.png';

var balls = [];
var ballSpeed = 2;

let enemyPositions1 = [170, 270, 370, 470];
let enemyPositions2 = [120, 220, 320, 420];
let enemies = [];
let enemySpeed = .5;

var counter = 0;

let bgm;

function preLoad(){
    soundFormats('mp3', 'ogg');
    bgm = loadSound('img/bgm.mp3');
}

function setup(){
    createCanvas(1280,720);
    engine = Engine.create();
    renderMenu = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: 1280,
            height: 720,
            wireframes: false,
            background: 'img/bg.png'
    }
    });
    
    bird1 = Bodies.rectangle(350, 400, 80, 80,{
        render:{
            sprite: {
                texture: birdOriginalTexture,
                xScale: 1,
                yScale: 1
            }
        }
    });

    title = Bodies.rectangle(width/2, height/3, 100, 20,{
        isStatic: true,
        render:{
            sprite:{
                texture: 'img/title.png',
                xScale: 1.5,
                yScale: 1.5
            }
        }
    });

    walltop = Bodies.rectangle(width/2, 0, width, 60, { 
        isStatic: true,
    });

    bottom = Bodies.rectangle(width/2, height - 60, width, 60, { 
        isStatic: true,
    });

    ground = Bodies.rectangle(width/2, height, width, 60, { 
        isStatic: true,
    });

    initialWorldState = {
        bird1Position: { x: 350, y: 400 },
        enemies: [...enemies], // Copy of enemies array
        balls: [...balls] // Copy of balls array
    };


    Composite.add(engine.world, [title, walltop, bottom, ground]);
    currentRender = renderMenu;
    Render.run(currentRender);
    runner = Runner.create();
    Runner.run(runner, engine);

    collision();
    
    button1P();
    button2P();
    button1.mousePressed(map1P);
}

function draw(){
    Engine.update(engine);
    
    for (let i = 0; i < enemies.length; i++) {
        Body.translate(enemies[i], { x: enemySpeed, y: 0 });
    }

    updateBalls();

    fill(255);
    textSize(30);
    text(`Enemies Collided: ${counter}`, width/3, height - 20);
}

function button1P(){
    button1 = createImg('img/button1P.png');
    button1.position(width/4, height/2);
    button1.size(323 * .8, 117 * .8);
}

function button2P(){
    button2 = createImg('img/button2P.png');
    button2.position(width/2, height/2);
    button2.size(323 * .8, 117 * .8);
}

function buttonPlay(){
    buttonP = createImg('img/buttonPlay.png');
    buttonP.position(width/3, height/2);
}

function map1P(){

    generateEnemy();
    backtoMenu();
    alert("button1 is pressed.");
    Composite.remove(engine.world, title);
    Composite.add(engine.world, [bird1, ...enemies]);
    button1.remove();
    button2.remove();
}

function generateEnemy(){

    for (let i = 0; i < enemyPositions1.length; i++) {
        let enemy = Bodies.rectangle(-50, enemyPositions1[i], 80, 80, {
            isStatic: true,
            render: {
                sprite: {
                    texture: 'img/bird_blue.png',
                    xScale: 0.7,
                    yScale: 0.7
                }
            }
        });
        enemies.push(enemy);
    }

    for (let i = 0; i < enemyPositions2.length; i++) {
        let enemy = Bodies.rectangle(-150, enemyPositions2[i], 80, 80, {
            isStatic: true,
            render: {
                sprite: {
                    texture: 'img/bird_blue.png',
                    xScale: 0.7,
                    yScale: 0.7
                }
            }
        });
        enemies.push(enemy);
    }

    for (let i = 0; i < enemyPositions1.length; i++) {
        let enemy = Bodies.rectangle(-250, enemyPositions1[i], 80, 80, {
            isStatic: true,
            render: {
                sprite: {
                    texture: 'img/bird_green.png',
                    xScale: 0.4,
                    yScale: 0.4
                }
            }
        });
        enemies.push(enemy);
    }

    for (let i = 0; i < enemyPositions2.length; i++) {
        let enemy = Bodies.rectangle(-350, enemyPositions2[i], 80, 80, {
            isStatic: true,
            render: {
                sprite: {
                    texture: 'img/bird_green.png',
                    xScale: 0.4,
                    yScale: 0.4
                }
            }
        });
        enemies.push(enemy);
    }

    for (let i = 0; i < enemyPositions1.length; i++) {
        let enemy = Bodies.rectangle(-450, enemyPositions1[i], 80, 80, {
            isStatic: true,
            render: {
                sprite: {
                    texture: 'img/bird_pink.png',
                    xScale: 0.4,
                    yScale: 0.4
                }
            }
        });
        enemies.push(enemy);
    }

    for (let i = 0; i < enemyPositions2.length; i++) {
        let enemy = Bodies.rectangle(-550, enemyPositions2[i], 80, 80, {
            isStatic: true,
            render: {
                sprite: {
                    texture: 'img/bird_pink.png',
                    xScale: 0.4,
                    yScale: 0.4
                }
            }
        });
        enemies.push(enemy);
    }
}

function canvasPressed(){
    bgm.play();
}

function keyPressed(){
    if(keyCode === 49){
        map1P();
    }
    if (key === ' ') {
        //buttonP.remove();
        Body.setVelocity(bird1, { x: 0, y: birdLift });
        bird1.render.sprite.texture = birdFlapTexture;
        releaseFireball();
    }
}

function keyReleased() {
    if (key === ' ') {
        bird1.render.sprite.texture = birdOriginalTexture;
    }
}

function mousePressed(){
    bird1.render.sprite.texture = birdFlapTexture;
    Body.setVelocity(bird1, { x: 0, y: birdLift });
    releaseFireball();
}

function mouseReleased(){
    bird1.render.sprite.texture = birdOriginalTexture;
}

function collision(){
    Events.on(engine, 'collisionStart', function(event) {
        let pairs = event.pairs;
        pairs.forEach(function(pair) {
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;

            //bird1 & top
            if ((bodyA === bird1 && bodyB === walltop) || (bodyA === walltop && bodyB === bird1)) {
                alert('Bird1 touched the top!');
                end();
            //bird1 & bottom
            }else if((bodyA === bird1 && bodyB === bottom) || (bodyA === bottom && bodyB === bird1)) {
                alert('Bird1 touched the bottom!');
                end();
            //bird1 & enemy
            }else if((bodyA === bird1 && enemies.includes(bodyB)) || (bodyB === bird1 && enemies.includes(bodyA))) {
                alert('Bird1 collided with an enemy!');
                end();
            //bird1 & fireball
            }else if((bodyA === bird1 && balls.includes(bodyB)) || (bodyB === bird1 && balls.includes(bodyA))) {
                alert('Bird1 collided with a fireball!');
                end();
            //enemy & fireball
            }else if(enemies.some(enemy => enemy === bodyA || enemy === bodyB) && balls.some(ball => ball === bodyA || ball === bodyB)) {
                
                //remove enemy
                let enemyToRemove = enemies.find(enemy => enemy === bodyA || enemy === bodyB);
                if (enemyToRemove) {
                    Composite.remove(engine.world, enemyToRemove);
                    enemies = enemies.filter(enemy => enemy !== enemyToRemove);
                }

                //remove fireball
                let ballToRemove = balls.find(fireball => fireball === bodyA || fireball === bodyB);
                if (ballToRemove) {
                    Composite.remove(engine.world, ballToRemove);
                    balls = balls.filter(fireball => fireball !== ballToRemove);
                }
                alert('Enemy collided with a fireball!');
                counter++;
                end();
            }
        });
    });
}

function releaseFireball(){
    let fireball = Bodies.circle(bird1.position.x + 50, bird1.position.y, 10, {
        restitution: 0.6,
        friction: 0.5,
        frictionAir: 0.02,
        isStatic: true
    });
    balls.push(fireball);
    Composite.add(engine.world, fireball);
}

function updateBalls() {
    for(let i = 0; i < balls.length; i++){
        let ball = balls[i];

        let ballincreX = 2; 

        if (ball.position.x > width/1.5) { 
            ballincreX = -2; 
        }

        ball.position.x += ballincreX;
        fill(255, 0, 0);
        noStroke();
        ellipse(ball.position.x, ball.position.y, 10 * 2);
    }
}

function end(){
    buttonR = createImg('img/retry.png');
    buttonR.position(width/2.5, height/2.5);
    buttonR.size(72 * 1.5, 69 * 1.5);
    buttonR.mousePressed(resetWorld);
}

function resetWorld(){
    Body.setPosition(bird1, initialWorldState.bird1Position);

    enemies.forEach(enemy => Composite.remove(engine.world, enemy));
    enemies = [];

    balls.forEach(ball => Composite.remove(engine.world, ball));
    balls = [];

    generateEnemy();
    window.location.reload();
}

function backtoMenu(){
    buttonM = createImg('img/home.png');
    buttonM.position(0, 0);
    buttonM.size(72 * 1.5, 69 * 1.5);
    buttonM.mousePressed(resetWorld);
}
