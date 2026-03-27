let video;
let canvas;
let handpose;
let predictions = [];
//game variables
let targetingPosition = [320, 240]; //center of the screen
let captureBoxImage;
let ufoImageTop;
let ufoImageBottom;
let ufoImageLeft;
let ufoImageRight;
let pg;

let isWin = false;//this is a BOOLEAN

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent("sketch-container");
  CamSetup();
  captureBoxImage = loadImage('../P5Works/UFOCameraGame/Assets/Camera.png'); //load the camera image for the capture box
  ufoImageTop = loadImage('../P5Works/UFOCameraGame/Assets/ufo_Top.png'); //load the UFO image
  ufoImageBottom = loadImage('../P5Works/UFOCameraGame/Assets/ufo_Bottom.png'); //load the UFO image
  ufoImageLeft = loadImage('../P5Works/UFOCameraGame/Assets/ufo_Left.png'); //load the UFO image
  ufoImageRight = loadImage('../P5Works/UFOCameraGame/Assets/ufo_Right.png'); //load the UFO image
  backgroundImage = loadImage('../P5Works/UFOCameraGame/Assets/milkyway.jpg'); //load the background image
  pg = createGraphics(170, 100);
}
 
 
function draw() {
    backgroundDraw();
    //Cam();
    //DrawHands(predictions);
    if(!isWin){
        Game();
        //pause the game when win condition is met, and display win screen
    }
    else{
        GameUI();
        Restart();
    }
    

}


//----------------------------------------------------------------------------------------------------------------
//Computer vision functions

function CamSetup() {
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handpose = ml5.handpose(video, modelReady);
    handpose.on("predict", results => {
    predictions = results;
    });
}

function Cam() {//disable this in formal game
  image(video, 0, 0, width, height);
}

//----------------------------------------------------------------------------------------------------------------
//background functions

function backgroundSetup() {
  //background setup code here
}

function backgroundDraw() {
  image(backgroundImage, 0, 0, width, height);
}

//----------------------------------------------------------------------------------------------------------------
//hand drawing functions

function modelReady() {
  console.log("Handpose model loaded!");
}

function DrawHands(inputPredictions) {
    predictions = inputPredictions;
    for (let i = 0; i < predictions.length; i++) {
        const hand = predictions[i];
        for (let j = 0; j < hand.landmarks.length; j++) {
            const [x, y] = hand.landmarks[j];
            fill(0, 255, 0);
            noStroke();
            ellipse(x, y, 10, 10);
        }
        const annotations = hand.annotations;
        stroke(255, 0, 0);
        strokeWeight(2);
        for (let j = 0; j < annotations.thumb.length - 1; j++) {
            const [x1, y1] = annotations.thumb[j];
            const [x2, y2] = annotations.thumb[j + 1];
            line(x1, y1, x2, y2);
        }
        for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
            const [x1, y1] = annotations.indexFinger[j];
            const [x2, y2] = annotations.indexFinger[j + 1];
            line(x1, y1, x2, y2);
        }
        for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
            const [x1, y1] = annotations.middleFinger[j];
            const [x2, y2] = annotations.middleFinger[j + 1];
            line(x1, y1, x2, y2);
        }
        for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
            const [x1, y1] = annotations.ringFinger[j];
            const [x2, y2] = annotations.ringFinger[j + 1];
            line(x1, y1, x2, y2);
        }
        for (let j = 0; j < annotations.pinky.length - 1; j++) {
            const [x1, y1] = annotations.pinky[j];
            const [x2, y2] = annotations.pinky[j + 1];
            line(x1, y1, x2, y2);
        }
    }
}

function isFingerExtended(finger) {
  const base = finger[0];   //finger base
  const tip = finger[3];    //finger tip
  const dist = dist2D(base, tip);

  return dist > 60; //threshold for determining if the finger is extended
}

function isFingerFolded(finger) {
  const base = finger[0];
  const tip = finger[3];
  const dist = dist2D(base, tip);

  return dist < 60; //threshold for determining if the finger is folded
}


function dist2D(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

//core pointing detection function, returns true if the hand is making a pointing gesture (index finger extended,
//  others folded
//notice that this DOES RETURN THINGS, thats why I love C# so much
function isPointingGesture(hand) {
    const f = hand.annotations;

    const indexExtended = isFingerExtended(f.indexFinger);
    const middleFolded = isFingerFolded(f.middleFinger);
    const ringFolded   = isFingerFolded(f.ringFinger);
    const pinkyFolded  = isFingerFolded(f.pinky);

    //no need to check thumb for pointing gesture
    return indexExtended && middleFolded && ringFolded && pinkyFolded;
}

function ReturnIndexFingerTipPos(hand) {
    //console.log("Returning index finger tip position at: " + hand.annotations.indexFinger[3]);
    return hand.annotations.indexFinger[3];
}


//----------------------------------------------------------------------------------------------------------------
//game logic functions
//settings
let lastHandPos = [320, 240];
let ufoPosition = [300, 200]; //initial ufo position
let ufoSpeed = 3;
let goalCapturedShots = 200; //this tests your muscle, I mean literally


//variables that you should not adjust
let ufoVelocity = [0, 0];
let ufoDirection = [0, 0];
let ufoAngle = 0;
let ufoTimer = 0; 
let capturedShots = 0;


//main game lifetime
function Game() {
    
    //if the hand is making a pointing gesture, update lastHandPos to the index finger tip position
    if (predictions.length > 0 && isPointingGesture(predictions[0])) {
        lastHandPos = ReturnIndexFingerTipPos(predictions[0]);
    }

    // smoothly move the targeting position towards the last detected hand position
    targetingPosition = SmoothTargetingPosition(targetingPosition, lastHandPos);

    // paint
    DrawUFOCaptureBox(targetingPosition);
    UFO();
    if (IsUFOCaptured(ufoPosition, DrawUFOCaptureBox(targetingPosition))) {
        capturedShots++;
        console.log("UFO Captured! Total captured shots: " + capturedShots);
        if (capturedShots >= goalCapturedShots) {
            console.log("Congratulations! You've captured " + goalCapturedShots + " UFOs!");
            isWin = true;
        }
    }
    GameUI();
}


function GetPositionFromHand() {
    let tmpPosition = targetingPosition; //default to current position if no pointing gesture is detected
    
    if (predictions.length > 0 && isPointingGesture(predictions[0])) 
    {
        tmpPosition = ReturnIndexFingerTipPos(predictions[0]);
        //else keep original targeting position
    }
    
    return tmpPosition;
}

function SmoothTargetingPosition(currentPos, targetPos) {
    let smoothX = lerp(currentPos[0], targetPos[0], 0.1);
    let smoothY = lerp(currentPos[1], targetPos[1], 0.1);
    return [smoothX, smoothY];
}

//ufo capture box using the targeting position
function DrawUFOCaptureBox(targeting){
    //this should be separate to TWO functions, one for actual and one for drawing
    //but thanks to the speghetti code here, will not touch anything about it for now
    let boxW = 170;
    let boxH = 100;
    let zoom = 1.5;

    // capture box position (centered on targeting position)
    let bx = targeting[0] - boxW / 2;
    let by = targeting[1] - boxH / 2;

    //calculate cropping
    let cropW = boxW / zoom;
    let cropH = boxH / zoom;

    let sx = targeting[0] - cropW / 2;
    let sy = targeting[1] - cropH / 2;

    sx = constrain(sx, 0, width - cropW);
    sy = constrain(sy, 0, height - cropH);

    //get canvas data
    let cropped = get(sx, sy, cropW, cropH);

    // clipping the cropped image to a circle
    //this is sooooooooo powerful
    pg.clear(); 
    pg.image(cropped, 0, 0, boxW, boxH);

    //place the cropped image at the CENTER of the capture box
    pg.image(cropped, 0, 0, boxW, boxH);

    // create a circular mask
    image(pg, bx, by);

    //draw the camera image on top of the capture box
    image(
        captureBoxImage,
        targeting[0] - boxW / 2 - 50,
        targeting[1] - boxH / 2 - 175,
        boxW * 1.9,
        boxW * 1.9
    );

    return [bx, by, boxW/zoom, boxH/zoom]; //return the actual capture box area for UFO capture detection
}







//ufo functions

function UFO() {
    ufoPosition = LevyFlight(ufoSpeed);
    DrawUFO(ufoPosition, ufoDirection);
    
}

function LevyFlight(speed) {//not only ufo can use this but may also be used for other random object movement in future
    ufoTimer--;
    if (ufoTimer <= 0) {
        let beta = 1.5;
        let step = 1 / Math.pow(Math.random(), 1 / beta); 
        let angle = Math.random() * Math.PI * 2;

        // new target position based on the step and angle
        ufoTarget = [
            ufoPosition[0] + Math.cos(angle) * step * 80, 
            ufoPosition[1] + Math.sin(angle) * step * 80
        ];

        // next target in 20 to 60 frames
        ufoTimer = int(random(20, 60));
    }

    // smooth
    let desiredVel = [
        ufoTarget[0] - ufoPosition[0],
        ufoTarget[1] - ufoPosition[1]
    ];

    // in case the program freaks out
    let mag = Math.hypot(desiredVel[0], desiredVel[1]);
    if (mag > 0) {
        desiredVel[0] /= mag;
        desiredVel[1] /= mag;
    }
    ufoDirection = desiredVel;
    // smoothly adjust velocity towards desired velocity
    ufoVelocity[0] = lerp(ufoVelocity[0], desiredVel[0] * 2, 0.05);
    ufoVelocity[1] = lerp(ufoVelocity[1], desiredVel[1] * 2, 0.05);

    // update position
    ufoPosition[0] += ufoVelocity[0]*speed;
    ufoPosition[1] += ufoVelocity[1]*speed;

    // teleportation at edges
    if (ufoPosition[0] < 0) ufoPosition[0] = width;
    if (ufoPosition[0] > width) ufoPosition[0] = 0;
    if (ufoPosition[1] < 0) ufoPosition[1] = height;
    if (ufoPosition[1] > height) ufoPosition[1] = 0;



    return ufoPosition;
}
function DrawUFO(Pos,Dir) {
    fill(0, 255, 255);
    noStroke();
    if (Dir[0] > 0.5) {
        image(ufoImageRight, Pos[0] - 25, Pos[1] - 25, 75, 75);
    }
    else if (Dir[0] < -0.5) {
        image(ufoImageLeft, Pos[0] - 25, Pos[1] - 25, 75, 75);
    }
    else if (Dir[1] > 0.5) {
        image(ufoImageTop, Pos[0] - 25, Pos[1] - 25, 75, 75);
    }
    else {
        image(ufoImageBottom, Pos[0] - 25, Pos[1] - 25, 75, 75);
    }
    //image(ufoImage, Pos[0] - 25, Pos[1] - 25, 100, 100);
    //ellipse(Pos[0], Pos[1], 30, 30);

}

function IsUFOCaptured(ufoPos, captureBox) {
    return (ufoPos[0] > captureBox[0] && ufoPos[0] < captureBox[0] + captureBox[2] &&
            ufoPos[1] > captureBox[1] && ufoPos[1] < captureBox[1] + captureBox[3]);
}

function GameUI(){
    textFont("Courier New");
    noStroke();
    
    if (isWin) {
        WinScreen();
    }
    else {
        UICaptureCount();
        Hint();
    }
}
function UICaptureCount(){
    fill(255);
    textSize(20);

    textAlign(LEFT);
    
    text("Captured UFOs: " + capturedShots + "/" + goalCapturedShots, 10, height - 10);
}
function WinScreen(){
    background(0, 150);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("Congratulations!", width/2, height/2 - 50);
    textSize(20);
    text("You've captured " + goalCapturedShots + " pictures of UFOs!", width/2, height/2);
    text("Press any key to restart the game", width/2, height/2 + 50);
}

function Hint(){
    fill(255);
    textSize(20);

    text("Hint: Do ☝️ and point VERTICALLY", 5, 20);
}
function Restart(){
    if (isWin && keyIsPressed) {
        RestartGame();
    }
}
function RestartGame(){
    capturedShots = 0;
    isWin = false;
    ufoPosition = [100, 100];
    ufoVelocity = [0, 0];
    ufoDirection = [0, 0];
    ufoAngle = 0;
    ufoTimer = 0; 
}