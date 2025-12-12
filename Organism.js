class Organism {
    constructor(x, y, genotype, direction, energy = 80) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.energy = energy;

        //genotype inherited from parent / base genotype if first org
        this.genotype = genotype;

        // Express phenotype : traits only for this org derived from genotype but can be modified during the lifetime of the org
        this.speed = genotype.speed;
        this.vision = genotype.vision;
        this.size = genotype.size;
        this.radius = this.size / 2;
        this.hungry = genotype.hungryThreshold;
        this.fertility = genotype.fertilityThreshold;

        this.alive = true;
        this.age = 0;
    }

    //wanders randomly
    move() {
        this.x += cos(this.direction) * this.speed;
        this.y += sin(this.direction) * this.speed;

        if (this.x < 0 || this.x > width) this.direction = PI - this.direction;
        if (this.y < 0 || this.y > height) this.direction = -this.direction;
    }

    // moves towards a designated target
    moveTowards(target) {
        let angle = atan2(target.y - this.y, target.x - this.x);
        this.direction = angle;

        this.x += cos(this.direction) * this.speed;
        this.y += sin(this.direction) * this.speed;
    }

    // main update every frame
    update(foodSources, timeScale) {
        //TODO: change energy usage with age
        this.age += deltaTime / 1000 * timeScale;
        let cost = 0.02 * (this.speed ** 2) * 0.01 + (this.size ** 0.75) * 0.01;
        this.energy -= cost * (deltaTime / 16.666) * timeScale;
        this.isDead();

        let target = this.findClosestFood(foodSources);

        if (target && this.energy <= this.hungry) {
            this.moveTowards(target);
        } else {
            this.move();
        }

        
        if (this.energy <= this.hungry) this.eatFood(foodSources);

        if (this.energy >= this.fertility && this.age > 0.2 * this.genotype.maxAge) return this.reproduce();
    }

    // creates a new org based on parents stats
    reproduce() {
        this.energy -= this.genotype.offspringEnergyCost;

        const babyGenes = this.genotype.mutatedCopy();

        return new Organism(
            this.x + random(-5, 5),
            this.y + random(-5, 5),
            babyGenes,
            this.direction + random(-0.3, 0.3),
            50
        );
    }

    // checks if org died
    isDead() {
        this.alive = this.energy > 0 && this.age < this.genotype.maxAge;
    }

    // eats food if hungry and in contact
    eatFood(foodSources) {
        for (let food of foodSources) {
            let dx = this.x - food.x;
            let dy = this.y - food.y;
            let distance = sqrt(dx * dx + dy * dy);

            if (distance <= this.radius + food.radius) {
                this.energy += 70;
                food.eat();
            }
        }
    }

    // filters the food closest to the org
    findClosestFood(foodSources) {
        let closest = null;
        let minDist = Infinity;

        for (let food of foodSources) {
            let dx = food.x - this.x;
            let dy = food.y - this.y;

            let dist = sqrt(dx * dx + dy * dy);

            if (dist <= this.vision && dist < minDist) {
                minDist = dist;
                closest = food;
            }
        }

        return closest;
    }

    // draws the vision boundary around the org
    drawVision() {
        let step = PI / 16;
        stroke(220, 80, 50);
        strokeWeight(2);
        noFill();

        for (let angle = 0; angle < TWO_PI; angle += step) {
            let px = this.x + cos(angle) * this.vision;
            let py = this.y + sin(angle) * this.vision;
            point(px, py);
        }
    }
}

window.Organism = Organism;
