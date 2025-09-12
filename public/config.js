window.CONFIG = {
  N8N_WEBHOOK_URL: window.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook',
  GOOGLE_SHEETS_URLS: {
    main: 'https://docs.google.com/spreadsheets/d/your-sheet-id'
  },
  APP_SETTINGS: {
    DEMO_MODE: true,
    REFRESH_INTERVAL: 10000,
    REQUEST_TIMEOUT: 30000
  },
  FEATURES: {
    REALTIME_MONITORING: false,
    ADVANCED_ANALYTICS: true,
    NOTIFICATIONS: true
  }
};
