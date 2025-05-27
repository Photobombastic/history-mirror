/** This placeholder will be replaced by deploy.sh **/
const API_KEY = '__API_KEY__';

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type !== 'FETCH_COMPARISON') return;
  const { headline, body } = msg;

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      Authorization:\`Bearer \${API_KEY}\`
    },
    body: JSON.stringify({
      model:'gpt-4o-mini',
      messages:[
        { role:'system', content:'You are HistoryMirror: a friendly expert giving concise "this feels like…" parallels.' },
        { role:'user', content:\`Headline: \${headline}\n\nArticle:\n\${body}\n\nIn 1–2 punchy sentences, say "This reminds me of…" comparing causes, tensions or outcomes.\` }
      ],
      max_tokens:60,
      temperature:0.7
    })
  })
    .then(r=>r.json())
    .then(d=>{
      const c = d.choices?.[0]?.message?.content?.trim()||'';
      respond({ summary: c });
    })
    .catch(e=>{
      console.error('HistoryMirror AI error',e);
      respond({ summary: '' });
    });

  return true;
});
