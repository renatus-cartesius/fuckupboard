const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

// Get backend URL from environment variable
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://fuckupboard-backend:8080';

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

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
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying DELETE /unlike:', error.message);
    res.status(500).json({ error: 'Failed to unlike fuckup' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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