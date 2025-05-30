const http = require('http');

const postData = JSON.stringify({
  action: "test",
  currentPhaseName: "Strategy & Goals",
  industry: "Property/Real Estate",
  history: []
});

const options = {
  hostname: 'localhost',
  port: 3006,
  path: '/api/scorecard-ai',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing API endpoint...');
console.log('Request data:', postData);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.write(postData);
req.end();

// Set a timeout
setTimeout(() => {
  console.log('Test completed');
  process.exit(0);
}, 10000); 