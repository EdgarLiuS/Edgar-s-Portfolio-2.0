
let AssetList = [];
let levelCollider = [];
let size = 50;
let wid=24;
let leng=24;
let SpawnPoint =[]
let PlayerPrepareBox = [];
let PlayerPos=[];
let moving=false;
let isMoveValid=true;
let trigger=[];
let playerInTrigger=false;
let debugMode=false;
let levelCanLoad=true;
let prevAsset=0;
let levelnum=0;
let timeBas = 0;
let timer;
let minut = 0
let sec = 0
let maxY = -Infinity;
//player stats
let life = 3;
let maxLife =3;

//effects
let lifeBoostTime = 0;


let enemyPos = [];
let enemyAmount = 8;
let enemyKilled = 0;
let redScreenSecLeft = 0;
let triAmount = 3;//trigger amouuuunt




function setup() {
  size=windowHeight/wid
  createCanvas(size*wid, size*leng);
  
  LevelAsset()
  Spawn()
  Reload()
  startTimer()
  
}

function draw() {
  background(23, 43, 69);
  
  
  Win()
  
  LevelAppear()
  Trigger()
  PlayerStatsManager()
  Enemy()
  
  CharacterAppear()
  DebugGeneral()
  
  Ui()
}





function Ui(){
  textFont('Courier New');
  UIHP();
  UIKillCount(enemyKilled)
  textSize(40)
  fill(150,255,0)
  stroke(0);
  textAlign(RIGHT, TOP);
  text("Level-"+levelnum+"/∞",wid*size-20,20)
  //textAlign(LEFT, TOP);
  sec=timeBas-minut*90
  if(sec>=60){
    minut++
  }
  if(sec<10){
    text(minut+":0"+sec,wid*size-20,60)
  }
  else{
    text(minut+":"+sec,wid*size-20,60)
  }
  //text("Win Y:"+maxY,0,120)
  //text("EnemyKilled:"+enemyKilled, 0, 150)
  //text("EnemyRemaining:"+enemyPos.length, 0, 180)
  //text("playerLife: "+life,0,180)
  text("lifeBoostTime:"+lifeBoostTime,0,210)
  redScreen(redScreenSecLeft)
  
}

function UIHP(){
  //healthboost
  if(lifeBoostTime>0){
    UIHeart(0.2,leng-1.2,50,50,50,false)
    UIHeart(1.2,leng-1.2,50,50,50,false)
    UIHeart(2.2,leng-1.2,50,50,50,false)
    UIHeart(3.2,leng-1.2,50,50,50,false)
    UIHeart(4.2,leng-1.2,50,50,50,false)
    
  }else{
    UIHeart(0.2,leng-1.2,50,50,50,false)
    UIHeart(1.2,leng-1.2,50,50,50,false)
    UIHeart(2.2,leng-1.2,50,50,50,false)
  }
    if(life==5){
      UIHeart(0.2,leng-1.2,255,0,0,true)
      UIHeart(1.2,leng-1.2,255,0,0,true)
      UIHeart(2.2,leng-1.2,255,0,0,true)
      UIHeart(3.2,leng-1.2,255,200,0,true)
      UIHeart(4.2,leng-1.2,255,200,0,true)
      
    } 
    else if(life==4)
    {
      UIHeart(0.2,leng-1.2,255,0,0,true)
      UIHeart(1.2,leng-1.2,255,0,0,true)
      UIHeart(2.2,leng-1.2,255,0,0,true)
      UIHeart(3.2,leng-1.2,255,200,0,true)
      
    }
    else if(life==3)
    {
      UIHeart(0.2,leng-1.2,255,0,0,true)
      UIHeart(1.2,leng-1.2,255,0,0,true)
      UIHeart(2.2,leng-1.2,255,0,0,true)
    }
    else if(life==2)
    {
      UIHeart(0.2,leng-1.2,255,0,0,true)
      UIHeart(1.2,leng-1.2,255,0,0,true)
      
    }
    else if(life==1)
    {
      UIHeart(0.2,leng-1.2,255,0,0,true)
      
      
    }
  
  
}

function UIHeart(HeartX,HeartY,HeartR,HeartG,HeartB,highlight){
  noStroke()
  let heart=[0,0,0,0,0,0,0,0,0,0,
             0,0,1,1,0,0,1,1,0,0,
             0,1,2,2,1,1,2,2,1,0,
             1,4,2,2,2,2,2,3,2,1,
             1,4,2,2,2,2,2,2,2,1,
             1,4,2,2,2,2,2,2,2,1,
             0,1,4,2,2,2,2,2,1,0,
             0,0,1,4,2,2,2,1,0,0,
             0,0,0,1,4,4,1,0,0,0,
             0,0,0,0,1,1,0,0,0,0]
  let cols = 10;
  for (let h = 0; h<heart.length; h ++){
    let hsqx =(h % cols)*0.1*size
    let hsqy =Math.floor(h / cols)*0.1*size
    if (heart[h]==1){
      fill(0)
      rect(HeartX*size+hsqx,HeartY*size+hsqy,0.1*size,0.1*size)
    }
    if(heart[h]==2){
      fill(HeartR,HeartG,HeartB)
      rect(HeartX*size+hsqx,HeartY*size+hsqy,0.1*size,0.1*size)
    }
    if(heart[h]==3 && highlight==true){
      fill(255)
      rect(HeartX*size+hsqx,HeartY*size+hsqy,0.1*size,0.1*size)
    } else if(heart[h]==3){
      fill(HeartR,HeartG,HeartB)
      rect(HeartX*size+hsqx,HeartY*size+hsqy,0.1*size,0.1*size)
    }
    if(heart[h]==4){
      fill(HeartR*0.5,HeartG*0.5,HeartB*0.5)
      rect(HeartX*size+hsqx,HeartY*size+hsqy,0.1*size,0.1*size)
    }
  }
  
}


function UIKillCount(killedNum){
  let killArray=[]
  let cols = 7 ;
  for (let k = 0; k<killedNum;k++){
    let x=k % cols
    let y=Math.floor(k / cols)
    killArray.push({X:x,Y:y});
    
  }
  for(let ar = 0; ar<killArray.length;ar++){
    UIKilled(killArray[ar].X,killArray[ar].Y)
  }
}


function UIKilled(skullX,skullY){
  let skull=[0,0,1,1,1,1,1,1,0,0,
             0,1,2,2,2,2,2,2,1,0,
             1,1,2,2,2,2,2,2,1,1,
             1,2,2,2,2,2,2,2,2,1,
             1,2,1,2,2,1,2,2,2,1,
             1,2,2,1,2,2,1,2,1,1,
             1,1,2,2,2,2,2,2,1,0,
             0,1,2,1,2,1,2,1,1,0,
             0,1,2,1,2,1,2,1,0,0,
             0,0,1,1,1,1,1,1,0,0];
  
  let cols = 10;
  for (let h = 0; h<skull.length; h ++){
    let hsqx =(h % cols)*0.1*size
    let hsqy =Math.floor(h / cols)*0.1*size
    if (skull[h]==1){
      fill(0)
      rect(skullX*size+hsqx,skullY*size+hsqy,0.1*size,0.1*size)
    }
    if(skull[h]==2){
      fill(200)
      rect(skullX*size+hsqx,skullY*size+hsqy,0.1*size,0.1*size)
    }
  }
}


function UpdateFinishLine(){
  maxY = -Infinity;
  for (let i = 0; i < levelCollider.length; i++) {
    if (levelCollider[i].y > maxY) {
      maxY = levelCollider[i].y;
    }
  }
}




function Win(){
  
  if (PlayerPos[0].y==maxY){
    Reload()
  }
  
}




function Reload(){
  enemyPos=[]
  trigger=[]
  Level()
  UpdateFinishLine()
  PlayerPos=[{x:SpawnPoint[0].x,y:SpawnPoint[0].y}]
  levelnum++
  SpawnEnemy(enemyAmount)
  //life
  
  if(lifeBoostTime>0){
    lifeBoostTime--;
  }
  PlayerStatsManager()
  life = maxLife
  TriggerGenerate(triAmount)
  
}




function LevelAsset(){
  //about tags:
  //entrance is the origin of an asset
  //exit would be the origin of the next asset
  //floor are able to hold other components eg triggers
  //walkway none of the components will spawn on walkways
  //safe will not spawn enemy, triggers, and treasures
  
  let lobby=[
    {type:"notespawn",tag:"note"},
    {x:1,y:1,tag:"entrance"},//entrance
    
    {x:1,y:3,tag:"walkway"},
    {x:1,y:4,tag:"exit"},//exit
  ]
  LevelDoARect(0,0,3,3,lobby,"safe")
  
  let largeroom1 = [
    {type:"room",tag:"note"},
    {x:-1,y:2,tag:"entrance"},//entrance
    {x:0,y:2,tag:"walkway"},
    
    {x:2,y:3,tag:"walkway"},
    {x:2,y:4,tag:"exit"},//exit
  ]
  LevelDoARect(1,0,5,3,largeroom1,"floor")
  
  let smallroom1 = [
    {type:"room",tag:"note"},
    {x:2,y:0,tag:"entrance"},
    {x:2,y:1,tag:"walkway"},
    
    {x:4,y:4,tag:"walkway"},
    {x:5,y:4,tag:"exit"},
  ]
  LevelDoARect(0,2,4,3,smallroom1,"floor")
  
  let smallroom2 = [
    {type:"room",tag:"note"},
    {x:5,y:0,tag:"entrance"},
    {x:5,y:1,tag:"walkway"},
    {x:5,y:2,tag:"walkway"},
    {x:4,y:2,tag:"walkway"},
    
    {x:0,y:4,tag:"walkway"},
    {x:1,y:4,tag:"exit"},
  ]
  LevelDoARect(2,2,3,3,smallroom2,"floor")
  
  AssetList=[
    lobby,
    largeroom1,
    smallroom1,
    smallroom2
  ]
  //print("AssetList：smallroom1")
  //print(AssetList)
}




function LevelDoARect(startingX,startingY,leng,wid,targetArray,tagg){
  for(let a = startingX; a<=startingX+leng-1; a++){
    for(let b = startingY; b<=startingY+wid-1; b++){
      targetArray.push({x:a,y:b,tag:tagg})
    }
  }
  
}





function Level(){
  
  `levelCollider=[
    {x:0,y:0},
    {x:0,y:1},
    {x:1,y:1},
    {x:1,y:2},
    {x:1,y:3},
    {x:2,y:3},
    {x:3,y:3},
    {x:4,y:3},
    {x:3,y:4},
    {x:4,y:4},
    {x:3,y:5},
    {x:3,y:6},
    {x:4,y:6},
    {x:5,y:6},
  ]`
  levelCollider=[]
  LevelLoader()
  
  
  let Xthreshold = 23;
  let Ythreshold = 23;
  levelCollider = levelCollider.filter(el => el.y < Ythreshold && el.y > 0);
  levelCollider = levelCollider.filter(el => el.x < Xthreshold && el.x > -1);
}






function LevelLoader(){
  
  let LoadX
  let LoadY
  Load(SpawnPoint[0].x,SpawnPoint[0].y,0)//spawn
  
  let prevAsset = 0;
  let prevLoadX = SpawnPoint[0].x
  let prevLoadY = SpawnPoint[0].y
  let PrevOriginX
  let PrevOriginY
  
  for(let j = 0; j<5;j++){
    randomAsset = int(random(1, AssetList.length));
    
      for(let g = 1; g<AssetList[prevAsset].length; g++){
        if(AssetList[prevAsset][g].tag=="entrance"){
          PrevOriginX=AssetList[prevAsset][g].x
          PrevOriginY=AssetList[prevAsset][g].y
        }
        if(AssetList[prevAsset][g].tag=="exit"){
          //print("exit found!")
          LoadX=AssetList[prevAsset][g].x+(prevLoadX-PrevOriginX)
          LoadY=AssetList[prevAsset][g].y+(prevLoadY-PrevOriginY)
          //print("prevassetX:"+AssetList[prevAsset][g].x+", Y:"+AssetList[prevAsset][g].y)
          //print("prev X:"+prevLoadX+", Y"+prevLoadY)
      }
      
    }
    Load(LoadX,LoadY,randomAsset)
    //print("Loaded at X:"+LoadX+", Y"+LoadY)
      
    prevAsset=randomAsset
    prevLoadX=LoadX
    prevLoadY=LoadY
  }
}






function Load(LX,LY,AssetNum){
  let EntranceX;
  let EntranceY;
  for(let t = 1; t<AssetList[AssetNum].length; t++){
    if(AssetList[AssetNum][t].tag=="entrance"){
      EntranceX = AssetList[AssetNum][t].x
      EntranceY = AssetList[AssetNum][t].y
      print("--Entrance X:"+EntranceX+", Y:"+EntranceY)
    }else{
      
    }
  }
  if (EntranceY==null){
      print(AssetNum+" doesn't have an entrance!")
  }
  for(let h = 1; h<AssetList[AssetNum].length; h++){
    
    levelCollider.push(
    {x:AssetList[AssetNum][h].x+LX-EntranceX,
     y:AssetList[AssetNum][h].y+LY-EntranceY,
     tag:AssetList[AssetNum][h].tag})
  }
  
}




function LevelAppear(){
  
  
  
    NoiseBackground()
    
    stroke(0);
    strokeWeight(2)
    for(let i = 0; i<levelCollider.length;i++){
      if (levelCollider[i].y == maxY){
        fill(255,100,0)
        
      } else{
        if (levelCollider[i].tag =="safe"){
          fill(222, 204, 168)
        }else if(levelCollider[i].tag =="walkway"){
          fill(149, 188, 197)
        }else if(levelCollider[i].tag =="entrance"){
          fill(149, 188, 197)
        }else{
          if (levelCollider[i].x % 2 === 0&&
              levelCollider[i].y % 2 === 0) {
            fill(18, 120, 120)
          } else if((levelCollider[i].x+1) % 2 === 0&&
              (levelCollider[i].y+1) % 2 === 0){
            fill(18, 120, 120)
          }else{
            fill(0,100,100)
          }
          
        }
        
        
      }
    
      rect(size*levelCollider[i].x,size*levelCollider[i].y,size,size)
    }
  
  
}

function NoiseBackground(){
  noStroke()
  let noiseSize=size/2;
  let noiseCount = Math.max(wid, leng)*2;
  let scale=2;
  let zOffset=(Math.floor(frameCount/30) * 30)/20;
  for(let j = 0; j<noiseCount; j++){
    for(let i = 0; i<noiseCount; i++){
      let x =i*scale
      let y =j*scale
      let n = noise(x, y, zOffset);
      let g = map(n, 0, 1, 100, 255);
      
      
      fill(50,g*0.4,g*0.5)
      
      rect(i*noiseSize,j*noiseSize,noiseSize,noiseSize)
    }
    
    
  }
}




function Spawn(){
  SpawnPoint=[{x:10,y:2}]
  PlayerPos=[{x:SpawnPoint[0].x,y:SpawnPoint[0].y}]
}




function TriggerGenerate(triggerAmount){
  randomTriggerAmount=floor(random(0,triggerAmount+0.9))
  randomTriggerFx=floor(random(0,2))
  
  //random trigger effect
  
  
  let randTrigg
  for(let tr=0;tr<randomTriggerAmount;tr++){
    
    randTrigg=floor(random(0,levelCollider.length))
    
    if (levelCollider[randTrigg].tag == "floor"){
      TriggerCreate(levelCollider[randTrigg].x,
                    levelCollider[randTrigg].y,
                    randomTriggerFx)
      print("trigger generated!")
      
    }else{
      
      TriggerGenerate(1)
      
    }
  }
}





function TriggerCreate(TriggerX,TriggerY,Funct){
  trigger.push(
    {x:TriggerX,y:TriggerY,
     Fx:Funct,
    InTrigger:false,
    PrevInTrigger:false,
    OnEntry:false,
    OnExit:false},
  )
}


function TriggerDraw(trigcount){
  if(trigger[trigcount].Fx==0){
      fill(255,0,0)
      rect(size*trigger[trigcount].x,
       size*trigger[trigcount].y,
       size,
       size)
      
      fill(0)
      rect(size*trigger[trigcount].x+size*0.1,
       size*trigger[trigcount].y+size*0.1,
       size*0.8,
       size*0.8)
      
      fill(255,0,0)
      rect(size*trigger[trigcount].x+size*0.2,
       size*trigger[trigcount].y+size*0.2,
       size*0.6,
       size*0.6)
    } else if(trigger[trigcount].Fx==1){
      fill(0,255,0)
      rect(size*trigger[trigcount].x,
       size*trigger[trigcount].y,
       size,
       size)
      fill(0)
      rect(size*trigger[trigcount].x+size*0.1,
       size*trigger[trigcount].y+size*0.1,
       size*0.8,
       size*0.8)
      fill(0,255,0)
      rect(size*trigger[trigcount].x+size*0.1,
       size*trigger[trigcount].y+size*0.4,
       size*0.8,
       size*0.2)
      rect(size*trigger[trigcount].x+size*0.4,
       size*trigger[trigcount].y+size*0.1,
       size*0.2,
       size*0.8)
    }
    
}


function Trigger(){
  
  for(let i = 0; i<trigger.length;i++){
    
    TriggerDraw(i)
    
    if(PlayerPos[0].x==trigger[i].x&& 
       PlayerPos[0].y==trigger[i].y){
      playerInTrigger=true;
      trigger[i].InTrigger=true;
      
     }else{
      playerInTrigger=false;
      trigger[i].InTrigger=false;
    }
    
    
    if(trigger[i].PrevInTrigger==false&&trigger[i].InTrigger==true){
      trigger[i].OnEntry=true
      trigger[i].OnExit=false
      print("player entered trigger "+i)
    }else if(trigger[i].PrevInTrigger==true&&trigger[i].InTrigger==false){
      trigger[i].OnEntry=false
      trigger[i].OnExit=true
      print("player exit trigger "+i)
    }else{
      trigger[i].OnEntry=false
      trigger[i].OnExit=false
    }
    
    if (trigger[i].OnEntry==true){
      if(trigger[i].Fx==0){
        KillAll()
        print("giving player funct 0: kill all")
        
      }
      else if(trigger[i].Fx==1){
        lifeBoostTime = 3
        PlayerStatsManager()
        life=Math.max((maxLife-life),0)+life
        print("giving player funct 1: max life boost for 3 levels")
        print("maxlife:"+maxLife+", lifeboost time"+lifeBoostTime)
        print(Math.max((maxLife-life),0))
      }
      
    }else if(trigger[i].OnExit==true){
      
    }
    
    
    if(debugMode==true){
      fill(255)
      stroke(0)
      textSize(10)
      text("x:"+trigger[i].x+",y:"+trigger[i].y+",\nR:"+trigger[i].R+",G:"+trigger[i].G+",B:"+trigger[i].B+",\nFx:"+trigger[i].Fx+", InTrigger:"+trigger[i].InTrigger+"\nPrevInTrigger:"+trigger[i].PrevInTrigger+"\nOnEntry:"+trigger[i].OnEntry+"\nOnExit:"+trigger[i].OnExit,(trigger[i].x+1)*size,trigger[i].y*size)
    }
    
    trigger[i].PrevInTrigger=trigger[i].InTrigger
  }
  
  
}






function CharacterAppear(){
  if (moving==true){
    if(isMoveValid==false){
      noFill()
      stroke(255,0,0)
    }
    else{
      fill(255,255,255,50)
    }
    
    rect(size*PlayerPrepareBox[0].x,
      size*PlayerPrepareBox[0].y,
      size,
      size)
  //prepare box
  }
  fill(0,255,0)
  ellipse(size*(PlayerPos[0].x+0.5),
         size*(PlayerPos[0].y+0.5),
         size)
}





function keyPressed(){
  
  if(key === 'w'){
    
    moving=true
    PlayerPrepareBox=[
    {x:PlayerPos[0].x,y:PlayerPos[0].y-1}
    ]
    
    
  }
  if(key === 'a'){
    moving=true
    PlayerPrepareBox=[
      {x:PlayerPos[0].x-1,y:PlayerPos[0].y}
    ]
  }
  if(key === 's'){
    moving=true
    PlayerPrepareBox=[
      {x:PlayerPos[0].x,y:PlayerPos[0].y+1}
    ]
  }
  if(key === 'd'){
    moving=true
    PlayerPrepareBox=[
      {x:PlayerPos[0].x+1,y:PlayerPos[0].y}
    ]
  }
  
  //if(debugMode==true){
    if(key ==='r'){
      Reload()
      print("win!")
    }
    
  //}
  playerMoveCheck()
}






function keyReleased(){
  
  PlayerMove()
  
}


function PlayerStatsManager(){
  if(lifeBoostTime>0){
    maxLife = 5
    print("lifeboost activated,max life: "+maxLife)
  } else{
    maxLife = 3
  }
}


function PlayerMove(){
  moving=false
  if(isMoveValid==true){
    PlayerPos=[
      {x:PlayerPrepareBox[0].x,
      y:PlayerPrepareBox[0].y}
    ]
  }
  else{
    PlayerPos=[{x:SpawnPoint[0].x,y:SpawnPoint[0].y}]
    redScreenSecLeft=1;
    life=maxLife
  }
  
}





function playerMoveCheck(){
  isMoveValid=false;
  for (let i = 0; i<levelCollider.length;i++){
    if(levelCollider[i].x==PlayerPrepareBox[0].x
       &&levelCollider[i].y==PlayerPrepareBox[0].y){
       isMoveValid=true
       }
  }
}





function DebugGeneral(){
  if (debugMode==true){
    for (let a = 0; a<25; a++){
      for (let b = 0 ; b<25; b++){
        noFill()
        stroke(0,0,0,25)
        rect(a*size,b*size, size,size)
        textSize(15)
        text(a+","+b,a*size,b*size+30)
      }
        
    }
  }
}





function Enemy(){
  let canMove = false
  let eMoveX
  let eMoveY
  
    if (frameCount%30==0){
      EnemyMove(canMove,eMoveX,eMoveY)
      
    }
    
  EnemyAppear()
  EnemyKill()
}




function EnemyMove() {
  for (let ep = 0; ep < enemyPos.length; ep++) {
    
     eMoveX = floor(random(-1, 2));
     eMoveY = floor(random(-1, 2));

     newX = enemyPos[ep].x + eMoveX;
     newY = enemyPos[ep].y + eMoveY;

    
    let canMove = false;
    for (let aa = 0; aa < levelCollider.length; aa++) {
      if (levelCollider[aa].x === newX && levelCollider[aa].y === newY&&levelCollider[aa].tag!="safe"&&levelCollider[aa].tag!="walkway"&&levelCollider[aa].tag!="entrance"&&levelCollider[aa].tag != "exit" ) {
        canMove = true;
        break; 
      }
    }

    if (canMove) {
      enemyPos[ep] = { x: newX, y: newY, tag: enemyPos[ep].tag };
    }
    
  }
}





function SpawnEnemy(Eamount){
  let randomEnemyAmount = floor(random(1, Eamount+0.9));
  let prevR = -Infinity;

  while(enemyPos.length < randomEnemyAmount){
    let r = int(random(0, levelCollider.length));

    if (levelCollider[r].tag != "entrance" &&
        levelCollider[r].tag != "walkway" &&
        levelCollider[r].tag != "safe" &&
        levelCollider[r].tag != "exit" &&
        prevR != r) {

      enemyPos.push({
        x: levelCollider[r].x,
        y: levelCollider[r].y,
        tag: "tagg"
      });
      prevR = r;
    }
  }
  return enemyPos;
}



function EnemyAppear(){
  fill(255,0,0)
  stroke(255)
  for (let e = 0; e<enemyPos.length; e++){
    
    beginShape()
    vertex(size*(enemyPos[e].x+0.5),size*(enemyPos[e].y))
    vertex(size*(enemyPos[e].x),size*(enemyPos[e].y+1))
    vertex(size*(enemyPos[e].x+1),size*(enemyPos[e].y+1))
    endShape(CLOSE)
  }
  
}



function EnemyKill(){
  for (let PEC = 0; PEC<enemyPos.length; PEC++){
    if (PlayerPos[0].x==enemyPos[PEC].x&&
       PlayerPos[0].y==enemyPos[PEC].y){
      life--;
      if(life==0){
        PlayerPos=[{x:SpawnPoint[0].x,y:SpawnPoint[0].y}]
        life=maxLife;
      }
      
      redScreenSecLeft=1;
      enemyPos.splice(PEC, 1); 
      enemyKilled++
    }
      
    //kill enemy
  }
}

function KillAll(){
  
  enemyKilled+=enemyPos.length
  enemyPos=[]
  
}


function redScreen(secLeft){
  
  if (secLeft>0){
    fill(255,0,0,75)
    rect(0,0,2000,2000)
    print(secLeft)
    if (frameCount%30==0){
      redScreenSecLeft--;
    }
  }else{
    
  }
  
}




function startTimer() {
  timer = setInterval(() => {
    timeBas++;
    
  }, 1000); 
  
}

