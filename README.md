# Marketing Analytics Dashboard

Web interface to trigger an n8n workflow for marketing data analysis. Provides progress tracking, log output and a results dashboard with executive summary, channel performance and recommendations.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.sample` to `.env` and set `N8N_WEBHOOK_URL`.
3. For static hosting (GitHub Pages), edit `public/config.js` to configure `CONFIG.N8N_WEBHOOK_URL` and other settings.
4. Start the server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000 and click **Jalankan Analisis**.

## Features
- Trigger n8n workflow via webhook
- Progress bar with four execution stages
- Real-time log display and raw JSON output
- Results dashboard with summary, channel scores, alerts and recommendations
- Demo mode using mock data when no backend is available
