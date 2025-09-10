# CRM Dashboard

Simple web interface to trigger the existing n8n workflow and display its output.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.sample` to `.env` and fill in your `N8N_WEBHOOK_URL`.
3. Start the server:
   ```bash
   npm start
   ```
4. Open http://localhost:3000 in your browser and use the **Run Analysis** button.

## Development
- The n8n workflow configuration is stored in `workflow.json` and exposed at `/api/workflow`.
- API endpoint `/api/run` posts to `N8N_WEBHOOK_URL` and returns the result.

