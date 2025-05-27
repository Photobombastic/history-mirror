(function() {
  // Only run on “news-like” pages
  if (!/\\b(breaking|headline|news|update)\\b/i.test(document.body.innerText)) return;

  // Decode any HTML entities
  function decodeHTMLEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

  // Grab headline
  const hlEl = document.querySelector('h1') || document.querySelector('title');
  const headline = hlEl ? hlEl.innerText : document.title;

  // Grab first 5 paragraphs
  const paras = Array.from(document.querySelectorAll('article p, p')).slice(0, 5);
  const body = paras.map(p => p.innerText).join('\\n\\n');

  // Send to background for comparison
  chrome.runtime.sendMessage(
    { type: 'FETCH_COMPARISON', headline, body },
    ({ summary }) => {
      if (!summary) return;
      const text = decodeHTMLEntities(summary);

      // Inject modal
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
