class Genotype {
    constructor({
        speed,
        vision,
        size,
        hungryThreshold,
        fertilityThreshold,
        mutationRate,
        offspringEnergyCost,
        maxAge
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

        function mutate(value) {
            return value + random(-m, m) * value;
        }

        return new Genotype({
            speed: mutate(this.speed),
            vision: mutate(this.vision),
            size: mutate(this.size),
            hungryThreshold: mutate(this.hungryThreshold),
            fertilityThreshold: mutate(this.fertilityThreshold),
            mutationRate: this.mutationRate,
            offspringEnergyCost: this.offspringEnergyCost,
            maxAge: this.maxAge
        });
    }
}


window.Genotype = Genotype;
