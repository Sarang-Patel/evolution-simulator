# 🧬 Evolution Simulator

**A real-time 2D artificial life simulation built with p5.js.**
Organisms move, eat, reproduce, mutate, and evolve traits over time in a resource-limited environment.

---

# 🚀 Features

* 🧠 **Agent-based simulation** with autonomous organisms
* 🧬 **Genetic inheritance & mutation system**
* 📈 **Tracked trait histories** (population, speed, vision, size, hunger threshold, fertility)
* 🍏 **Food respawn & foraging system**
* 🐣 **Energy-based reproduction**
* 💀 **Starvation & age-based mortality**
* 📊 **CSV export** for offline analysis
* 🎛️ Start / Stop / Reset UI controls
* ⚡ Frame-rate independent logic using `deltaTime`

---

# 📂 Project Structure

```
/evolution-simulator
 ├── index.html
 ├── sketch.js
 ├── Organism.js
 ├── Genotype.js
 ├── Food.js
 ├── style.css
 ├── p5.min.js
 └── README.md
```
---

# 🌱 How the Simulation Works

## 🧬 Genotype → Phenotype System

Each organism is defined by a **genotype**:

```js
new Genotype({
    speed,
    vision,
    size,
    hungryThreshold,
    fertilityThreshold,
    mutationRate,
    offspringEnergyCost,
    maxAge
});
```

The genotype is inherited by offspring and mutated slightly using:

```js
mutate(value) {
    return value + random(-m, m) * value;
}
```

From this genotype, each organism expresses its **phenotype**:

* `speed` – movement speed
* `vision` – detection radius for food
* `size` – body size (also collision radius)
* `hungry` – start foraging below this energy
* `fertility` – reproduces above this energy

These phenotypes are used in all behavior and survival logic.

---

# 🐟 Organism Behavior

### 🔹 **Movement**

* Wander randomly by default
* If energy ≤ hungry threshold → move toward nearest food within vision radius
* Bounce off walls

### 🔹 **Energy Model**

* Passive drain each frame
* Eating food = +70 energy
* Reproduction costs energy (offspringEnergyCost)

### 🔹 **Reproduction**

If:

```
energy ≥ fertility threshold
```

then the organism creates an offspring with:

* Mutated genotype
* Starting energy of 50
* Slight random position offset

### 🔹 **Death**

Organisms die if:

* `energy <= 0`, or
* `age >= maxAge`

Dead organisms are removed each frame.

---

# 🍏 Food System

Food objects:

* Have a `size` and `radius`
* Can be **eaten once**, then disappear
* Respawn after `respawnTime` ms

```js
if (!available && millis() - eatenAt >= respawnTime)
    available = true;
```

---

# 📊 Data Logging

Each frame, the simulation logs:

| Tick                | Data                       |
| ------------------- | -------------------------- |
| `populationHistory` | number of living organisms |
| `speedHistory`      | avg speed                  |
| `visionHistory`     | avg vision                 |
| `sizeHistory`       | avg size                   |
| `hungryHistory`     | avg hungry threshold       |
| `fertilityHistory`  | avg fertility threshold    |

All can be exported as a CSV using the UI button.

---

# 🕹️ Controls

| Button           | Action                                   |
| ---------------- | ---------------------------------------- |
| **Start**        | Begin simulation                         |
| **Stop**         | Pause simulation                         |
| **Reset**        | Clear world & restart with base genotype |
| **Download CSV** | Save trait history                       |

---

# 🧪 Usage

## 🔧 Running Locally

1. Clone the repo:

```bash
git clone https://github.com/yourname/evolution-simulator
```

2. Open in browser:

```
index.html
```

No build step is required — p5.js runs directly in the browser.

---

# 🧱 Technical Notes

### ⚠ Chrome Tab Throttling

Chrome slows JavaScript drastically when the tab is unfocused.
This can cause:

* Sudden population drops
* Frozen or slow simulation
* Incorrect evolution timing

Workarounds:

* Use `deltaTime` for time-accurate updates
* Move simulation logic into a **Web Worker**
* Keep tab in focus
* Disable timer throttling in `chrome://flags` (local only)

---

# 🗺️ Roadmap

### ✔ Implemented

* Basic evolution mechanics
* Food respawn
* CSV logging
* Delta-time based energy & movement
* Trait graphing (offline)

### 🔜 Planned

* Web Worker simulation engine
* On-screen live graphs
* Predator species
* Sexual reproduction (two-parent genes)
* Environmental changes (seasons, disasters)
* Trait visualization (colors for speed, size, etc.)
* Save/load simulation state
