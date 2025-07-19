const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 80;

// Get backend URL from environment variable
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://fuckupboard-backend:8080';

// Prometheus metrics setup
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Business metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const fuckupsTotal = new promClient.Counter({
  name: 'fuckups_total',
  help: 'Total number of fuckups created'
});

const fuckupsLiked = new promClient.Counter({
  name: 'fuckups_liked_total',
  help: 'Total number of fuckup likes'
});

const fuckupsUnliked = new promClient.Counter({
  name: 'fuckups_unliked_total',
  help: 'Total number of fuckup unlikes'
});

const activeUsers = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of active users'
});

const backendHealth = new promClient.Gauge({
  name: 'backend_health',
  help: 'Backend health status (1 = healthy, 0 = unhealthy)'
});

// Register metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);
register.registerMetric(fuckupsTotal);
register.registerMetric(fuckupsLiked);
register.registerMetric(fuckupsUnliked);
register.registerMetric(activeUsers);
register.registerMetric(backendHealth);

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Request tracking middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API proxy routes - all API calls go through the server
app.get('/api/list', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/list`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying GET /list:', error.message);
    res.status(500).json({ error: 'Failed to fetch fuckups' });
  }
});

app.post('/api/add', async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/add`, req.body);
    fuckupsTotal.inc();
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying POST /add:', error.message);
    res.status(500).json({ error: 'Failed to add fuckup' });
  }
});

app.put('/api/like', async (req, res) => {
  try {
    const { id } = req.query;
    const response = await axios.put(`${BACKEND_URL}/like?id=${id}`);
    fuckupsLiked.inc();
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying PUT /like:', error.message);
    res.status(500).json({ error: 'Failed to like fuckup' });
  }
});

app.delete('/api/unlike', async (req, res) => {
  try {
    const { id } = req.query;
    const response = await axios.delete(`${BACKEND_URL}/unlike?id=${id}`);
    fuckupsUnliked.inc();
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying DELETE /unlike:', error.message);
    res.status(500).json({ error: 'Failed to unlike fuckup' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check backend health
    await axios.get(`${BACKEND_URL}/list`);
    backendHealth.set(1);
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      backend: 'healthy'
    });
  } catch (error) {
    backendHealth.set(0);
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      backend: 'unhealthy'
    });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`API proxy routes: /api/*`);
}); 