(function() {
  console.log('📡 HistoryMirror injected on', location.href);

  function decodeHTMLEntities(t) {
    const txt = document.createElement('textarea');
    txt.innerHTML = t;
    return txt.value;
  }

  const h1 = document.querySelector('h1');
  const headline = h1 ? h1.innerText : document.title;
  const paras = Array.from(document.querySelectorAll('article p, p')).slice(0, 5);
  const body = paras.map(p => p.innerText).join('\\n\\n');

  chrome.runtime.sendMessage(
    { type: 'FETCH_COMPARISON', headline, body },
    ({ summary }) => {
      if (!summary) return;
      const text = decodeHTMLEntities(summary);

      fetch(chrome.runtime.getURL('modal.html'))
        .then(r => r.text())
        .then(html => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          document.body.appendChild(wrapper);
          wrapper.querySelector('#historyMirror-text').innerText = text;
          wrapper.querySelector('#historyMirror-modal').style.display = 'block';
          wrapper.querySelector('#historyMirror-close')
            .addEventListener('click', () => wrapper.remove());
        });
    }
  );
})();
