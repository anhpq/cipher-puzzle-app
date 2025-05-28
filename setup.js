// setup.js
// Script to create the folder structure for the Cipher Puzzle Game project

const fs = require('fs');
const path = require('path');

const directories = [
  "backend/src/controllers",
  "backend/src/models",
  "backend/src/routes",
  "backend/src/config",
  "backend/src/middleware",
  "backend/src/utils",
  "backend/public",
  "frontend/src/components",
  "frontend/src/pages",
  "frontend/src/services",
  "frontend/src/utils",
  "frontend/src/hooks",
  "frontend/src/context",
  "frontend/src/styles",
  "frontend/public",
  "database/migrations",
  "docs"
];

const files = [
  "backend/src/app.js",
  "backend/src/server.js",
  "backend/.env",
  "backend/README.md",
  "frontend/src/App.jsx",
  "frontend/src/index.jsx",
  "frontend/README.md",
  "database/schema.sql",
  "database/seed.sql",
  "docs/specifications.txt",
  "docs/api_reference.md",
  "docs/project_overview.md"
];

// Function to create directories recursively
directories.forEach(dir => {
  const targetDir = path.join(__dirname, dir);
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${dir}`);
});

// Function to create empty files
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  // Create an empty file (or overwrite if it exists)
  fs.writeFileSync(filePath, '', { flag: 'w' });
  console.log(`Created file: ${file}`);
});
