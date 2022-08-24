var fundo,fundoImg;
var sobrevivente, sobreviventeImg, sobrevivente_atirando;
var barreiras;
var zombieImg, zumbi;
var zombiesGroup;
var heartImg1, heartImg2, heartImg3;
var heart1, heart2, heart3;
var balas, QuantityOfBalas = 80, GrupoDeBalas;
var GameState = "Fight";
var life = 3;
var points = 0;
var winSound, loseSound, explosionSound;

function preload(){
  
  sobreviventeImg = loadImage("assets/shooter_2.png");
  sobrevivente_atirando = loadImage("assets/shooter_3.png");
  zombieImg = loadImage("assets/zombie.png");

  fundoImg = loadImage("assets/bg.jpeg");

  heartImg1 = loadImage("assets/heart_1.png");
  heartImg2 = loadImage("assets/heart_2.png");
  heartImg3 = loadImage("assets/heart_3.png");

  winSound = loadSound("assets/win.mp3");
  loseSound = loadSound("assets/lose.mp3");
  explosionSound = loadSound("assets/explosion.mp3");

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);
  
  fundo = createSprite(displayWidth/2 +55, displayHeight/2 -40, 20, 20);
  fundo.addImage(fundoImg);
  fundo.scale = 1.20;
  
  sobrevivente = createSprite(displayWidth -1150, displayHeight -300, 50 , 50);
  sobrevivente.addImage(sobreviventeImg);
  sobrevivente.scale = 0.3;
  sobrevivente.setCollider("rectangle",0,0,300,500 );
  sobrevivente.debug = false;

  barreiras = createEdgeSprites();

  zombiesGroup = new Group();
  GrupoDeBalas = new Group();

  heart1 = createSprite(displayWidth-150, 40, 20, 20);
  heart1.addImage("Heart1",heartImg1);
  heart1.scale = 0.4;
  heart1.visible = false;

  heart2 = createSprite(displayWidth-100, 40, 20, 20);
  heart2.addImage("Heart2",heartImg2);
  heart2.scale = 0.4;
  heart2.visible = false;

  heart3 = createSprite(displayWidth-150, 40, 20, 20);
  heart3.addImage("Heart3",heartImg3);
  heart3.scale = 0.4;
}


function draw() {
  background(0); 

  if(GameState === "Fight"){
   if(life === 3){
   heart1.visible = false;
   heart2.visible = false;
   heart3.visible = true;
   }
   if(life === 2){
    heart1.visible = false;
    heart2.visible = true;
    heart3.visible = false;
   }
   if(life === 1){
   heart1.visible = true;
   heart2.visible = false;
   heart3.visible = false;
   }
   if(life === 0){
    GameState = "Lost";
    loseSound.play();
   }
   if(points === 70){
    GameState = "Won";
    winSound.play();
    winSound.setVolume(0.3);
   }
 
  if(keyDown(UP_ARROW)|| touches.length>0){
    sobrevivente.y -= 30;
  }

  if(keyDown(DOWN_ARROW)|| touches.length>0){
    sobrevivente.y += 30;
  }

  sobrevivente.collide(barreiras[3]);
  sobrevivente.collide(barreiras[2]);

  if(keyWentDown("space")){
    balas = createSprite(displayWidth-1150,sobrevivente.y-30,20,10);
    GrupoDeBalas.add(balas);
    balas.velocityX = 20;
    sobrevivente.depth = balas.depth;
    sobrevivente.depth+= 2;
    QuantityOfBalas -= 1;
    explosionSound.play();
    explosionSound.setVolume(0.3);
    
    sobrevivente.addImage(sobrevivente_atirando);
  }
  else if(keyWentUp("space")){
    sobrevivente.addImage(sobreviventeImg);
  }
  
  if(QuantityOfBalas === 0){
    GameState = "Bullet";
    loseSound.play();
    loseSound.setVolume(0.3);
  }


  if(zombiesGroup.isTouching(GrupoDeBalas)){
    for(var z=0; z<zombiesGroup.length; z++){
      if(zombiesGroup[z].isTouching(GrupoDeBalas)){
        GrupoDeBalas.destroyEach();
        zombiesGroup[z].destroy();
        points += 5;
        explosionSound.play();
        explosionSound.setVolume(0.5);
      }
    }
  }

  if(zombiesGroup.isTouching(sobrevivente)){
    for(var z=0; z<zombiesGroup.length; z++){
      if(zombiesGroup[z].isTouching(sobrevivente)){
        zombiesGroup[z].destroy();
        life --;
      }
    }
  }
  zombies();
 }
   drawSprites();
   
   textSize(30);
   fill("Blue");
   text("Pontuação: "+ points, displayWidth-210, displayHeight/2 -250 );

   text("Balas: " + QuantityOfBalas, displayWidth-200, displayHeight/2 -220);


   if(GameState === "Bullet"){
    textSize(50);
    fill("Red");
    text("Acabou sua munição!", 470, 410);
    zombiesGroup.destroyEach();
    GrupoDeBalas.destroyEach();
    sobrevivente.destroy();
  
 } else if(GameState === "Lost"){
    textSize(100);
    fill("Red");
    text("Você perdeu!", 400, 400);
    zombiesGroup.destroyEach();
    sobrevivente.destroy();
 
  } else if(GameState==="Won"){
    textSize(100);
    fill("Yellow");
    text("Você venceu!", 400, 400);
    zombiesGroup.destroyEach();
    sobrevivente.destroy();
  }
}

function zombies(){
 if(frameCount% 60 === 0){
   zumbi = createSprite(random(500, 1100), random(100, 500), 40, 40);
   zumbi.addImage(zombieImg);
   zumbi.scale = 0.15;
   zumbi.velocityX = -3;
   zumbi.setCollider("rectangle",0,0,400,1000);
   zumbi.debug = false;
   zumbi.lifetime = 400;
   zombiesGroup.add(zumbi);
 }
}
