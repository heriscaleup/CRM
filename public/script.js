const steps = ['Data Collection', 'AI Processing', 'Analysis', 'Storage'];
const logEl = document.getElementById('log');
const outputEl = document.getElementById('output');

function setStep(index) {
  const items = document.querySelectorAll('#progressSteps li');
  items.forEach((li, i) => li.classList.toggle('active', i <= index));
}

function log(message) {
  logEl.textContent += message + '\n';
}

function displayResults(data) {
  outputEl.textContent = JSON.stringify(data, null, 2);
  const summaryEl = document.getElementById('summary');
  summaryEl.innerHTML = `<strong>Grade:</strong> ${data.performanceGrade || '-'}<br>` +
    `<strong>Revenue Impact:</strong> ${data.revenueImpact || '-'}<br>` +
    `<strong>Risk Level:</strong> ${data.riskLevel || '-'}<br>` +
    `<strong>ROI Forecast:</strong> ${data.roiForecast || '-'}`;

  const channelsEl = document.getElementById('channels');
  channelsEl.innerHTML = '<h3>Channels</h3><ul>' +
    (data.channels || []).map(c => `<li>${c.name}: ${c.score} (${c.efficiency})</li>`).join('') +
    '</ul>';

  const alertsEl = document.getElementById('alerts');
  alertsEl.innerHTML = '<h3>Alerts</h3><ul>' +
    (data.alerts || []).map(a => `<li><strong>${a.title}</strong> - ${a.message}</li>`).join('') +
    '</ul>';

  const recEl = document.getElementById('recommendations');
  recEl.innerHTML = '<h3>Recommendations</h3><ul>' +
    (data.recommendations || []).map(r => `<li><strong>${r.priority}</strong> - ${r.title}: ${r.description}</li>`).join('') +
    '</ul>';

  document.getElementById('sheetsLink').href = CONFIG.GOOGLE_SHEETS_URLS.main;
}

async function runAnalysis() {
  logEl.textContent = '';
  outputEl.textContent = '';
  displayResults({});
  setStep(-1);

  try {
    for (let i = 0; i < steps.length - 1; i++) {
      setStep(i);
      log(steps[i] + '...');
      await new Promise(r => setTimeout(r, 500));
    }

    let res;
    try {
      res = await fetch('/api/run');
      if (!res.ok) throw new Error('Server unavailable');
    } catch (e) {
      if (CONFIG.N8N_WEBHOOK_URL) {
        res = await fetch(CONFIG.N8N_WEBHOOK_URL, { method: 'POST' });
      } else { throw e; }
    }
    const data = await res.json();
    setStep(steps.length - 1);
    log('Storage...');
    displayResults(data);
    log('Success');
  } catch (err) {
    log('Error: ' + err.message);
    if (CONFIG.APP_SETTINGS.DEMO_MODE) {
      log('Demo mode: using mock data');
      setStep(steps.length - 1);
      displayResults(mockData);
    } else {
      outputEl.textContent = err.message;
    }
  }
}

const mockData = {
  performanceGrade: 'B+',
  revenueImpact: '+20-35%',
  riskLevel: 'Medium',
  roiForecast: '+25% in 90 days',
  channels: [
    { name: 'Google Ads', score: 85, efficiency: 'High' },
    { name: 'Organic Search', score: 72, efficiency: 'Excellent' }
  ],
  alerts: [
    { type: 'critical', title: 'High Churn Risk', message: 'Retention dropping in core segment' }
  ],
  recommendations: [
    { priority: 'high', title: 'Optimize Budget', description: 'Shift spend to top performing campaigns' }
  ]
};

document.getElementById('runBtn').addEventListener('click', runAnalysis);
