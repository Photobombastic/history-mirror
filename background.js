import { API_KEY } from './secrets.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_COMPARISON') {
    const { headline, body } = message;

    fetch('https://api.yourservice.com/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ headline, body })
    })
      .then(res => res.json())
      .then(data => {
        sendResponse({ summary: data.comparison });
      })
      .catch(err => {
        console.error('HistoryMirror AI error:', err);
        sendResponse({ summary: null });
      });

    return true; // allow async sendResponse
  }
});
