chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_COMPARISON') {
    const { headline, body } = message;
    fetch('https://7364ea30-75ec-42a8-b81d-335235e1cfef-00-2edol9fg5c1s9.kirk.replit.dev/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headline, body })
    })
      .then(res => res.json())
      .then(data => {
        sendResponse({ comparison: data.comparison });
      })
      .catch(err => {
        console.error('HistoryMirror AI error:', err);
        sendResponse({ comparison: null });
      });
  }
  return true;
});
