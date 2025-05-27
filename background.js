import { API_KEY } from './secrets.js';

// 1) Inject contentScript.js into every tab when it finishes loading
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['contentScript.js']
    });
  }
});

// 2) Listen for our content script and call OpenAI
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'FETCH_COMPARISON') return;
  const { headline, body } = msg;

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
          content: 'You are HistoryMirror: a friendly expert who gives concise "this feels like..." historical parallels.'
        },
        {
          role: 'user',
          content: \`Headline: \${headline}\n\nArticle:\n\${body}\n\nIn 1–2 punchy sentences, say “This reminds me of…” or “We’ve seen this before…” comparing causes, tensions or outcomes.\`
        }
      ],
      max_tokens: 60,
      temperature: 0.7
    })
  })
    .then(r => r.json())
    .then(data => {
      const comparison = data.choices?.[0]?.message?.content?.trim() || '';
      sendResponse({ summary: comparison });
    })
    .catch(err => {
      console.error('HistoryMirror AI error:', err);
      sendResponse({ summary: '' });
    });

  return true; // keep channel open
});
