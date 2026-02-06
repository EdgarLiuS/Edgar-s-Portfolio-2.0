
let base;
let baseCol;
let baseR;
let baseG;
let baseB;
let strokeCol;
let baseType;
let eye;
let mouth;
let hand;
let hat;
let glass;
let randNum;
let fillR=0;
let fillG=0;
let fillB=0;
let StrokeR=0;
let StrokeG=0;
let StrokeB=0;
let BackgroundR=0;
let BackgroundG=0;
let BackgroundB=0;

function setup() {
  createCanvas(400, 400);
  runFaceGenerator()
  
  
}

function draw() {
  
}


function mouseClicked(){
  runFaceGenerator()
}

function runFaceGenerator(){
  randNum=round(random(0,7));
  
  fillR=random(0,255);
  fillG=random(0,255);
  fillB=random(0,255);
  if (fillR>50&&fillR<125){
    fillR=fillR*0.4
  }else if(fillR>125){
    fillR=fillR*0.4+200
  }
  if (fillG>50&&fillG<125){
    fillG=fillG*0.4
  }else if(fillG>125){
    fillG=fillG*0.4+200
  }
  if (fillB<125){
    fillB=fillB*0.4
  }else if(fillB>125){
    fillB=fillB*0.4+200
  }
  //remap(x)=（x-IMin)/(IMax-IMin)*(FMax-FMin)+Fmin
  
  
  BackgroundR=255-fillR
  BackgroundG=255-fillG
  BackgroundB=fillB
  
  background(BackgroundR,BackgroundG,BackgroundB);
  
  
  StrokeR=fillR
  StrokeG=255-fillG
  StrokeB=255-fillB
  
  strokeWeight(5);
  console.log("randNum:"+randNum+", fillR:"+fillR+", fillG:"+fillG+", fillB:"+fillB)
  
  
  doAGrid(100,40,fillR,fillG,fillB,StrokeR,StrokeG,StrokeB);
  
  
  
  randomFaceGen(200,200)
}

function randomFaceGen(x,y){
  
  strokeWeight(5);
  //faceColor
  baseCol=round(random(0,4));
  
  if(baseCol == 0){
    
    baseR=255
    baseG=1
    baseB=1
    strokeCol=255;
    //red face
    
  } else if(baseCol ==1 ){
    
    baseR=245
    baseG=188
    baseB=2
    strokeCol=0;
    //yellow
  } else if(baseCol ==2){ 
    
    baseR=122
    baseG=178
    baseB=208
    strokeCol=255;
    //blue
    
  } else {
    
    baseR=157
    baseG=157
    baseB=157
    strokeCol=0;
    //grey
    
  }
  
  stroke(strokeCol);
  fill(baseR,baseG,baseB)
  base = random(150,250);
  baseType=round(random(0,2));
  
  //faceShape
  
  if(baseType == 0){
    
    ellipse(x,y,base);
  } else if(baseType == 1){
    rect(x-base/2, y-base/2, base, base,baseCol*20);
    
  } else{
    
    triangle(x-base*0.6,y-base*0.3,x+base*0.6,y-base*0.3,x,y+base*0.7)
    
  }
  
  console.log("Face type-"+baseType+" generated with size of "+base)
  
  //eye
  eye=round(random(0,2));
  fill(strokeCol)
  if(eye == 0){
    
    ellipse(x-base*0.25,y-base*0.1,base/5);
    ellipse(x+base*0.25,y-base*0.1,base/5);
    fill(255-strokeCol)
    //round eye
    
    if(baseCol==0||baseCol==2){
      //prevent black highlight
    } else{

      ellipse(x-base*0.25,y-base*0.15,base/10);
      ellipse(x+base*0.25,y-base*0.15,base/10);
      //highlight
      
    }
  } else if (eye ==1){
    
    rect(x-base*0.4,y-base*0.1,base*0.25,base*0.05)
    rect(x+base*0.15,y-base*0.1,base*0.25,base*0.05)
    //--eye
    
  } else{
    
    strokeWeight(10);
    line(x-base*0.4,y-base*0.2,x-base*0.2,y-base*0.1)
    line(x-base*0.4,y,x-base*0.2,y-base*0.1)
    line(x+base*0.4,y-base*0.2,x+base*0.2,y-base*0.1)
    line(x+base*0.4,y,x+base*0.2,y-base*0.1)
    //><eye
    
  }
  
  console.log("Eye type-"+eye+" generated.");
  
  //mouth
  mouth=round(random(0,2));
  noFill();
  strokeWeight(10);
  
  if(mouth==0){
    
    arc(x,y+base/10,base/2,base/2, 0, PI)
    //happy mouth
    
  } else if(mouth ==1){
    
    rect(x-base*0.2,y+base*0.1,base*0.4,base*0.2)
    //口mouth
    
  } else {
    
    arc(x,y+base*0.3,base/2,base/2, PI, 0)
    //unhappy mouth
    
  }
  console.log("Mouth type-"+mouth+" generated.");
  
  
  //hat
  noFill();
  
  hat=round(random(0,4));
  strokeWeight(10);
  if(hat==0){
    
    stroke(240,0,0)
    arc(x+base*0.3,y-base*0.6,base*0.3,base*0.3, 0, PI*2/3)
    arc(x+base*0.3,y-base*0.2,base*0.3,base*0.3, -PI*2/3, 0)
    arc(x+base*0.65,y-base*0.4,base*0.3,base*0.3, PI*2/3, -PI*2/3)
    //angry!!
    
  } else if(hat==1){
    fill(3,196,255)
    strokeWeight(8);
    arc(x+base*0.4,y-base*0.45,base*0.3,base*0.3, 0, PI)
    
    noStroke();
    
    triangle(x+base*0.55,y-base*0.45,x+base*0.4,y-base*0.8,x+base*0.25,y-base*0.45)
    noFill();
    stroke(strokeCol);
    
    
    line(x+base*0.55,y-base*0.45,x+base*0.4,y-base*0.8)
    line(x+base*0.25,y-base*0.45,x+base*0.4,y-base*0.8)
    strokeWeight(10);
    //sweat
  } else {
    
  }
  console.log("Extras type-"+hat+" generated.");
  
  //hand
  
  fill(baseR,baseG,baseB);
  stroke(strokeCol);
  hand=round(random(0,6));
  strokeWeight(5);
  if(hand==0){
    if(hat!==1 && hat!==0){
      
    
      beginShape();
      vertex(x-base*0.5,y+base*0.3)
      vertex(x-base*0.65,y+base*0.15)
      vertex(x-base*0.65,y+base*0.3)
      vertex(x-base*0.8,y+base*0.3)
    
      vertex(x-base*0.8,y+base*0.45)
      vertex(x-base*0.75,y+base*0.6)
    
      vertex(x-base*0.5,y+base*0.6)
      endShape(CLOSE);
      //thumb
    }
  } else if(hand==1){
    
    beginShape();
    vertex(x-base*0.5,y+base*0.3)
    
    vertex(x-base*0.75,y+base*0.3)
    
    vertex(x-base*0.85,y+base*0.45)
    vertex(x-base*0.85,y+base*0.6)
    vertex(x-base*0.65,y+base*0.6)
    vertex(x-base*0.65,y+base*0.75)
    
    vertex(x-base*0.5,y+base*0.6)
    
    endShape(CLOSE);
    //thumbRev
  }else if(hand==2){
    beginShape();
    vertex(x-base*0.55,y+base*0.1)
    vertex(x-base*0.65,y+base*0.1)
    vertex(x-base*0.65,y+base*0.3)
    
    
    vertex(x-base*0.85,y+base*0.3)
    
    vertex(x-base*0.85,y+base*0.6)
    
    vertex(x-base*0.55,y+base*0.6)
    
    vertex(x-base*0.55,y+base*0.5)
    
    //point up
    endShape(CLOSE);
    
  }else if(hand==3){
    beginShape();
    vertex(x-base*0.6,y+base*0.29)
    vertex(x-base*0.6,y+base*0.24)
    vertex(x-base*0.75,y+base*0.24)
    vertex(x-base*0.75,y+base*0.29)
    endShape(CLOSE);
    beginShape();
    vertex(x-base*0.5,y+base*0.3)
    
    vertex(x-base*0.8,y+base*0.3)
    
    vertex(x-base*0.8,y+base*0.6)
    
    vertex(x-base*0.5,y+base*0.6)
    endShape(CLOSE);
    
    
    beginShape();
    vertex(x+base*0.6,y+base*0.29)
    vertex(x+base*0.6,y+base*0.24)
    vertex(x+base*0.75,y+base*0.24)
    vertex(x+base*0.75,y+base*0.29)
    endShape(CLOSE);
    beginShape();
    vertex(x+base*0.5,y+base*0.3)
    
    vertex(x+base*0.8,y+base*0.3)
    
    vertex(x+base*0.8,y+base*0.6)
    
    vertex(x+base*0.5,y+base*0.6)
    endShape(CLOSE);
    //fist
  }
  console.log("Hand type-"+hand+" generated.");
}

function doAGrid(amount,blockW,fillR,fillG,fillB,StrokeR,StrokeG,StrokeB){
  for (let a = 0; a < amount; a += 1) {
    fill(fillR,fillG,fillB);
    stroke(StrokeR,StrokeG,StrokeB);
    
    for (let b = 0; b < amount; b += 1) {
      square(blockW*2*a,blockW*2*b,blockW);
      square(blockW*2*a+blockW,blockW*2*b+blockW,blockW);
    }
  }
}
