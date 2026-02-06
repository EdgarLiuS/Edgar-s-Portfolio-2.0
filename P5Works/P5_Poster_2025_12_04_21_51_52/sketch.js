
function setup() {
  createCanvas(400, 600);
}

function draw() {
  background(220);

  circle(100,150,150);
  fill(255, 255, 255);
  circle(100,100,30);
  fill(0,0,0);
  
  circle(300,150,120);
  fill(255, 255, 255);
  circle(300,120,30);
  fill(0,0,0);
  
  trigX=150
  trigY=225
  teethWid=12.5
  teethLeng=50
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25

  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25

  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);

  
  trigX=150-12.5
  trigY=350
  teethLeng=-teethLeng
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  trigX=trigX+25
  triangle(trigX, trigY, trigX+teethWid, trigY+teethLeng, trigX+2*teethWid, trigY);
  
  textSize(30)
  text("BABYVAMPIRE.CO", 70,500);
  textFont('Courier New');
  
  textSize(10)
  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
}