chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_COMPARISON') {
    console.log('🧠 Background received:', message);
    sendResponse({ summary: "Yep, history repeated itself!" });
    return false; // <- changed from true to false
  }
});
