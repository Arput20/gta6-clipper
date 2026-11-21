# CLIP PIPELINE BRIEF — gta6-clipper-01

Build `clip.mjs` (Node 22, standard library + ffmpeg via child_process) in this repository, and test it.

## What it does
`node clip.mjs <input.mp4> --start <seconds> --dur <seconds> --out <output.mp4> --title "<hook text>"`:
1. Trims the input from --start for --dur seconds.
2. Crops to vertical 9:16 (crop the central horizontal band: crop=iw*9/16*ih/? — compute a centered square-ish crop that keeps the action, scale to 1080x1920, watch aspect: crop=ih*9/16:ih:x:0 where x centers on the middle of the frame).
3. Draws an on-screen HOOK at the top for the whole clip: bold white uppercase text with black outline, e.g. the --title argument.
4. From 60% of the clip to the end, overlays the make.fun pitch block in the lower third: a semi-transparent dark rounded box with white text "MAKE CLIPS LIKE THIS WITH AI" / "AND EARN MONEY ON" / big bold "MAKE.FUN" (gold), and a final line "make.fun/bounty/gta6-clipper-01".
5. Adds a subtle zoom-in (scale+zoompan or crop animation) for energy, and slight saturation boost.
6. Renders H.264 yuv420p, 1080x1920, 30fps, AAC not needed (silent ok), faststart, under 60 seconds total.

## Text rendering rules
Use drawtext with fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf (exists) and DejaVuSans.ttf. Escape colons/quotes carefully. Test that no ffmpeg error occurs.

## Test (do this now, no real footage available yet)
Generate a synthetic test clip: `ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=30" -pix_fmt yuv420p /tmp/testsrc.mp4`, then run clip.mjs on it (--start 5 --dur 25 --title "THE CRAZIEST GTA 6 MOMENT"), and verify the output: ffprobe resolution 1080x1920, duration 25, frames non-blank (extract 2 frames and check they differ), pitch text visible (extract a frame at 80% and keep it as /tmp/pitch-frame.png in your report, but do NOT commit /tmp files).

## Also write
- README.md (3 make.fun badge lines FIRST, then description of the tool).
- Keep main.ts and VIDEO.json as they are (starter).

Commit everything with git add -A && git commit -m "Vertical clip pipeline: trim, 9:16 crop, hook, make.fun pitch" (git push comes later; there is no remote yet).
