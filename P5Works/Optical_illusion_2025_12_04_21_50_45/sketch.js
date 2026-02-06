let Wid=400;
let Leng=400;


function setup() {
  createCanvas(Wid, Leng);
  background(0);
  DoAIllusion(Wid*0.5,Leng*0.5,Wid,Leng,0.8);
}

function draw() {
  
}


function DoAIllusion(CentX,CentY,WidI,LengI,Scale){
  noStroke();
  for (let i = 1; i<100;i+=1){
    push(); 
    translate(CentX, CentY); 
    rotate((i-1)*PI*0.02);
    scale(pow(0.945, i));
    
    if(i%2===0){
    
      fill(0);
      
    }
    else{
      
      fill(255);
    
    }
    //fill(255)
    rect(-CentX*Scale, -CentY*Scale, WidI*Scale, LengI*Scale); 
    for (let q = 0; q<8;q+=1){
      for (let p = 0; p<8;p+=1){
        if(i%2===0){
    
          fill(255);
      
        }
          else{
      
          fill(0);
    
        }
        //fill(0)
        rect(-CentX * Scale + WidI * Scale / 8 * p , -CentY * Scale + LengI * Scale / 8 * q, WidI * Scale / 16 , LengI * Scale / 16)
        rect(-CentX * Scale + WidI * Scale / 16 + WidI * Scale / 8 * p , -CentY * Scale + LengI * Scale / 16 + LengI * Scale / 8 * q, WidI * Scale / 16 , LengI * Scale / 16)
      }
    }
    pop();
  }
}