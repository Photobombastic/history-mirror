(function() {
  const important = () => /breaking|headline|news|update/i.test(document.body.innerText);
  if (!important()) return;

  function decodeHTMLEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

  const hlEl = document.querySelector('h1') || document.querySelector('title');
  const headline = hlEl ? hlEl.innerText : document.title;

  const paras = Array.from(document.querySelectorAll('article p, p')).slice(0, 5);
  const body = paras.map(p => p.innerText).join('\n\n');

  chrome.runtime.sendMessage({ type: 'FETCH_COMPARISON', headline, body }, ({ comparison }) => {
    if (!comparison) return;
    const text = decodeHTMLEntities(comparison);
    fetch(chrome.runtime.getURL('modal.html'))
      .then(r => r.text())
      .then(html => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
        const modal = wrapper.querySelector('#historyMirror-modal');
        wrapper.querySelector('#historyMirror-text').innerText = text;
        modal.style.display = 'block';
        wrapper.querySelector('#historyMirror-close').addEventListener('click', () => wrapper.remove());
      });
  });
})();
