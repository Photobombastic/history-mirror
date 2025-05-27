chrome.runtime.sendMessage(
  { type: 'FETCH_COMPARISON', headline: 'Putin and Trump', body: 'This is test text' },
  (res) => {
    console.log('🧠 Response:', res);
    if (res && res.summary) {
      const div = document.createElement('div');
      div.textContent = res.summary;
      Object.assign(div.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#222',
        color: 'white',
        padding: '10px',
        zIndex: 10000,
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        fontFamily: 'sans-serif'
      });
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 5000);
    }
  }
);
