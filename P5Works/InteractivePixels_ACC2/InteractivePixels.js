//Guten Tag! dies ist ein Test, um die Schriftart zu laden und die Punkte der Schriftart zu bekommen.

function preload() {
    font = loadFont('../P5Works/InteractivePixels_ACC2/PoiretOne-Regular.ttf');
}
function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('sketch-container');
    textFont(font);
    textSize(200);
}
function draw() {
    background(220);
    //text('Hello', width/2-370, height/2+65);
    //settings
    let text = 'Invi-\n-sible';
    
    let fontSize =220;
    let sampleFactorSet = 0.1;
    let pixelSize = 10;
    noStroke();
    let originalScale = 3;
    let targetScale = 20;
    let fillColor = color(0);
    let strength = 5;
    //do not touch below
    let pixelx = width / pixelSize;
    let pixely = height / pixelSize;

    points = SampleTextPoints(text, width, height, fontSize, sampleFactorSet, 100, 1, -100);
    let pixelArray = PixelatePoints(points, pixelSize, pixelx, pixely);
    scaleArray = ScaleByMouse(mouseX, mouseY, pixelArray, pixelSize, originalScale, targetScale, strength);
    DrawPixelatedPoints(scaleArray, pixelSize, fillColor);
}

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
                y: pt.y + lineIndex * lineHeight + yOffset
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
            y: map(pt.y, minY, maxY, boundYmin, boundYmax)
        };
    });

    return mappedPoints;
}

function PixelatePoints(pts, pixelSize, pixelx, pixely) {
    let pixelArray = [];

    for (let xCoord = 0; xCoord < pixelx; xCoord++) {
        for (let yCoord = 0; yCoord < pixely; yCoord++) {

            let isColored = false;

            //see if any point falls into word pixel area, if yes, mark this pixel
            for (let pt of pts) {
                if (
                    pt.x >= xCoord * pixelSize &&
                    pt.x < (xCoord + 1) * pixelSize &&
                    pt.y >= yCoord * pixelSize &&
                    pt.y < (yCoord + 1) * pixelSize
                ) {
                    isColored = true;
                    break; //colored already
                }
            }

            pixelArray.push({
                x: xCoord,
                y: yCoord,
                isColored: isColored
            });
        }
    }

    return pixelArray;
}

function DrawPixelatedPoints(pixelArray, pixelSize, fillColor) {
    fill(fillColor);

    for (let pt of pixelArray) {
        ellipse(
            pt.x * pixelSize + pixelSize / 2,
            pt.y * pixelSize + pixelSize / 2,
            pt.size,
            pt.size
        );
    }
}

function ScaleByMouse(mouseX, mouseY, pixelArray, pixelSize, originalSize, targetSize, strength) {
    let scaledPixels = [];
    for (let pt of pixelArray) {
        if(pt.isColored){
            let distance = dist(mouseX, mouseY, pt.x * pixelSize + pixelSize / 2, pt.y * pixelSize + pixelSize / 2);
            let scaleFactor = map(distance, 0, width/strength, targetSize / originalSize, 1);
            
            let newSize = originalSize * scaleFactor;
            if (newSize < originalSize) {
                newSize = originalSize;
            }
            scaledPixels.push({
                x: pt.x,
                y: pt.y,
                isColored: pt.isColored,
                size: newSize
            });
        }
        else{
            scaledPixels.push({
                x: pt.x,
                y: pt.y,
                isColored: pt.isColored,
                size: originalSize+NoisePointSize(pt.x,pt.y, 5) // add noise-based size variation for non-colored pixels
            });
        }
    }
    return scaledPixels;
}

function NoisePointSize(x, y, intensity){
    let z = frameCount * 0.1; // animate over time
    let noiseValue = noise(x, y, z);
    noiseValue = noiseValue*3-2; // increase contrast
    noiseValue = max(0, noiseValue); // only positive values
    let pointsSize = map(noiseValue, 0, 1, 0, intensity);


    return pointsSize
}

