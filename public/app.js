async function loadWorkflow() {
  try {
    let res = await fetch('workflow.json');
    if (!res.ok) {
      res = await fetch('/api/workflow');
    }
    const data = await res.json();
    const wfName = data.name || data.meta?.name || data.nodes?.[0]?.name || 'Unknown';
    document.getElementById('workflowName').textContent = wfName;
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

    if (data.summary) {
      document.getElementById('totalUsers').textContent = data.summary.totalUsers ?? '-';
      document.getElementById('totalSessions').textContent = data.summary.totalSessions ?? '-';
      document.getElementById('avgBounceRate').textContent = data.summary.avgBounceRate ?? '-';
    }

    if (data.insights && lineChart && doughnutChart) {
      const topSources = data.insights.topSources || [];
      lineChart.data.labels = topSources.map(s => s.name);
      lineChart.data.datasets[0].data = topSources.map(s => s.sessions || 0);
      lineChart.update();

      const topPages = data.insights.topPages || [];
      doughnutChart.data.labels = topPages.map(p => p.name);
      doughnutChart.data.datasets[0].data = topPages.map(p => p.pageviews || 0);
      doughnutChart.update();
    }
  } catch (err) {
    if (window.N8N_WEBHOOK_URL) {
      try {
        const res = await fetch(window.N8N_WEBHOOK_URL, { method: 'POST' });
        const data = await res.json();
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        document.getElementById('lastRun').textContent = new Date().toLocaleString();
        document.getElementById('runStatus').textContent = data.error ? 'Error' : 'Success';
        if (data.summary) {
          document.getElementById('totalUsers').textContent = data.summary.totalUsers ?? '-';
          document.getElementById('totalSessions').textContent = data.summary.totalSessions ?? '-';
          document.getElementById('avgBounceRate').textContent = data.summary.avgBounceRate ?? '-';
        }
        if (data.insights && lineChart && doughnutChart) {
          const topSources = data.insights.topSources || [];
          lineChart.data.labels = topSources.map(s => s.name);
          lineChart.data.datasets[0].data = topSources.map(s => s.sessions || 0);
          lineChart.update();
          const topPages = data.insights.topPages || [];
          doughnutChart.data.labels = topPages.map(p => p.name);
          doughnutChart.data.datasets[0].data = topPages.map(p => p.pageviews || 0);
          doughnutChart.update();
        }
        return;
      } catch (e) {}
    }
    document.getElementById('output').textContent = err.message;
    document.getElementById('runStatus').textContent = 'Error';
  }
}

let lineChart, doughnutChart;
function initCharts() {
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Sessions',
        data: [],
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
  doughnutChart = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#655cff', '#ff80a4', '#ffd166', '#4cd137', '#2e86de']
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
