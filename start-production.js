const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to load environment variables from .env file
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Environment file ${filePath} not found`);
    return;
  }
  
  const envContent = fs.readFileSync(filePath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
}

// Load environment variables
console.log('Loading environment variables...');
loadEnvFile('.env');
loadEnvFile('.env.local');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = '3006';

console.log('Environment variables loaded:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT: ${process.env.PORT}`);
console.log(`- USE_GEORGE_KEY: ${process.env.USE_GEORGE_KEY}`);
console.log(`- OPENAI_API_KEY present: ${process.env.OPENAI_API_KEY ? 'true' : 'false'}`);
console.log(`- OPENAI_MODEL: ${process.env.OPENAI_MODEL}`);

// Ensure public assets are available for the standalone server
const publicSrc = path.join(process.cwd(), 'public');
const publicDest = path.join(process.cwd(), '.next/standalone/public');

if (fs.existsSync(publicSrc) && !fs.existsSync(publicDest)) {
  console.log('Copying public assets to standalone build...');
  
  // Create the public directory in standalone if it doesn't exist
  fs.mkdirSync(publicDest, { recursive: true });
  
  // Copy all files from public to standalone/public
  const copyRecursive = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyRecursive(publicSrc, publicDest);
  console.log('✅ Public assets copied to standalone build');
}

// Start the server
console.log('Starting production server...');
const serverProcess = spawn('node', ['.next/standalone/server.js'], {
  stdio: 'inherit',
  env: process.env
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
}); 