class Food {
    constructor(x, y, size = 35, respawnTime = 4000) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = size / 2;
        this.available = true;
        this.respawnTime = respawnTime;
        this.eatenAt = null;
    }

    eat() {
        this.available = false;
        this.eatenAt = millis();
    }

    update() {
        if (!this.available && millis() - this.eatenAt >= this.respawnTime) {
            this.available = true;
            this.eatenAt = null;
        }
    }

    draw() {
        if (this.available) {
            fill(0, 100, 10, 150);
            noStroke();
            circle(this.x, this.y, this.size);
        }
    }
}

window.Food = Food;
