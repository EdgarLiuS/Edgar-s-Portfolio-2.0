//Guten Tag! dies ist ein Test, um die Schriftart zu laden und die Punkte der Schriftart zu bekommen.

function preload() {
    font = loadFont('../P5Works/Tower_ACC2/GravitasOne-Regular.ttf');
}
function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('sketch-container');
    textFont(font);
    textSize(200);
}
function draw() {
    background(20);
    //text('Hello', width/2-370, height/2+65);
    
    let fontSize = 200;
    let Words = 'Grad\n-ients';
    
    let sampleFactorSet = 0.1;
    let ellipseSize = 9;
    let fillColor = color(96, 227, 109);
    let targetColor = color(143, 57, 213);
    noStroke();
    //pillar settings
    let Offset = 10;
    let pillarloops = 20;
    BackgroundGradient(fillColor, targetColor,pillarloops);
    points = SampleTextPoints(Words, width, height-100, fontSize, sampleFactorSet, 50, 3, -70);
    PillarDrawer(points, ellipseSize, fillColor, targetColor, Offset, pillarloops)
    
}
//Dies dient dazu, die Punkte der Schriftart zu bekommen. Es nimmt den Text, die x- und y-Position, die Schriftgröße und den Sample-Faktor als Parameter und gibt die Punkte zurück.
function fontGetPoints(Text, x, y, fontSize,sampleFactor) {
    let points = font.textToPoints(Text, x, y, fontSize, {
        sampleFactor: sampleFactor
    });
    
    return points;
}

function SampleTextPoints(text, width, height, fontSize, sampleFactorSet, padding, paddingYMultiplier, yOffset) {
    //this is the core function that does formatting, makes life a lot easier, tbh.
    //pretty much encaplutated, feel free to use dis in other projects.

    //btw, SampleTextPoints(
    //                  text, 
    //                  width(you dont need to change this), 

    //                  fontSize, 
    //                  sampleFactorSet, 
    //                  padding, 
    //                  paddingYMultiplier   (defaut is 3, if you dont know what it does, just leave it blank),
    //                  yOffset              (defaut is 0, if you dont know what it does, just leave it blank)
    //                  )


    //these are for encapsulating, preventing giving you a scary error
    if (padding === undefined) {
        padding = 100;//fallback to 100
    }
    if (paddingYMultiplier === undefined) {
        paddingYMultiplier = 3;//fallback to 3
    }
    if (yOffset === undefined) {
        yOffset = 0;//fallback to 0
    }

    let lines = text.split('\n');//greatest invention in the universe
    

    
    let lineHeight = fontSize * 1.1;//line height, change this if you need but I do not want to make it a depency.

    let rawPoints = [];   
    

    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let line = lines[lineIndex];
        let pts = fontGetPoints(line, 0, 0, fontSize, sampleFactorSet);

        //separately record points for each line.
        for (let pt of pts) {
            rawPoints.push({
                x: pt.x,
                y: pt.y + lineIndex * lineHeight 
            });
        }
    }

    // global min/max
    let minX = min(rawPoints.map(p => p.x));
    let maxX = max(rawPoints.map(p => p.x));
    let minY = min(rawPoints.map(p => p.y));
    let maxY = max(rawPoints.map(p => p.y));

    // global mapping
    let paddingY = padding * paddingYMultiplier;
    let boundXmin = padding;
    let boundXmax = width - padding;
    let boundYmin = paddingY;
    let boundYmax = height - paddingY;

    let mappedPoints = rawPoints.map(pt => {
        return {
            x: map(pt.x, minX, maxX, boundXmin, boundXmax),
            y: map(pt.y, minY, maxY, boundYmin, boundYmax)+ yOffset
        };
    });

    return mappedPoints;
}

function PillarDrawer(points, size, fillColor, targetColor,Offset, pillarloops)
{
    let r;
    let g;
    let b;
    let rStep=(red(fillColor)-red(targetColor))/pillarloops;
    let gStep=(green(fillColor)-green(targetColor))/pillarloops;
    let bStep=(blue(fillColor)-blue(targetColor))/pillarloops;
    for (let i = 0; i < pillarloops; i++) {
        t=(sin(frameCount * 0.05 + i * 0.2) * 0.5 + 0.5) *15;
        r = (red(fillColor) - rStep * (pillarloops-t));
        g = (green(fillColor) - gStep * (pillarloops-t));
        b = (blue(fillColor) - bStep * (pillarloops-t));
        let currentColor = color(r, g, b);
        ellipseDrawer(points, size, currentColor, Offset*(pillarloops-i));

    }
}
//Diese Funktion zeichnet Ellipsen an den Punkten, die von der fontGetPoints-Funktion zurückgegeben werden. Es nimmt die Punkte und die Größe der Ellipsen als Parameter.
function ellipseDrawer(points,size,color,yOffset) {
    fill (color);
    for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        ellipse(pt.x, pt.y + yOffset, size, size);
    }
}
function BackgroundGradient(fillColor, targetColor, pillarloops) {

    let r;
    let g;
    let b;
    t=sin(frameCount * 0.05) * 0.5 + 0.5;
    r = (red(fillColor) - (red(fillColor) - red(targetColor)) * t);
    g = (green(fillColor) - (green(fillColor) - green(targetColor)) * t);
    b = (blue(fillColor) - (blue(fillColor) - blue(targetColor)) * t);
    let currentColor = color(r, g, b);
    background(currentColor);
    
}



