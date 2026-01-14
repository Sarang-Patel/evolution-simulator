class Food {
    constructor(x, y, size = 35, respawnTime = 4) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = size / 2;

        this.available = true;

        // respawnTime is now in SECONDS
        this.respawnTime = respawnTime;
        this.timer = 0;
    }

    eat() {
        this.available = false;
        this.timer = 0;
    }

    update(dt) {
        if (!this.available) {
            this.timer += dt;

            if (this.timer >= this.respawnTime) {
                this.available = true;
                this.timer = 0;
            }
        }
    }

    draw() {
        if (this.available) {
            fill(108, 100, 20, 0.588);
            noStroke();
            circle(this.x, this.y, this.size);
        }
    }
}

window.Food = Food;
