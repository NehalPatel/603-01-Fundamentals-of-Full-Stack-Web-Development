// Minimal HTTP server for Unit 2 topics
const http = require('http');
const server = http.createServer((req, res) => {
  // Simple routing
  if (req.url === '/hello' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from Node HTTP server' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});
server.listen(3000, () => console.log('Server on http://localhost:3000'));
