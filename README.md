[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-purple?style=for-the-badge)](https://make.fun)
[![bounty status](https://img.shields.io/badge/status-active-green?style=for-the-badge)](https://make.fun)
[![bounty reward](https://img.shields.io/badge/reward-$500-gold?style=for-the-badge)](https://make.fun)

# gta6-clipper-01

Automated video clipping and AI pitch overlay pipeline built for make.fun.

## Overview

`clip.mjs` is a Node.js (Node 22) utility that takes any input MP4 video (such as raw gameplay footage), trims it, crops it to vertical 9:16 format with center framing, applies a color boost, overlays an attention-grabbing hook title at the top, and dynamically injects the `make.fun` pitch block in the lower third during the final 40% of the clip.

## Requirements

- Node.js v22+
- FFmpeg (with libx264 support)
- DejaVu Sans fonts (`/usr/share/fonts/truetype/dejavu/`)

## Usage

```bash
node clip.mjs <input.mp4> --start <seconds> --dur <seconds> --out <output.mp4> --title "<hook text>"
```

### Example

```bash
node clip.mjs /tmp/testsrc.mp4 --start 5 --dur 25 --out /tmp/output_test.mp4 --title "THE CRAZIEST GTA 6 MOMENT"
```

## Pipeline Steps

1. **Trim:** Cuts input starting from `--start` for `--dur` seconds.
2. **Crop & Scale:** Crops central horizontal band to 9:16 aspect ratio and scales to 1080x1920.
3. **Color Boost:** Enhances saturation (`eq=saturation=1.2`) for visual pop.
4. **Hook Header:** Draws bold uppercase white text with black outline at the top.
5. **Enlarged Pitch Block Overlay:** From 60% duration to the end, overlays an expanded semi-transparent dark container featuring:
   - `MAKE CLIPS LIKE THIS WITH AI`
   - `AND EARN MONEY ON`
   - `MAKE.FUN` (gold, bold)
   - Gold separator accent line
   - `make.fun/bounty/gta6-clipper-01` (gold, bold)
6. **Ending Fade:** Soft fade-to-black over the final 0.8 seconds of the clip.
7. **Encoding:** Renders optimized H.264 video (`yuv420p`, 30 fps, `faststart`).
