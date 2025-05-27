const headline = document.title;
const body = document.body.innerText.slice(0, 1000);

chrome.runtime.sendMessage(
  { type: 'FETCH_COMPARISON', headline, body },
  (res) => {
    console.log('<0001f9e0> Response:', res);
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
        fontFamily: 'sans-serif',
        maxWidth: '300px'
      });
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 7000);
    }
  }
);
