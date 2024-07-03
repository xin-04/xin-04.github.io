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

let mapState = 0;

var bird1,
    birdP1,
    birdP2,
    title,
    ground,
    walltop,
    bottom;

var button1,
    button2,
    buttonP,
    buttonR,
    buttonM;

var birdLift = -12;

let bird1OriginalTexture = 'img/bird_yellow.png';
let bird1FlapTexture = 'img/bird1_pressed.png';

let birdP1OriginalTexture = 'img/birdP1_close.png';
let birdP1FlapTexture = 'img/birdP1_open.png';

let birdP2OriginalTexture = 'img/birdP2_close.png';
let birdP2FlapTexture = 'img/birdP2_open.png';

var balls = [];
var balls_P1 = [];
var balls_P2 = [];
var ballSpeed = 2;

let enemyPositions1 = [170, 270, 370, 470];
let enemyPositions2 = [120, 220, 320, 420];
let enemies = [];
let enemySpeed = .25;

let counter = 0;
let counterP1 = 0;
let counterP2 = 0;
let bgm;
let isRunning = true;

function preLoad(){
    soundFormats('mp3', 'ogg');
    bgm = loadSound('img/bgm.mp3');
}

function setup(){
    createCanvas(1280,720);

    //bgm = loadSound('img/bgm.mp3');

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
                texture: bird1OriginalTexture,
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
        enemies: [...enemies], //copy of enemies array
        balls: [...balls] //copy of balls array
    };

    Matter.Events.on(engine, 'collisionStart', collision);

    Composite.add(engine.world, [title, walltop, bottom, ground]);
    currentRender = renderMenu;
    Render.run(currentRender);
    runner = Runner.create();
    Runner.run(runner, engine);

    
    button1P();
    button2P();
}

function draw(){

    if(!isRunning) return;

    Engine.update(engine);
    
    for (let i = 0; i < enemies.length; i++) {
        Body.translate(enemies[i], { x: enemySpeed, y: 0 });
    }

    if(mapState === 1) updateBalls();
    else if(mapState === 2) updateBallsP2();

    fill(255);
    textSize(30);
    text(`Enemies Collided: ${counter}`, width/3, height - 20);
}

function button1P(){
    button1 = createImg('img/button1P.png');
    button1.position(width/4, height/2);
    button1.size(323 * .8, 117 * .8);
    button1.mousePressed(map1P);
}

function button2P(){
    button2 = createImg('img/button2P.png');
    button2.position(width/2, height/2);
    button2.size(323 * .8, 117 * .8);
    button2.mousePressed(map2P);
}

function buttonPlay(){
    buttonP = createImg('img/buttonPlay.png');
    buttonP.position(width/3, height/2);
}

function map1P(){

    mapState = 0;

    generateEnemy();
    backtoMenu();
    alert("button1 is pressed.");
    Composite.remove(engine.world, title);
    Composite.add(engine.world, [bird1, ...enemies]);
    button1.remove();
    button2.remove();
}

function map2P(){

    mapState = 1;

    alert("button2 is pressed.");
    Composite.remove(engine.world, [title]);
    button1.remove();
    button2.remove();

    birdP1 = Bodies.rectangle(350, 400, 80, 80,{
        render:{
            sprite: {
                texture: birdP1OriginalTexture,
                xScale: 1.2,
                yScale: 1.2
            }
        }
    });

    birdP2 = Bodies.rectangle((width/2) + 350, 400, 80, 80,{
        render:{
            sprite: {
                texture: birdP2OriginalTexture,
                xScale: 1.3,
                yScale: 1.3
            }
        }
    });

    Composite.add(engine.world, [birdP1, birdP2]);
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
    }else if(keyCode === 50){
        map2P();
    }
    
    if (key === ' ') {
        Body.setVelocity(bird1, { x: 0, y: birdLift });
        bird1.render.sprite.texture = bird1FlapTexture;
        releaseFireball();
    }else if(key === 'w'){
        Body.setVelocity(bird1, { x: 0, y: birdLift });
        birdP1.render.sprite.texture = birdP1FlapTexture;
        releaseFireballP1();
    }
    
    if(keyCode === UP_ARROW){
        Body.setVelocity(birdP2, { x: 0, y: birdLift });
        birdP2.render.sprite.texture = birdP2FlapTexture;
        releaseFireballP2();
    }
}

function keyReleased() {
    if (key === ' ') {
        bird1.render.sprite.texture = bird1OriginalTexture;
    }else if(key === 'w'){
        birdP1.render.sprite.texture = birdP1OriginalTexture;
    }
    
    if(keyCode === UP_ARROW){
        birdP2.render.sprite.texture = birdP2OriginalTexture;
    }
}

function mousePressed(){
    bird1.render.sprite.texture = bird1FlapTexture;
    Body.setVelocity(bird1, { x: 0, y: birdLift });
    releaseFireball();
}

function mouseReleased(){
    bird1.render.sprite.texture = bird1OriginalTexture;
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
            }else if((enemies.includes(bodyA) && balls.includes(bodyB)) || (enemies.includes(bodyB) && balls.includes(bodyA))){
                alert('Enemy collided with a fireball!');
                end();
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

            //player1 & fireball
            }else if((bodyA === birdP1 && balls.includes(bodyB)) || (bodyB === birdP1 && balls.includes(bodyA))){
                alert('P1 collided with fireball!');
                end();
                counter++;
            //player1 & top
            }else if((bodyA === birdP1 && bodyB === walltop) || (bodyA === walltop && bodyB === birdP1)){
                alert('P1 touched the top!');
                end();
                counter++;
            //player1 & bottom
            }else if((bodyA === birdP1 && bodyB === bottom) || (bodyA === bottom && bodyB === birdP1)){
                alert('P1 touched the bottom!');
                end();
                counter++;
        
            
            //player2 & fireball
            }else if((bodyA === birdP2 && balls.includes(bodyB)) || (bodyB === birdP2 && balls.includes(bodyA))){
                alert('P2 collided with fireball!');
                end();
                
            //player2 & top
            }else if((bodyA === birdP2 && bodyB === walltop) || (bodyA === walltop && bodyB === birdP2)){
                alert('P2 touched the top!');
                end();
            //player2 & bottom
            }else if((bodyA === birdP2 && bodyB === bottom) || (bodyA === bottom && bodyB === birdP2)){
                alert('P2 touched the bottom!');
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
    Body.setVelocity(fireball, { x: ballSpeed, y: 0 });

}

function releaseFireballP1(){
    let fireball = Bodies.circle(birdP1.position.x + 50, birdP1.position.y, 10, {
        restitution: 0.6,
        friction: 0.5,
        frictionAir: 0.02,
        isStatic: true
    });
    balls_P1.push(fireball);
    Composite.add(engine.world, fireball);
    Body.setVelocity(fireball, { x: ballSpeed, y: 0 });

}

function releaseFireballP2(){
    let fireball = Bodies.circle(birdP2.position.x - 50, birdP2.position.y, 10, {
        restitution: 0.6,
        friction: 0.5,
        frictionAir: 0.02,
        isStatic: true
    });
    balls_P2.push(fireball);
    Composite.add(engine.world, fireball);
    Body.setVelocity(fireball, { x: ballSpeed * -1, y: 0 });

}

function updateBalls() {
    for(let i = 0; i < balls.length; i++){
        let ball = balls[i];

        Body.setPosition(ball, { x: ball.position.x + ball.velocity.x, y: ball.position.y });

        ellipse(ball.position.x, ball.position.y, 20);

        //reverse direction
        if (ball.position.x >= (width/1.5) - 20) {
            Body.setVelocity(ball, { x: -ball.velocity.x, y: ball.velocity.y });
        }
    }
}

function updateBallsP2() {
    for(let i = 0; i < balls_P1.length; i++){
        let ball = balls_P1[i];

        Body.setPosition(ball, { x: ball.position.x + ball.velocity.x, y: ball.position.y });

        fill(255,0,0);
        ellipse(ball.position.x, ball.position.y, 20);
    }

    for(let i = 0; i < balls_P2.length; i++){
        let ball = balls_P2[i];

        Body.setPosition(ball, { x: ball.position.x + ball.velocity.x, y: ball.position.y });

        fill(0,0,255);
        ellipse(ball.position.x, ball.position.y, 20);
    }
}

function end(){
    isRunning = false;
    Events.off(engine, 'collisionStart', collision);

    buttonR = createImg('img/retry.png');
    buttonR.position(width/2.5, height/2.5);
    buttonR.size(72 * 1.5, 69 * 1.5);
    buttonR.mousePressed(resetWorld);

    Runner.stop(runner);
}

function resetWorld(){

    Body.setPosition(bird1, initialWorldState.bird1Position);

    enemies.forEach(enemy => Composite.remove(engine.world, enemy));
    enemies = [];

    balls.forEach(ball => Composite.remove(engine.world, ball));
    balls = [];

    generateEnemy();
    Composite.add(engine.world, [bird1, ...enemies]);
    window.location.reload();

    Runner.run(engine,runner);
}

function backtoMenu(){
    buttonM = createImg('img/home.png');
    buttonM.position(0, 0);
    buttonM.size(72 * 1.5, 69 * 1.5);
    buttonM.mousePressed(resetWorld);
}
