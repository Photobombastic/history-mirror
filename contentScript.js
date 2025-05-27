chrome.runtime.sendMessage({ type: "PAGE_SUMMARY", text: document.body.innerText.slice(0, 500) });
console.log('📡 Content script injected on', window.location.href);
