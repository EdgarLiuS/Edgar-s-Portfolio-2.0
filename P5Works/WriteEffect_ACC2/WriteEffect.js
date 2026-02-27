//Guten Tag! dies ist ein Test, um die Schriftart zu laden und die Punkte der Schriftart zu bekommen.
let lastUpdateTime = 0;
let interval = 0.001; // 0.001 Sekunden
let visibleCount = 0;
function preload() {
    font = loadFont('../P5Works/WriteEffect_ACC2/UnicaOne-Regular.ttf');
}
function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('sketch-container');
    textFont(font);
    
}
function draw() {
    background(255);
    noStroke();
    let pts = SampleTextPointsCLS('Talk is Cheap\nShow Me The \nCode', width, 220, 0.2, 100, 1, 100);
    // Aktualisierung alle 0,01 Sekunden
    if (millis() - lastUpdateTime > interval) {
        if (mouseIsPressed) {
            // Füge einen Punkt hinzu
            visibleCount+=6;
            visibleCount = min(visibleCount, pts.length); // Verhindere, dass visibleCount die Anzahl der Punkte überschreitet
        } else {
            // Entferne einen Punkt
            visibleCount-=6;
            visibleCount = max(visibleCount, 0); // Verhindere negative Werte
        }

        // Begrenze die Anzahl der sichtbaren Punkte
        visibleCount = constrain(visibleCount, 0, pts.length);

        lastUpdateTime = millis();
    }

    // Zeichne die sichtbaren Punkte, basierend auf der aktuellen Anzahl
    ellipseDrawer(pts.slice(0, visibleCount), 10);
}

//Dies dient dazu, die Punkte der Schriftart zu bekommen. Es nimmt den Text, die x- und y-Position, die Schriftgröße und den Sample-Faktor als Parameter und gibt die Punkte zurück.
function fontGetPoints(Text, x, y, fontSize,sampleFactor) {
    let points = font.textToPoints(Text, x, y, fontSize, {
        sampleFactor: sampleFactor
    });
    console.log(points);
    return points;
}


function SampleTextPointsCLS(text, width, fontSize, sampleFactorSet, padding, paddingYMultiplier, yOffset) {
    //CLS MODE!!!'
    //CLS for ConstantLineSize
    //still a little buggy, but lets just roll with it for now.


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
    
    
    let rawPoints = [];

    // sample a character
    let testPts = font.textToPoints("C", 0, 0, fontSize, { sampleFactor: 0.1 });
    let testMinY = min(testPts.map(p => p.y));
    let testMaxY = max(testPts.map(p => p.y));
    let fontRealHeight = testMaxY - testMinY;

    // Constant line size
    let fixedLineHeight = fontRealHeight * 0.7; 

    
    let targetWidth = width - padding * 2;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let line = lines[lineIndex];

        let pts = font.textToPoints(line, 0, 0, fontSize, { sampleFactor: sampleFactorSet });

        
        let minX = min(pts.map(p => p.x));
        let maxX = max(pts.map(p => p.x));
        let minY = min(pts.map(p => p.y));
        let maxY = max(pts.map(p => p.y));

        let lineWidth = maxX - minX;

        
        let scale = targetWidth / lineWidth;

        for (let pt of pts) {
            
            let scaledX = (pt.x - minX) * scale + padding;
            let scaledY = (pt.y - minY) * scale;

            
            let finalY = padding * paddingYMultiplier + scaledY + lineIndex * fixedLineHeight + yOffset;

            rawPoints.push({
                x: scaledX,
                y: finalY
            });
        }
    }

    return rawPoints;
}




//Diese Funktion zeichnet Ellipsen an den Punkten, die von der fontGetPoints-Funktion zurückgegeben werden. Es nimmt die Punkte und die Größe der Ellipsen als Parameter.
function ellipseDrawer(points,size) {
    fill (0);
    for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        
        ellipse(pt.x, pt.y, size, size);
    }
}



