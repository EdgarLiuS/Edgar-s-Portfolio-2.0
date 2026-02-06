let canvasX;
let canvasY;
let PHue,SHue,THue;
let hr,minut,sec;
let secondX,secondY
let hour12;
let timeC=0;
function setup() {
  canvasX=600;
  canvasY=600;
  createCanvas(canvasX, canvasY);
  
  colorMode(HSB)
  
  
   

}

function draw() {
  if (mouseIsPressed === true) {
    
    
    if (sec >= 60){
      sec=sec-60
      if (minut >= 60){
        minut=minut-60
        if (hr >= 12){
          hr=hr-12
        }else{
          hr=hr+1
        }
        
      } else{
        minut=minut+1
      }
    } else {
      sec=sec+100
    }
    
    
  } else {
    hr=hour()
    minut=minute()
    sec=second()
  }
  
  //sec=27
  //hourTest=round(sec/60*12)
  
  background(220);
  print(hr+":"+minut+":"+sec+", hour12="+hour12);
  HHue = hr/60*359
  MHue = minut/60*359
  SHue = sec/60*359
  CHue= 0
  CSat= 0
  CBri= 75
  
  drawAClock(canvasX/2,canvasY/2,canvasX*0.8,canvasY*0.8,hr,minut,sec,CHue,CSat,CBri,HHue,MHue,SHue);
}


function drawAClock(PosX,PosY,Wid,Leng,hr,minut,sec,CH,CS,CB,HH,MH,SH){
  noStroke()
  fill(CH,CS,CB)
  square(PosX-Wid/2,PosY-Leng/2,Wid);
  
  
  secondHand(PosX,PosY,Wid,Leng,sec,SH,0,75)
  minuteHand(PosX,PosY,Wid,Leng,minut,sec,MH);
  
  
  blendMode(DIFFERENCE)
  hourHand(PosX,PosY,Wid,Leng,hr,minut,HH);
  secondHand(PosX,PosY,Wid,Leng,sec,SH,100,100)
  blendMode(BLEND)
  
  number(hr,minut,sec,PosX,PosY,Wid,Leng);
}

function secondHand(PosX,PosY,Wid,Leng,sec,SH,SSat,SBri){
  noFill();
  stroke(SH,SSat,SBri);
  strokeWeight(15);
  ellipse(PosX,PosY,Wid/60*sec,Leng/60*sec);
  ellipse(PosX,PosY,Wid/60*sec-Wid*0.15,Leng/60*sec-Leng*0.15);
  ellipse(PosX,PosY,Wid/60*sec-Wid*0.3,Leng/60*sec-Leng*0.3);
  
  //arc(PosX-Wid/2,PosY-Leng/2,Wid/60*sec,Leng/60*sec,0,PI/2)
  //arc(PosX+Wid/2,PosY+Leng/2,Wid/60*sec,Leng/60*sec,PI,-PI/2)
  //arc(PosX-Wid/2,PosY+Leng/2,Wid/60*sec,Leng/60*sec,-PI/2,0)
  //arc(PosX+Wid/2,PosY-Leng/2,Wid/60*sec,Leng/60*sec,PI/2,PI)
  
  //arc(PosX-Wid/2,PosY-Leng/2,Wid/60*sec-Wid*0.15,Leng/60*sec-Leng*0.15,0,PI/2)
  //arc(PosX+Wid/2,PosY+Leng/2,Wid/60*sec-Wid*0.15,Leng/60*sec-Leng*0.15,PI,-PI/2)
  //arc(PosX-Wid/2,PosY+Leng/2,Wid/60*sec-Wid*0.15,Leng/60*sec-Leng*0.15,-PI/2,0)
  //arc(PosX+Wid/2,PosY-Leng/2,Wid/60*sec-Wid*0.15,Leng/60*sec-Leng*0.15,PI/2,PI)
  
  //arc(PosX-Wid/2,PosY-Leng/2,Wid/60*sec-Wid*0.3,Leng/60*sec-Leng*0.3,0,PI/2)
  //arc(PosX+Wid/2,PosY+Leng/2,Wid/60*sec-Wid*0.3,Leng/60*sec-Leng*0.3,PI,-PI/2)
  //arc(PosX-Wid/2,PosY+Leng/2,Wid/60*sec-Wid*0.3,Leng/60*sec-Leng*0.3,-PI/2,0)
  //arc(PosX+Wid/2,PosY-Leng/2,Wid/60*sec-Wid*0.3,Leng/60*sec-Leng*0.3,PI/2,PI)
}

function minuteHand(PosX,PosY,Wid,Leng,minut,sec,MH){
  
  if(sec>0){
    stroke(MH,100,100);
  } else{
    stroke(0,0,100);
  }
  //shine when change
  
  strokeWeight(10);
  noFill();
  if(minut<7.5){
    MinuteX=PosX+minut*Wid/15
    MinuteY=PosY-Leng/2
  } else if(minut>7.5 && minut<22.5){
    MinuteX=PosX+Wid/2
    MinuteY=PosY-Leng/2+(minut-7.5)*Leng/15
  } else if(minut>22.5 && minut<37.5){
    MinuteX=PosX+Wid/2-(minut-22.5)*Wid/15
    MinuteY=PosY+Leng/2
  } else if(minut>37.5 && minut<52.5){
    MinuteX=PosX-Wid/2
    MinuteY=PosY+Leng/2-(minut-37.5)*Leng/15
  } else if(minut>52.5 && minut<60){
    MinuteX=PosX-Wid/2+(minut-52.5)*Wid/15
    MinuteY=PosY-Leng/2
  }
  
  beginShape();
  vertex(PosX-5,PosY-5);
  vertex(PosX-5,MinuteY-5);
  vertex(MinuteX-5,MinuteY-5);
  vertex(MinuteX-5,PosY-5);
  endShape(CLOSE);
  
  
  beginShape();
  vertex(PosX-5,PosY-5);
  vertex(PosX-5,PosY+(PosY-MinuteY)/2-5);
  vertex(PosX+(PosX-MinuteX)/2-5,PosY+(PosY-MinuteY)/2-5);
  vertex(PosX+(PosX-MinuteX)/2-5,PosY-5);
  endShape(CLOSE);
  
  if(sec>0){
    stroke(0,0,0);
  } else{
    stroke(0,0,100);
  }
  
  beginShape();
  vertex(PosX+5,PosY+5);
  vertex(PosX+5,MinuteY+5);
  vertex(MinuteX+5,MinuteY+5);
  vertex(MinuteX+5,PosY+5);
  endShape(CLOSE);
  
  
  beginShape();
  vertex(PosX+5,PosY+5);
  vertex(PosX+5,PosY+(PosY-MinuteY)/2+5);
  vertex(PosX+(PosX-MinuteX)/2+5,PosY+(PosY-MinuteY)/2+5);
  vertex(PosX+(PosX-MinuteX)/2+5,PosY+5);
  endShape(CLOSE);
  
  //line(PosX,PosY,secondX,secondY)
}

function hourHand(PosX,PosY,Wid,Leng,hr,minut,HH){
  fill(0,100,100)
  noStroke();
  if(hr>11){
    hour12=hr-12
  }else{
    hour12=hr
  }
  if(hour12<2){
    hrX=PosX+hour12*Wid/3
    hrY=PosY-Leng/2
    triangle(PosX-Wid/2,PosY+Leng/2,PosX+Wid/2,PosY+Leng/2,hrX,hrY);
    fill(0,100,100)
    square(hrX-Wid/40,hrY-Wid/40,Wid/20)
  } else if(hour12>=2 && hour12<5){
    hrX=PosX+Wid/2
    hrY=PosY-Leng/2+(hour12-1.5)*Leng/3
    triangle(PosX-Wid/2,PosY-Leng/2,PosX-Wid/2,PosY+Leng/2,hrX,hrY);
    fill(0,100,100)
    square(hrX-Wid/40,hrY-Wid/40,Wid/20)
  } else if(hour12>=5 && hour12<8){
    hrX=PosX+Wid/2-(hour12-4.5)*Leng/3
    hrY=PosY+Leng/2
    triangle(PosX-Wid/2,PosY-Leng/2,PosX+Wid/2,PosY-Leng/2,hrX,hrY);
    fill(0,100,100)
    square(hrX-Wid/40,hrY-Wid/40,Wid/20)
  } else if(hour12>=8 && hour12<11){
    hrX=PosX-Wid/2
    hrY=PosY+Leng/2-(hour12-7.5)*Leng/3
    triangle(PosX+Wid/2,PosY+Leng/2,PosX+Wid/2,PosY-Leng/2,hrX,hrY);
    fill(0,100,100)
    square(hrX-Wid/40,hrY-Wid/40,Wid/20)
  } else if(hour12>=11 && hour12<=12){
    hrX=PosX-Wid/2+(hour12-10.5)*Leng/3
    hrY=PosY-Leng/2
    triangle(PosX-Wid/2,PosY+Leng/2,PosX+Wid/2,PosY+Leng/2,hrX,hrY);
    fill(0,100,100)
    square(hrX-Wid/40,hrY-Wid/40,Wid/20)
  }
 
}
function number(hr,minut,sec,PosX,PosY,Wid,Leng){
  tSize=12
  textFont('Courier New');
  textSize(tSize);
  stroke(0,0,0)
  strokeWeight(1)
  text("Experiment Clock "+hr+":"+minut+":"+sec,PosX-Wid/2,PosY+Leng/2+tSize)
  
  text("Edgar Liu",PosX-Wid/2,PosY+Leng/2+tSize*2)
}