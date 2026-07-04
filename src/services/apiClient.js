import axios from 'axios';

// Simple axios client — no Firebase auth required
// All AI calls go directly to the Gemini API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_FUNCTIONS_URL || 'http://localhost:5001/mock-project-id/us-central1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

export default apiClient;
