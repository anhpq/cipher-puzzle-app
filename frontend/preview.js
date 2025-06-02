const { exec } = require('child_process');

const port = process.env.PORT || 4173;
exec(`npx vite preview --port ${port} --host`, (err, stdout, stderr) => {
  if (err) {
    console.error(stderr);
    process.exit(1);
  }
  console.log(stdout);
});