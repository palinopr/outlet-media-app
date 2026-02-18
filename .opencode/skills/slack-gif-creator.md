# Slack GIF Creator

Knowledge and utilities for creating animated GIFs optimised for Slack. Use when users request animated GIFs, especially for Slack emoji or messages.

## Slack Requirements

| Type | Dimensions | FPS | Colours | Duration |
|------|-----------|-----|---------|----------|
| Emoji | 128x128 | 10-30 | 48-128 | <3 seconds |
| Message | 480x480 | 10-30 | 48-128 | flexible |

## Core Workflow

```python
from PIL import Image, ImageDraw
import imageio

frames = []
width, height = 128, 128

for i in range(12):
    frame = Image.new('RGB', (width, height), (240, 248, 255))
    draw = ImageDraw.Draw(frame)
    # Draw your animation using PIL primitives
    frames.append(frame)

# Save as GIF
imageio.mimsave('output.gif', [f.copy() for f in frames], fps=10, loop=0)
```

## Drawing Graphics

### PIL Primitives

```python
from PIL import ImageDraw

draw = ImageDraw.Draw(frame)

# Circles/ovals
draw.ellipse([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)

# Stars, triangles, any polygon
points = [(x1, y1), (x2, y2), (x3, y3)]
draw.polygon(points, fill=(r, g, b), outline=(r, g, b), width=3)

# Lines
draw.line([(x1, y1), (x2, y2)], fill=(r, g, b), width=5)

# Rectangles
draw.rectangle([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)
```

Don't use emoji fonts (unreliable across platforms).

### Making Graphics Look Good

- **Use thicker lines** -- always `width=2` or higher. Thin lines look choppy
- **Add visual depth** -- gradients for backgrounds, layer multiple shapes
- **Make shapes interesting** -- add highlights, rings, patterns. Stars can have glows
- **Vibrant colours** -- complementary, with contrast (dark outlines on light shapes)
- **Complex shapes** -- combine polygons and ellipses, calculate points for symmetry

## Animation Concepts

### Shake/Vibrate
Offset position with `math.sin()` or `math.cos()` plus small random variations.

### Pulse/Heartbeat
Scale size with `math.sin(t * frequency * 2 * math.pi)`. Scale between 0.8-1.2x.

### Bounce
Increasing y velocity each frame for gravity. Use ease_out for landing.

### Spin/Rotate
`image.rotate(angle, resample=Image.BICUBIC)`. Use sine wave for wobble.

### Fade In/Out
RGBA image with alpha channel adjustment, or `Image.blend(img1, img2, alpha)`.

### Slide
Move from off-screen to target position with easing for smooth stop.

### Explode/Particle Burst
Particles with random angles and velocities. Add gravity (`vy += constant`). Fade out over time.

## Easing Functions

```python
import math

def ease_out(t):
    return 1 - (1 - t) ** 3

def ease_in(t):
    return t ** 3

def ease_in_out(t):
    return 3 * t**2 - 2 * t**3

def bounce_out(t):
    if t < 1/2.75:
        return 7.5625 * t * t
    elif t < 2/2.75:
        t -= 1.5/2.75
        return 7.5625 * t * t + 0.75
    elif t < 2.5/2.75:
        t -= 2.25/2.75
        return 7.5625 * t * t + 0.9375
    else:
        t -= 2.625/2.75
        return 7.5625 * t * t + 0.984375

def interpolate(start, end, t, easing_fn=ease_out):
    return start + (end - start) * easing_fn(t)
```

## Optimisation

When file size needs reduction:
1. Fewer frames (lower FPS or shorter duration)
2. Fewer colours (48 instead of 128)
3. Smaller dimensions
4. Remove duplicate frames

## Dependencies

```bash
pip install pillow imageio numpy
```
