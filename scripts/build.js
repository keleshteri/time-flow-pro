const fs = require('fs');
const path = require('path');

// Clean and create dist directory
function cleanDist() {
  const distDir = path.join(__dirname, '../dist');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(path.join(distDir, 'styles'), { recursive: true });
}

// Copy files
function copyFiles() {
  const srcDir = path.join(__dirname, '../src');
  const distDir = path.join(__dirname, '../dist');
  
  // Copy index.html
  fs.copyFileSync(
    path.join(srcDir, 'index.html'),
    path.join(distDir, 'index.html')
  );
  
  // Copy manifest.json
  fs.copyFileSync(
    path.join(srcDir, 'manifest.json'),
    path.join(distDir, 'manifest.json')
  );
  
  // Copy CSS files
  fs.copyFileSync(
    path.join(srcDir, 'styles/main.css'),
    path.join(distDir, 'styles/main.css')
  );
  
  console.log('✅ Assets copied successfully');
}

// Main function
function main() {
  try {
    cleanDist();
    copyFiles();
  } catch (error) {
    console.error('❌ Build script failed:', error);
    process.exit(1);
  }
}

main();