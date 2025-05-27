# HistoryMirror

HistoryMirror is a Chrome Extension that injects AI-powered historical context into the news you're reading. It analyzes headlines and article text in real time, and surfaces historical parallels—so you know when history is repeating itself.

## How it works

- Extracts headline and article body from the page
- Sends it to an AI backend for historical comparison
- Displays a short historical insight in a pop-up modal

## Features

- Minimal, non-intrusive UI
- Real-time AI-generated insights
- Works on most major news sites

## Built with

- JavaScript (MV3 Chrome Extensions API)
- OpenAI (via Replit endpoint)
- Chrome’s scripting and messaging APIs

## Installation

1. Clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the folder
5. Open a news article and wait for the insight to appear

## License

MIT
