# Algorithmic Art

Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use when users request generative art, algorithmic art, flow fields, particle systems, or creative coding. Create original algorithmic art rather than copying existing artists' work.

## Two-Step Process

1. Algorithmic Philosophy Creation (.md file)
2. Express by creating p5.js generative art (.html + .js files)

## Step 1: Algorithmic Philosophy Creation

Create an ALGORITHMIC PHILOSOPHY (not static images) interpreted through:
- Computational processes, emergent behaviour, mathematical beauty
- Seeded randomness, noise fields, organic systems
- Particles, flows, fields, forces
- Parametric variation and controlled chaos

### How to Generate

**Name the movement** (1-2 words): "Organic Turbulence" / "Quantum Harmonics" / "Emergent Stillness"

**Articulate the philosophy** (4-6 paragraphs) expressing how it manifests through:
- Computational processes and mathematical relationships
- Noise functions and randomness patterns
- Particle behaviours and field dynamics
- Temporal evolution and system states
- Parametric variation and emergent complexity

**Guidelines:**
- Avoid redundancy -- each algorithmic aspect mentioned once
- Emphasise craftsmanship repeatedly: the algorithm should appear meticulously crafted, refined through countless iterations
- Leave creative space for interpretive implementation choices

### Philosophy Examples

**"Organic Turbulence"**: Flow fields driven by layered Perlin noise. Thousands of particles following vector forces, trails accumulating into organic density maps. Colour emerges from velocity and density.

**"Quantum Harmonics"**: Particles on a grid carrying phase values evolving through sine waves. Phase interference creates bright nodes and voids. Simple harmonic motion generates complex emergent mandalas.

**"Recursive Whispers"**: Self-similarity across scales. Branching structures subdividing recursively, randomised but constrained by golden ratios. L-systems generating organic mathematical forms.

**"Field Dynamics"**: Invisible forces made visible. Vector fields from mathematical functions or noise. Particles born at edges, flowing along field lines, dying at equilibrium.

## Step 2: p5.js Implementation

### Technical Requirements

**Seeded Randomness (Art Blocks Pattern):**
```javascript
let seed = 12345;
randomSeed(seed);
noiseSeed(seed);
```

**Parameter Structure:**
```javascript
let params = {
  seed: 12345,
  // Add parameters that control YOUR algorithm:
  // - Quantities (how many?)
  // - Scales (how big? how fast?)
  // - Probabilities (how likely?)
  // - Ratios (what proportions?)
  // - Thresholds (when does behaviour change?)
};
```

**Canvas Setup:**
```javascript
function setup() {
  createCanvas(1200, 1200);
}

function draw() {
  // Your generative algorithm
}
```

### Let Philosophy Drive Implementation

If about **organic emergence**: elements that accumulate, random processes constrained by natural rules, feedback loops.

If about **mathematical beauty**: geometric relationships, trigonometric functions, precise calculations creating unexpected patterns.

If about **controlled chaos**: random variation within strict boundaries, bifurcation, order emerging from disorder.

### Craftsmanship Requirements

- **Balance**: Complexity without visual noise, order without rigidity
- **Colour Harmony**: Thoughtful palettes, not random RGB
- **Composition**: Visual hierarchy and flow even in randomness
- **Performance**: Smooth execution, optimised for real-time if animated
- **Reproducibility**: Same seed ALWAYS produces identical output

### Output Format

Create a single self-contained HTML file:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
</head>
<body>
  <div id="canvas-container"></div>
  <div id="controls">
    <!-- Seed navigation: prev/next/random/jump -->
    <!-- Parameter sliders -->
    <!-- Regenerate/Reset/Download buttons -->
  </div>
  <script>
    // ALL p5.js code inline
  </script>
</body>
</html>
```

### Interactive Controls

Required features:
1. **Parameter Controls**: Sliders for numeric parameters, colour pickers, real-time updates
2. **Seed Navigation**: Display current seed, prev/next/random buttons, jump-to-seed input
3. **Actions**: Regenerate, Reset, Download PNG

## Variations & Exploration

The artifact includes seed navigation by default. Each seed reveals different facets of the algorithm's potential -- like creating a series of prints from the same plate.
