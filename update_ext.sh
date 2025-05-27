#!/usr/bin/env bash
set -euo pipefail

# --- background.js ---
cat > background.js << 'EOB'
import { API_KEY } from './secrets.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_COMPARISON') {
    const { headline, body } = message;

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${API_KEY}\`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are HistoryMirror: a friendly expert who gives concise historical parallels in a “this feels like…” tone.'
          },
          {
            role: 'user',
            content: \`Headline: \${headline}\n\nArticle:\n\${body}\n\nIn 1–2 punchy sentences, say “This reminds me of…” or “We’ve seen this before…” comparing underlying causes, tensions or outcomes.\`
          }
        ],
        max_tokens: 60,
        temperature: 0.7
      })
    })
      .then(res => res.json())
      .then(data => {
        const comparison = data.choices?.[0]?.message?.content?.trim() || null;
        sendResponse({ summary: comparison });
      })
      .catch(err => {
        console.error('HistoryMirror AI error:', err);
        sendResponse({ summary: null });
      });

    return true;
  }
});
EOB

# --- contentScript.js ---
cat > contentScript.js << 'EOC'
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
EOC

# Commit the updates
git add background.js contentScript.js
git commit -m "fix: GPT API integration + async sendResponse + entity decoding"

echo "✅ background.js & contentScript.js have been updated and committed. Reload your unpacked extension to test."
