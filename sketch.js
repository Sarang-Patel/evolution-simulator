let organisms = [];

let foodSources = [];

let simRunning = false;

uiInitialized = false;

// this base genotype is the "Adam & Eve" of the sim
const BASE_GENOTYPE = new Genotype({
    speed: 1.0,
    vision: 80,
    size: 12,
    hungryThreshold: 30,
    fertilityThreshold: 90,
    mutationRate: 0.05,
    offspringEnergyCost: 50,
    maxAge: 100,
});

let newOrganisms = [];

let populationHistory = [];
let speedHistory = [];
let visionHistory = [];
let sizeHistory = [];
let hungryHistory = [];
let fertilityHistory = [];

function setup() {
    createCanvas(700, 700);

    let rows = 6;
    let cols = 6;
    let spacingX = width / (cols + 1);
    let spacingY = height / (rows + 1);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let x = (c + 1) * spacingX;
            let y = (r + 1) * spacingY;
            foodSources.push(new Food(x, y, 8));
        }
    }

    for (let i = 0; i < 5; i++) {
        organisms.push(
            new Organism(
                random(width),
                random(height),
                BASE_GENOTYPE, // ← pass founding genotype
                random(TWO_PI),
                80 // starting energy
            )
        );
    }

    if (!uiInitialized) {
        let startBtn = createButton("Start");
        startBtn.mousePressed(startSim);

        let stopBtn = createButton("Stop");
        stopBtn.mousePressed(stopSim);

        let resetBtn = createButton("Reset");
        resetBtn.mousePressed(resetSimulation);

        let downloadBtn = createButton("Download CSV");
        downloadBtn.mousePressed(saveDataCSV);

        uiInitialized = true;
    }
}

function startSim() {
    if (!simRunning) {
        simRunning = true;

        _lastFrameTime = millis();
        
        loop();
    }
}

function stopSim() {
    simRunning = false;
    noLoop();
}

function resetSimulation() {
    noLoop();
    simRunning = false;

    organisms = [];
    foodSources = [];

    populationHistory = [];
    speedHistory = [];
    visionHistory = [];
    sizeHistory = [];
    hungryHistory = [];
    fertilityHistory = [];

    setup();

    redraw();
}


function draw() {
    background(245);

    //updating food
    for (let food of foodSources) {
        food.update();
        food.draw();
    }

    if (simRunning) {
        // update organisms
        for (let org of organisms) {
            if (!org.alive) continue;

            let baby = org.update(foodSources.filter((f) => f.available));

            if (baby) newOrganisms.push(baby);

            fill(150, 150, 0);
            noStroke();
            circle(org.x, org.y, org.size);
        }

        // clear dead & add new
        organisms = organisms.filter((org) => org.alive);
        organisms.push(...newOrganisms);
        newOrganisms = [];

        // record histories
        populationHistory.push(organisms.length);
        speedHistory.push(avgTrait("speed"));
        visionHistory.push(avgTrait("vision"));
        sizeHistory.push(avgTrait("size"));
        hungryHistory.push(avgTrait("hungryThreshold"));
        fertilityHistory.push(avgTrait("fertilityThreshold"));

        // if (populationHistory.length > width) {
        //     populationHistory.shift();
        //     speedHistory.shift();
        //     visionHistory.shift();
        //     sizeHistory.shift();
        //     hungryHistory.shift();
        //     fertilityHistory.shift();
        // }
    }

    // // updating organisms
    // for (let org of organisms) {
    //     if (!org.alive) continue;

    //     // org.drawVision();
    //     let baby = org.update(foodSources.filter((f) => f.available));

    //     if (baby) newOrganisms.push(baby);

    //     fill(150, 150, 0);
    //     noStroke();
    //     circle(org.x, org.y, org.size);
    // }

    // // clearing dead ones and adding new ones
    // organisms = organisms.filter((org) => org.alive);
    // organisms.push(...newOrganisms);

    // newOrganisms = [];

    // populationHistory.push(organisms.length);

    // if (populationHistory.length > width) {
    //     populationHistory.shift();
    // }

    // drawGraph();
}

function avgTrait(traitName) {
    if (organisms.length === 0) return 0;
    let sum = 0;
    for (let org of organisms) {
        sum += org[traitName] ?? org.genotype[traitName];
    }
    return sum / organisms.length;
}

function saveDataCSV() {
    let csv = "tick,population,speed,vision,size,hungry,fertility\n";

    let length = populationHistory.length;

    for (let i = 0; i < length; i++) {
        csv +=
            [
                i, // tick
                populationHistory[i],
                speedHistory[i],
                visionHistory[i],
                sizeHistory[i],
                hungryHistory[i],
                fertilityHistory[i],
            ].join(",") + "\n";
    }

    // save as CSV file
    save(csv.split("\n"), "evolution_data.csv");
}

// function drawGraph() {
//     push();
//     stroke(0);
//     noFill();

//     stroke(0, 100, 255);
//     beginShape();
//     for (let i = 0; i < populationHistory.length; i++) {
//         let x = i;
//         let y = height - populationHistory[i] * 2;
//         vertex(x, y);
//     }
//     endShape();

//     pop();
// }
