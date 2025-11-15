# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the API key

## 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and paste your API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

## 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 5. First Use

1. Allow microphone access when prompted
2. Select your input and output languages
3. Click "Start" and begin speaking
4. Watch your speech get translated in real-time!

## Browser Requirements

- **Best Experience**: Chrome, Edge, Safari
- **Required**: HTTPS in production (for microphone access)
- **Not Supported**: Firefox (lacks Web Speech API)

## Troubleshooting

**Microphone not working?**
- Check browser permissions
- Ensure HTTPS connection
- Try Chrome or Edge

**Translation errors?**
- Verify API key in `.env`
- Check API quota limits
- Ensure stable internet connection

**Need help?**
- Check README.md for detailed documentation
- Open an issue on GitHub
