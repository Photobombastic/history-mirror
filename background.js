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

    return true;  // keep channel open for async sendResponse
  }
});
