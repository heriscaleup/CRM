require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/run', async (req, res) => {
  if (!N8N_WEBHOOK_URL) {
    return res.status(500).json({ error: 'N8N_WEBHOOK_URL not configured' });
  }
  try {
    const response = await axios.post(N8N_WEBHOOK_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/workflow', (req, res) => {
  const workflowPath = path.join(__dirname, 'workflow.json');
  try {
    const data = fs.readFileSync(workflowPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Unable to load workflow' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
