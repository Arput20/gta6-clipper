import { spawn } from 'node:child_process';
import {existsSync} from 'node:fs';

function parseArgs() {
  const args = process.argv.slice(2);
  let input = '';
  let start = 0;
  let dur = 15;
  let out = 'output.mp4';
  let title = 'GTA 6 MOMENT';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--start' && args[i + 1]) {
      start = parseFloat(args[++i]);
    } else if (arg === '--dur' && args[i + 1]) {
      dur = parseFloat(args[++i]);
    } else if (arg === '--out' && args[i + 1]) {
      out = args[++i];
    } else if (arg === '--title' && args[i + 1]) {
      title = args[++i];
    } else if (!arg.startsWith('-') && !input) {
      input = arg;
    }
  }

  return { input, start, dur, out, title };
}

function escapeDrawtext(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "'\\''")
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%');
}

async function main() {
  const { input, start, dur, out, title } = parseArgs();

  if (!input) {
    console.error('Usage: node clip.mjs <input.mp4> --start <seconds> --dur <seconds> --out <output.mp4> --title "<hook text>"');
    process.exit(1);
  }

  if (!existsSync(input)) {
    console.error(`Error: Input file "${input}" does not exist.`);
    process.exit(1);
  }

  const pitchStart = dur * 0.6;
  const escapedTitle = escapeDrawtext(title.toUpperCase());

  // Filtergraph construction:
  // 1. Trim (-ss start -t dur)
  // 2. Crop 9:16: crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920
  // 3. Eq: saturation=1.2
  // 4. Hook text at top: drawtext
  // 5. Pitch block from 60% of clip: drawbox + 4 drawtext lines
  const vf = [
    'crop=ih*9/16:ih:(iw-ih*9/16)/2:0',
    'scale=1080:1920',
    'eq=saturation=1.2',
    `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='${escapedTitle}':fontcolor=white:fontsize=56:borderw=4:bordercolor=black:x=(w-text_w)/2:y=120`,
    `drawbox=enable='gte(t,${pitchStart})':x=90:y=1200:w=900:h=500:color=black@0.75:t=fill`,
    `drawtext=enable='gte(t,${pitchStart})':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='MAKE CLIPS LIKE THIS WITH AI':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=1240`,
    `drawtext=enable='gte(t,${pitchStart})':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='AND EARN MONEY ON':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=1300`,
    `drawtext=enable='gte(t,${pitchStart})':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='MAKE.FUN':fontcolor=gold:fontsize=64:x=(w-text_w)/2:y=1370`,
    `drawtext=enable='gte(t,${pitchStart})':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='make.fun/bounty/gta6-clipper-01':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=1480`
  ].join(',');

  const ffmpegArgs = [
    '-y',
    '-ss', String(start),
    '-t', String(dur),
    '-i', input,
    '-vf', vf,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-movflags', '+faststart',
    out
  ];

  console.log(`Running ffmpeg with args:`, ffmpegArgs.join(' '));

  await new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', ffmpegArgs, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully generated ${out}`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
