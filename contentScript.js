chrome.runtime.sendMessage({ type: 'FETCH_COMPARISON', headline: 'Putin and Trump', body: 'This is test text' }, (res) => console.log('🧠 Response:', res));
