class Genotype {
    constructor({
        speed,
        vision,
        size,
        hungryThreshold,
        fertilityThreshold,
        mutationRate,
        offspringEnergyCost,
        maxAge,
    }) {
        this.speed = speed;
        this.vision = vision;
        this.size = size;
        this.hungryThreshold = hungryThreshold;
        this.fertilityThreshold = fertilityThreshold;
        this.mutationRate = mutationRate;
        this.offspringEnergyCost = offspringEnergyCost;
        this.maxAge = maxAge;
    }

    mutatedCopy() {
        const m = this.mutationRate;

        function mutate(value, min, max, chance = 0.1) {
            if (random() > chance) return value;
            const mutated = value + random(-m, m) * value;
            return constrain(mutated, min, max);
        }

        return new Genotype({
            speed: mutate(this.speed, 0.5, 2.5),
            vision: mutate(this.vision, 65, 95),
            size: mutate(this.size, 8, 12),
            hungryThreshold: mutate(this.hungryThreshold, 20, 45),
            fertilityThreshold: mutate(this.fertilityThreshold, 70, 120),
            mutationRate: this.mutationRate,
            offspringEnergyCost: this.offspringEnergyCost,
            maxAge: this.maxAge,
        });
    }
}

window.Genotype = Genotype;
