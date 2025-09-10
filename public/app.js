async function loadWorkflow() {
  try {
    let res = await fetch('workflow.json');
    if (!res.ok) {
      res = await fetch('/api/workflow');
    }
    const data = await res.json();
    document.getElementById('workflowName').textContent = data.name || 'Unknown';
    document.getElementById('nodeCount').textContent = data.nodes ? data.nodes.length : 0;
  } catch (e) {
    document.getElementById('workflowName').textContent = 'Unavailable';
    document.getElementById('nodeCount').textContent = '-';
  }
}

async function runAnalysis() {
  try {
    let res = await fetch('/api/run');
    if (!res.ok) throw new Error('Server unavailable');
    const data = await res.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    document.getElementById('lastRun').textContent = new Date().toLocaleString();
    document.getElementById('runStatus').textContent = data.error ? 'Error' : 'Success';
  } catch (err) {
    if (window.N8N_WEBHOOK_URL) {
      try {
        const res = await fetch(window.N8N_WEBHOOK_URL, { method: 'POST' });
        const data = await res.json();
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        document.getElementById('lastRun').textContent = new Date().toLocaleString();
        document.getElementById('runStatus').textContent = data.error ? 'Error' : 'Success';
        return;
      } catch (e) {}
    }
    document.getElementById('runStatus').textContent = 'Error';
  }
}

function initCharts() {
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 7],
        borderColor: '#655cff',
        backgroundColor: 'rgba(101,92,255,0.3)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
  new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
      labels: ['Direct', 'Referral', 'Social'],
      datasets: [{
        data: [55, 25, 20],
        backgroundColor: ['#655cff', '#ff80a4', '#ffd166']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

loadWorkflow();
document.getElementById('runBtn').addEventListener('click', runAnalysis);
initCharts();
