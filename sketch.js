// =========================
// Global State
// =========================
let organisms = [];
let foodSources = [];
let newOrganisms = [];
let UI = {};
let charts = {};

let simRunning = false;

let colorModeSetting = "species";

let populationHistory = [];
let speedHistory = [];
let visionHistory = [];
let sizeHistory = [];
let hungryHistory = [];
let fertilityHistory = [];

let recordInterval = 0.5; // seconds
let recordTimer = 0;


// default values
let baseStats = {
    speed: 1.0,
    vision: 80,
    size: 10,
    hungryThreshold: 30,
    fertilityThreshold: 90,
    mutationRate: 0.05,
    offspringEnergyCost: 50,
    maxAge: 100,
};

let BASE_GENOTYPE;
let noOfOrg = 5;
let noOfFood = 36;
let rows = 6;
let cols = 6;

// =========================
// Setup UI + Canvas
// =========================
function setup() {
    let cnv = createCanvas(700, 700);
    cnv.parent("canvasContainer");
    colorMode(HSL);

    UI = {
        noOfOrg: document.getElementById("noOfOrg"),
        noOfFood: document.getElementById("noOfFood"),
        speed: document.getElementById("speed"),
        vision: document.getElementById("vision"),
        size: document.getElementById("size"),
        hungryThreshold: document.getElementById("hungryThreshold"),
        fertilityThreshold: document.getElementById("fertilityThreshold"),
        mutationRate: document.getElementById("mutationRate"),
        offspringEnergyCost: document.getElementById("offspringEnergyCost"),
        maxAge: document.getElementById("maxAge"),
    };

    document.getElementById("startBtn").addEventListener("click", startSim);
    document.getElementById("stopBtn").addEventListener("click", stopSim);
    document
        .getElementById("resetBtn")
        .addEventListener("click", resetSimulation);
    document
        .getElementById("downloadBtn")
        .addEventListener("click", saveDataCSV);

    document
        .getElementById("colorSpeed")
        .addEventListener("click", () => (colorModeSetting = "speed"));
    document
        .getElementById("colorSize")
        .addEventListener("click", () => (colorModeSetting = "size"));
    document
        .getElementById("colorVision")
        .addEventListener("click", () => (colorModeSetting = "vision"));

    initializeSimulationState();
    renderStaticWorld();
    drawAllGraphs();
    noLoop();
}

// =========================
// Read User Inputs
// =========================
function readUserInputs() {
    baseStats.speed = parseFloat(UI.speed.value);
    baseStats.vision = parseInt(UI.vision.value);
    baseStats.size = parseInt(UI.size.value);
    baseStats.hungryThreshold = parseInt(UI.hungryThreshold.value);
    baseStats.fertilityThreshold = parseInt(UI.fertilityThreshold.value);
    baseStats.mutationRate = parseFloat(UI.mutationRate.value);
    baseStats.offspringEnergyCost = parseInt(UI.offspringEnergyCost.value);
    baseStats.maxAge = parseInt(UI.maxAge.value);

    noOfOrg = parseInt(UI.noOfOrg.value);
    noOfFood = parseInt(UI.noOfFood.value);

    // compute food grid
    for (let i = Math.floor(Math.sqrt(noOfFood)); i > 0; i--) {
        if (noOfFood % i === 0) {
            cols = i;
            rows = noOfFood / i;
            break;
        }
    }
}

// =========================
// Init Simulation Data
// =========================
function initializeSimulationState() {
    organisms = [];
    foodSources = [];
    newOrganisms = [];

    populationHistory = [];
    speedHistory = [];
    visionHistory = [];
    sizeHistory = [];
    hungryHistory = [];
    fertilityHistory = [];

    BASE_GENOTYPE = new Genotype(baseStats);

    // place food
    let spacingX = width / (cols + 1);
    let spacingY = height / (rows + 1);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            foodSources.push(
                new Food((c + 1) * spacingX, (r + 1) * spacingY, 8)
            );
        }
    }

    // spawn organisms
    for (let i = 0; i < noOfOrg; i++) {
        organisms.push(
            new Organism(
                random(width),
                random(height),
                BASE_GENOTYPE,
                random(TWO_PI),
                80
            )
        );
    }
}

function renderStaticWorld() {
    renderSimulation({
        minSpeed: 0,
        maxSpeed: 1,
        minSize: 0,
        maxSize: 1,
        minVision: 0,
        maxVision: 1,
    });
}


// =========================
// Start / Stop / Reset
// =========================
function startSim() {
    if (!simRunning) {
        readUserInputs();
        initializeSimulationState();

        simRunning = true;
        loop();
    }
}

function stopSim() {
    simRunning = false;
    noLoop();

    drawAllGraphs();
}

function resetSimulation() {
    simRunning = false;
    noLoop();

    initializeSimulationState();

    renderStaticWorld();

    drawAllGraphs();
}


let fastForwardSteps = 1;

document.getElementById("ff1x").addEventListener("click", () => {
    fastForwardSteps = 1;
});

document.getElementById("ff10x").addEventListener("click", () => {
    fastForwardSteps = 10;
});

document.getElementById("ff50x").addEventListener("click", () => {
    fastForwardSteps = 50;
});


// =========================
// MAIN DRAW LOOP
// =========================
function draw() {
    if (!simRunning) return;

    const dt = deltaTime / 1000;

    let stats;
    for (let i = 0; i < fastForwardSteps; i++) {
        stats = updateSimulation(dt);
    }

    renderSimulation(stats);
}



function updateSimulation(dt) {
    // food logic
    for (let f of foodSources) {
        f.update(dt);
    }


    let minSpeed = Infinity, maxSpeed = -Infinity;
    let minSize = Infinity, maxSize = -Infinity;
    let minVision = Infinity, maxVision = -Infinity;

    for (let o of organisms) {
        minSpeed = min(minSpeed, o.speed);
        maxSpeed = max(maxSpeed, o.speed);

        minSize = min(minSize, o.size);
        maxSize = max(maxSize, o.size);

        minVision = min(minVision, o.vision);
        maxVision = max(maxVision, o.vision);
    }

    for (let o of organisms) {
        if (!o.alive) continue;

        let baby = o.update(
            foodSources.filter(f => f.available),
            dt
        );

        if (baby) newOrganisms.push(baby);
    }

    organisms = organisms.filter(o => o.alive);
    organisms.push(...newOrganisms);
    newOrganisms = [];

    // record history
    recordTimer += dt;

    if (recordTimer >= recordInterval) {
        recordTimer = 0;

        populationHistory.push(organisms.length);
        speedHistory.push(avgTrait("speed"));
        visionHistory.push(avgTrait("vision"));
        sizeHistory.push(avgTrait("size"));
        hungryHistory.push(avgTrait("hungryThreshold"));
        fertilityHistory.push(avgTrait("fertilityThreshold"));
    }


    return { minSpeed, maxSpeed, minSize, maxSize, minVision, maxVision };
}

function renderSimulation(stats) {
    background(245);

    // draw food
    for (let f of foodSources) {
        f.draw();
    }

    for (let o of organisms) {
        let c;

        if (colorModeSetting === "speed")
            c = traitColor(o.speed, stats.minSpeed, stats.maxSpeed, 280);
        else if (colorModeSetting === "size")
            c = traitColor(o.size, stats.minSize, stats.maxSize, 180);
        else if (colorModeSetting === "vision")
            c = traitColor(o.vision, stats.minVision, stats.maxVision, 30);
        else
            c = color(60, 100, 29);

        fill(c);
        noStroke();
        circle(o.x, o.y, o.size);
    }
}



// =========================
// Utilities
// =========================
function avgTrait(trait) {
    if (organisms.length === 0) return 0;
    return (
        organisms.reduce((sum, o) => sum + (o[trait] ?? o.genotype[trait]), 0) /
        organisms.length
    );
}

function traitColor(value, minV, maxV, baseHue) {
    let t = map(value, minV, maxV, 0, 1);
    t = constrain(t, 0, 1);
    let light = map(t, 0, 1, 90, 30);

    let c = color(baseHue, 80, light);

    return c;
}

// =========================
// CSV Export
// =========================
function saveDataCSV() {
    let csv = "tick,population,speed,vision,size,hungry,fertility\n";

    for (let i = 0; i < populationHistory.length; i++) {
        csv +=
            [
                i,
                populationHistory[i],
                speedHistory[i],
                visionHistory[i],
                sizeHistory[i],
                hungryHistory[i],
                fertilityHistory[i],
            ].join(",") + "\n";
    }

    save(csv.split("\n"), "evolution_data.csv");
}

const graphColors = {
    graphPopulation: "hsl(140, 60%, 40%)", // muted green
    graphSpeed: "hsl(0, 65%, 45%)", // muted red
    graphVision: "hsl(220, 60%, 45%)", // muted blue
    graphSize: "hsl(30, 55%, 45%)", // muted orange
    graphHungry: "hsl(50, 60%, 45%)", // mustard yellow
    graphFertility: "hsl(280, 55%, 45%)", // soft purple
};

function drawLineGraph(id, dataArray, label) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext("2d");

    if (charts[id]) {
        charts[id].destroy();
    }

    charts[id] = new Chart(ctx, {
        type: "line",
        data: {
            labels: dataArray.map((_, i) => i),
            datasets: [
                {
                    label: label,
                    data: dataArray,
                    borderColor: graphColors[id],
                    borderWidth: 1,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
            },
            plugins: {
                legend: {
                    labels: {
                        color: graphColors[id],
                        font: {
                            family: "Inter",
                        },
                    },
                },
            },
        },
    });
}

function drawAllGraphs() {
    drawLineGraph("graphPopulation", populationHistory, "Population");
    drawLineGraph("graphSpeed", speedHistory, "Speed");
    drawLineGraph("graphVision", visionHistory, "Vision");
    drawLineGraph("graphSize", sizeHistory, "Size");
    drawLineGraph("graphHungry", hungryHistory, "Hunger Threshold");
    drawLineGraph("graphFertility", fertilityHistory, "Fertility Threshold");
}
