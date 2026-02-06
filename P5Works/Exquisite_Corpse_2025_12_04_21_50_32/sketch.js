let menuStat=false;
let clampStat=false;
let linesStats=true;
let clampValue=10;
let wid=600;
let leng=600;
let clicks = [];//array
let clicksCount = 0
let prevX;
let prevY;
let CenterX;
let CenterY;

function setup() {
  createCanvas(wid, leng);
  
  //framerate
  let button = createButton('Debug Console');
  button.position(0, 0);
  button.mousePressed(menuOpen);
  let button1 = createButton('XYClamp');
  button1.position(107, 0);
  button1.mousePressed(clamp);
  let button2 = createButton('Lines');
  button2.position(178, 0);
  button2.mousePressed(lines);
  ColorHelper=createColorPicker('ColorHelper');
  
  
}

function draw() {
  clear(); 
  blendMode(BLEND)
  background(220);
  beginShape(); 
  fill(0)
  stroke(255)
  strokeWeight(2)
  doAHead(256,125)
  doALeg(258,350)
  doABody(259,249)
  
  debugConsole();
  
  
  
}

function debugConsole(){
  
  
  let fps=frameRate();
  if (menuStat) {
      strokeWeight(1)
      doAGrid();
      CursorShow()
      menuPosY=30;
      menuPosX=5;
      //Debug Console v0.0.0.0.1
      testcolor = color(90, 0, 20)
      blendMode(BLEND)
      textSize(10)
      fill(0,0,0)
      stroke(0,0,0);
      textFont('Courier New');
      text("Edgar's debug console", 5, menuPosY);
      text("Version v0.0.2", 5, menuPosY+10);
      text("MenuStat="+menuStat,5, menuPosY+20)
      fps=Math.floor(fps / 1);
      text("Frame="+frameCount+", fps="+fps,5,menuPosY+30);
      time=(Math.floor(frameCount/fps*10))/10;
      text("Time="+time+"s",5,menuPosY+40);
      mouseColor = get(mouseX, mouseY);
      text("Performance:"+Math.floor(fps/0.6)+"%",5,menuPosY+50);
      mouseColor = get(mouseX, mouseY);
      fill(mouseColor);
      square(menuPosX,menuPosY+55,40);
      fill(testcolor);
      square(menuPosX+45,menuPosY+55,40);
      fill(0,0,0)
    
      
      
      beginShape();
      //click coordinate
      for (let clickCoord of clicks) {
        fill(0)
        stroke(0)
        text("("+clickCoord.x+","+clickCoord.y+")", clickCoord.x, clickCoord.y);
        
        
        
        vertex(clickCoord.x,clickCoord.y)
        
        stroke(0,255,0);
        line(clickCoord.x,clickCoord.y,prevX, prevY);
        stroke(255,255,0);
        line(clickCoord.x,clickCoord.y,mouseX, mouseY);
        stroke(0);
        fill(0);
        square(clickCoord.x, clickCoord.y, 5);
        prevX=clickCoord.x;
        prevY=clickCoord.y;
        fill(0,100,100,100)
        
      }
      
      endShape(CLOSE);
      //export shape
      text(clicksCount+" points generated",5,220)
    
      
      
      //RGB
      let r = (mouseColor[0]).toFixed(2);
      let g = (mouseColor[1]).toFixed(2);
      let b = (mouseColor[2]).toFixed(2);
      text("RGB:(" + r + ", " + g +", "+b+ ")", 5, menuPosY+105);
      text("MousePos:(" + mouseX + ", " + mouseY + ")", 5, menuPosY+115);
      text("Mouse ClampStat:"+clampStat, 5,menuPosY+125)
    
      text("Mouse ClampValue:"+clampValue, 5,menuPosY+135)
    
      text("LineStats:"+linesStats, 5,menuPosY+145)
    
    
      ColorHelper.position(5, menuPosY+150);
      strokeWeight(0)
      let CHelperValue = ColorHelper.value();
      text(CHelperValue, 60, menuPosY+160);
    
      if (clampStat) {
        mouseX = Math.floor(mouseX/clampValue);
        mouseX = mouseX*clampValue
        mouseY = Math.floor(mouseY/clampValue);
        mouseY =mouseY*clampValue
      } 
    
    
    fill(0,0,0)
    rect(0, mouseY, wid, 1)
        rect(mouseX, 0, 1, leng)
        text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
        fill(0,0,0,0)
        strokeWeight(0.5)
        square(mouseX-10,mouseY-10, 20)
        square(mouseX-20,mouseY-20, 40)
        text(mouseY, wid-20, mouseY+10);
        text(mouseX, mouseX-20, leng);
        strokeWeight(1)
        //advancedCursor
    
      if (linesStats) {
        blendMode(MULTIPLY)
        stroke(199, 199, 199)
        rect(wid/3, 0, 0.5,leng)
        rect(wid/3*2, 0, 0.5,leng)
        rect(0, leng/3, wid,0.5)
        rect(0, leng/3*2, wid,0.5)
        rect(wid/2, 0, 0.5,wid)
        rect(0, leng/2, wid,0.5)
        blendMode(BLEND)
      }
      CursorShow()
  } else {
    fps=Math.floor(fps / 1);
    text("fps:"+fps,0,30);
    
  }
  
  
  
}



function mousePressed() {
  
  clicks.push({ x: mouseX, y: mouseY });
  clicksCount++;

}


function menuOpen(){
  menuStat=!menuStat;
  ColorHelper.position(5, -50);
}
function clamp(){
  clampStat=!clampStat
}
function lines(){
  linesStats=!linesStats
}

function doAGrid(){
  for (let a = 0; a < 20; a += 1) {
    noStroke()
    fill(100,100,100,100);
    for (let b = 0; b < 20; b += 1) {
      square(100*a,100*b,50);
      square(100*a+50,100*b+50,50);
    }
  }
}

function keyPressed(){
  if (keyIsDown(69)==true){
        print("------------------------------------");
      
        print("  beginShape();")  
        for (let clickCoord of clicks) {
          
          
          FinalX=clickCoord.x-CenterX
          FinalY=clickCoord.y-CenterY
          print("  vertex("+FinalX+"+X,"+FinalY+"+Y)")
        }
        print("  endShape(CLOSE);")
      }
  //press E to export
  if(keyIsDown(67)==true){
    clamp()
    print("Clamp Initiated!")
  }
  //press C to initiate CoordClamp
  if(keyIsDown(80)==true){
      print(clicks);
      //press P to print the entire list
    }
  if(keyIsDown(17)==true){
    if(keyIsDown(90)==true){
      clicks.pop();
      //press Ctrl+Z to undo the vertex generated
    }
  }
  if(keyIsDown(75)==true){
    clicks = [];
    //press K to kill all the vertexes
  }
  
}
function CursorShow(){
  CenterX=wid/2
  CenterY=leng/2
  CenterX=256
  CenterY=125
  fill(100,0,0)
  text("("+CenterX+","+CenterY+")",CenterX+5,CenterY)
  square(CenterX-5,CenterY-5,10)
  //cursor helper
}








function doAHead(X,Y){
  fill(100)
   beginShape(); 
  vertex(-8+X,-3+Y) 
  vertex(-14+X,36+Y) 
  vertex(-25+X,51+Y) 
  vertex(-61+X,57+Y) 
  vertex(-29+X,91+Y) 
  vertex(63+X,90+Y) 
  vertex(62+X,50+Y) 
  vertex(31+X,51+Y) 
  vertex(15+X,34+Y) 
  vertex(16+X,0+Y) 
  endShape(CLOSE); 
  //neck
  fill(10)
  beginShape(); 
  vertex(-22+X,32+Y) 
  vertex(-26+X,45+Y) 
  vertex(-48+X,49+Y) 
  vertex(-28+X,89+Y) 
  vertex(6+X,85+Y) 
  vertex(-1+X,53+Y) 
  vertex(-13+X,49+Y) 
  endShape(CLOSE); 
  //neck armor left
   beginShape(); 
  vertex(22+X,35+Y) 
  vertex(27+X,50+Y) 
  vertex(16+X,54+Y) 
  vertex(23+X,88+Y) 
  vertex(49+X,87+Y) 
  vertex(53+X,47+Y) 
  vertex(36+X,49+Y) 
  endShape(CLOSE);
  //neckarmor right
  beginShape(); 
  vertex(55+X,27+Y) 
  vertex(76+X,28+Y) 
  vertex(95+X,60+Y) 
  vertex(64+X,103+Y) 
  vertex(50+X,86+Y) 
  endShape(CLOSE); 
  //neckarmor right extra
  fill(10)
  beginShape(); 
  vertex(-24+X,-25+Y) 
  vertex(-14+X,-3+Y) 
  vertex(2+X,0+Y) 
  vertex(7+X,20+Y) 
  vertex(18+X,29+Y) 
  vertex(36+X,20+Y) 
  vertex(43+X,-19+Y) 
  vertex(23+X,-32+Y) 
  vertex(1+X,-34+Y) 
  endShape(CLOSE); 
  //head
  fill(100)
   beginShape(); 
  vertex(15+X,-14+Y) 
  vertex(30+X,-14+Y) 
  vertex(23+X,-7+Y) 
  endShape(CLOSE); 
  //eye
}
function doABody(X,Y){
  fill(100)
  beginShape(); 
  vertex(83+X,-23+Y) 
  vertex(92+X,8+Y) 
  vertex(88+X,29+Y) 
  vertex(100+X,67+Y) 
  vertex(79+X,73+Y) 
  vertex(63+X,16+Y) 
  vertex(66+X,-18+Y) 
  endShape(CLOSE); 
  //right upper arm
  fill(10)
  beginShape(); 
  vertex(62+X,-70+Y) 
  vertex(81+X,-61+Y) 
  vertex(94+X,-28+Y) 
  vertex(72+X,-6+Y) 
  vertex(37+X,-19+Y) 
  vertex(61+X,-31+Y) 
  endShape(CLOSE); 
  //right shoulder
  fill(10)
  beginShape(); 
  vertex(110+X,36+Y) 
  vertex(88+X,61+Y) 
  vertex(58+X,70+Y) 
  vertex(68+X,80+Y) 
  vertex(151+X,65+Y) 
  vertex(218+X,35+Y) 
  vertex(213+X,16+Y) 
  endShape(CLOSE); 
  //right lower arm
  fill(100)
  beginShape(); 
  vertex(182+X,-39+Y) 
  vertex(182+X,-4+Y) 
  vertex(189+X,7+Y) 
  vertex(207+X,7+Y) 
  vertex(216+X,-11+Y) 
  vertex(215+X,-53+Y) 
  endShape(CLOSE); 
  //weapon 2
  fill(10)
  beginShape(); 
  vertex(170+X,-19+Y) 
  vertex(171+X,-5+Y) 
  vertex(234+X,-24+Y) 
  vertex(236+X,-30+Y) 
  vertex(278+X,-41+Y) 
  vertex(278+X,-47+Y) 
  endShape(CLOSE);
  //weapon3
  fill(100)
  beginShape(); 
  vertex(207+X,1+Y) 
  vertex(211+X,-6+Y) 
  vertex(235+X,9+Y) 
  vertex(234+X,77+Y) 
  vertex(202+X,92+Y) 
  vertex(202+X,81+Y) 
  vertex(224+X,70+Y) 
  vertex(224+X,14+Y) 
  endShape(CLOSE); 
  //weapon handle
  fill(100)
   beginShape(); 
  vertex(193+X,4+Y) 
  vertex(192+X,349+Y) 
  vertex(204+X,349+Y) 
  vertex(204+X,2+Y) 
  endShape(CLOSE); 
  //weaponbody
  fill(10)
  beginShape(); 
  vertex(189+X,247+Y) 
  vertex(254+X,219+Y) 
  vertex(247+X,235+Y) 
  vertex(218+X,245+Y) 
  vertex(216+X,353+Y) 
  vertex(188+X,354+Y) 
  endShape(CLOSE); 
  //weapon lower
   beginShape(); 
  vertex(196+X,-187+Y) 
  vertex(198+X,-103+Y) 
  vertex(209+X,-91+Y) 
  vertex(211+X,-73+Y) 
  vertex(177+X,-61+Y) 
  vertex(178+X,-87+Y) 
  vertex(186+X,-97+Y) 
  vertex(188+X,-143+Y) 
  vertex(174+X,-127+Y) 
  vertex(174+X,-108+Y) 
  vertex(144+X,-83+Y) 
  vertex(146+X,-33+Y) 
  vertex(166+X,-44+Y) 
  vertex(179+X,-35+Y) 
  vertex(220+X,-49+Y) 
  vertex(223+X,-65+Y) 
  vertex(246+X,-75+Y) 
  vertex(244+X,-135+Y) 
  vertex(225+X,-150+Y) 
  vertex(222+X,-237+Y) 
  endShape(CLOSE); 
  //weapon head
  fill(100)
  beginShape(); 
  vertex(175+X,23+Y) 
  vertex(186+X,13+Y) 
  vertex(214+X,12+Y) 
  vertex(216+X,47+Y) 
  vertex(190+X,47+Y) 
  vertex(180+X,39+Y) 
  endShape(CLOSE); 
  //right fist
  fill(10)
  beginShape(); 
  vertex(40+X,25+Y) 
  vertex(45+X,56+Y) 
  vertex(32+X,65+Y) 
  vertex(-32+X,68+Y) 
  vertex(-48+X,67+Y) 
  vertex(-34+X,40+Y) 
  vertex(-42+X,28+Y) 
  vertex(-30+X,17+Y) 
  endShape(CLOSE); 
  //lowerlowerchest
  fill(10)
  beginShape(); 
  vertex(46+X,11+Y) 
  vertex(44+X,29+Y) 
  vertex(-35+X,33+Y) 
  vertex(-46+X,18+Y) 
  vertex(-36+X,-3+Y) 
  vertex(42+X,-8+Y) 
  endShape(CLOSE); 
  //lower chest
  fill(10)
  beginShape(); 
  vertex(56+X,-32+Y) 
  vertex(61+X,-3+Y) 
  vertex(49+X,14+Y) 
  vertex(32+X,14+Y) 
  vertex(26+X,3+Y) 
  vertex(-6+X,1+Y) 
  vertex(-15+X,15+Y) 
  vertex(-33+X,13+Y) 
  vertex(-52+X,-4+Y) 
  vertex(-55+X,-31+Y) 
  endShape(CLOSE); 
  //chest
  
  fill(100)
  beginShape(); 
  vertex(-66+X,153+Y) 
  vertex(-64+X,145+Y) 
  vertex(-75+X,139+Y) 
  vertex(-73+X,129+Y) 
  vertex(-52+X,144+Y) 
  vertex(-62+X,169+Y) 
  vertex(-85+X,161+Y) 
  vertex(-86+X,141+Y) 
  endShape(CLOSE); 
  //left fist
  fill(100)
   beginShape(); 
  vertex(-87+X,-2+Y) 
  vertex(-99+X,58+Y) 
  vertex(-94+X,95+Y) 
  vertex(-72+X,80+Y) 
  vertex(-74+X,39+Y) 
  vertex(-66+X,29+Y) 
  vertex(-65+X,-17+Y) 
  endShape(CLOSE); 
  //left upper arm
  fill(10)
  beginShape(); 
  vertex(-52+X,-73+Y) 
  vertex(-65+X,-83+Y) 
  vertex(-68+X,-169+Y) 
  vertex(-89+X,-169+Y) 
  vertex(-85+X,-78+Y) 
  vertex(-110+X,-39+Y) 
  vertex(-164+X,86+Y) 
  vertex(-161+X,115+Y) 
  vertex(-147+X,125+Y) 
  vertex(-97+X,4+Y) 
  vertex(-59+X,-4+Y) 
  vertex(-32+X,-28+Y) 
  endShape(CLOSE);
  //left shoulder
  fill(100)
  beginShape(); 
  vertex(-80+X,-143+Y) 
  vertex(-78+X,-101+Y) 
  vertex(-84+X,-88+Y) 
  vertex(-115+X,-87+Y) 
  vertex(-150+X,-8+Y) 
  vertex(-149+X,-41+Y) 
  vertex(-108+X,-129+Y) 
  vertex(-92+X,-147+Y) 
  endShape(CLOSE);
  //shoulder asset
  fill(10)
   beginShape(); 
  vertex(-103+X,29+Y) 
  vertex(-104+X,89+Y) 
  vertex(-91+X,177+Y) 
  vertex(-71+X,175+Y) 
  vertex(-66+X,62+Y) 
  vertex(-76+X,74+Y) 
  vertex(-92+X,76+Y) 
  vertex(-95+X,35+Y) 
  endShape(CLOSE); 
  //left lower arm
  
  
}
function doALeg(X,Y){
  fill(100)
  beginShape(); 
  vertex(-77+X,143+Y) 
  vertex(-43+X,203+Y) 
  vertex(-3+X,80+Y) 
  vertex(1+X,-34+Y) 
  vertex(-39+X,-32+Y) 
  endShape(CLOSE); 
  //waist cape left
  fill(100)
  beginShape(); 
  vertex(12+X,-10+Y) 
  vertex(3+X,196+Y) 
  vertex(54+X,159+Y) 
  vertex(71+X,57+Y) 
  vertex(47+X,-36+Y) 
  endShape(CLOSE); 
  //waist cape right
  fill(100)
  beginShape(); 
  vertex(5+X,-8+Y) 
  vertex(-3+X,126+Y) 
  vertex(-37+X,140+Y) 
  vertex(-41+X,62+Y) 
  vertex(-31+X,-16+Y) 
  endShape(CLOSE);
  //left upper leg
  fill(100)
  beginShape(); 
  vertex(17+X,-12+Y) 
  vertex(13+X,70+Y) 
  vertex(17+X,130+Y) 
  vertex(49+X,128+Y) 
  vertex(59+X,33+Y) 
  vertex(40+X,-28+Y) 
  endShape(CLOSE); 
  //right upper leg
  fill(10)
   beginShape(); 
  vertex(-42+X,-42+Y) 
  vertex(-23+X,-33+Y) 
  vertex(29+X,-33+Y) 
  vertex(47+X,-46+Y) 
  vertex(52+X,-26+Y) 
  vertex(20+X,-6+Y) 
  vertex(-20+X,-8+Y) 
  vertex(-52+X,-22+Y) 
  endShape(CLOSE); 
  //waist
  fill(10)
  beginShape(); 
  vertex(-3+X,75+Y) 
  vertex(11+X,127+Y) 
  vertex(-3+X,250+Y) 
  vertex(-42+X,253+Y) 
  vertex(-47+X,141+Y) 
  vertex(-24+X,124+Y) 
  vertex(-19+X,75+Y) 
  endShape(CLOSE); 
  //left lower leg
  
  beginShape(); 
  vertex(34+X,74+Y) 
  vertex(50+X,73+Y) 
  vertex(67+X,129+Y) 
  vertex(53+X,256+Y) 
  vertex(21+X,257+Y) 
  vertex(14+X,136+Y) 
  vertex(29+X,120+Y) 
  endShape(CLOSE);
  //right lower leg
  fill(100)
  beginShape(); 
  vertex(-41+X,-37+Y) 
  vertex(-25+X,-42+Y) 
  vertex(-8+X,-29+Y) 
  vertex(-21+X,57+Y) 
  vertex(-45+X,80+Y) 
  vertex(-77+X,198+Y) 
  vertex(-85+X,161+Y) 
  vertex(-68+X,86+Y) 
  vertex(-66+X,62+Y) 
  vertex(-47+X,-23+Y) 
  endShape(CLOSE); 
  //waist armor left
  fill(100)
  beginShape(); 
  vertex(45+X,-40+Y) 
  vertex(30+X,-30+Y) 
  vertex(43+X,51+Y) 
  vertex(57+X,62+Y) 
  vertex(55+X,82+Y) 
  vertex(59+X,98+Y) 
  vertex(75+X,42+Y) 
  endShape(CLOSE); 
  //waist armor right
}

