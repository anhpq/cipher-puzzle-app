// preview.js
const { exec } = require('child_process');

const port = process.env.PORT || 4173;

const cmd = `npx vite preview --port ${port} --host`;

console.log(`Starting vite preview server on port ${port}...`);

const viteProcess = exec(cmd);

viteProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

viteProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

viteProcess.on('close', (code) => {
  console.log(`Vite preview process exited with code ${code}`);
  process.exit(code);
});
