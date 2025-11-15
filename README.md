# ⚡ Lightning SimulWhispe

Real-Time Speech Translator Web App powered by **Gemini AI** and **Web Speech API**.

## 🌟 Features

### Core Features
- **Real-time Speech Recognition**: Converts your speech to text instantly using the Web Speech API
- **AI-Powered Translation**: Leverages Google's Gemini AI model for accurate, context-aware translations
- **Multi-Language Support**: Supports 30+ languages including English, Spanish, French, German, Japanese, Chinese, Arabic, and more
- **Text-to-Speech Output**: Optionally reads translated text aloud using Web Speech Synthesis API
- **Live Status Indicators**: Visual feedback for listening, translating, and speaking states
- **Translation History**: Automatically saves your translation history locally
- **Export/Import**: Export your translation history as JSON for backup or sharing

### Advanced Features
- **Bi-directional Mode**: Quickly swap languages for two-way conversations
- **Quality Feedback**: Rate translation quality and provide feedback
- **Rate Limiting**: Built-in API rate limiting to prevent quota exhaustion
- **Error Handling**: Comprehensive error notifications and recovery
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatically adapts to system theme preferences

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (React 18)
- **Language**: TypeScript
- **AI Translation**: Google Gemini AI (gemini-pro model)
- **Speech Recognition**: Web Speech API (browser native)
- **Text-to-Speech**: Web Speech Synthesis API (browser native)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn**: Package manager
- **Gemini API Key**: Free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Modern Browser**: Chrome, Edge, or Safari (for Web Speech API support)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/pasco78/Lightning-SimulWhispe.git
cd Lightning-SimulWhispe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
RATE_LIMIT_RPM=60
DEBUG=false
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy your API key and paste it in the `.env` file

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📖 Usage Guide

### Basic Usage

1. **Select Languages**: Choose your input language (what you'll speak) and target language (what you want to translate to)
2. **Grant Microphone Permission**: Click "Start" and allow microphone access when prompted
3. **Start Speaking**: Speak clearly into your microphone
4. **View Translation**: Your speech will be transcribed and translated in real-time
5. **Listen to Translation**: The translated text will be spoken aloud automatically (if enabled)

### Advanced Features

#### Bi-directional Mode
- Click the "Bi-directional" button to enable instant language swapping
- Perfect for two-way conversations

#### Translation History
- All translations are automatically saved
- Click the speaker icon to replay any translation
- Remove individual items with the X button
- Export entire history with the "Export" button
- Clear all history with the "Clear" button

#### Feedback
- After a translation, click "Rate Translation Quality"
- Provide a 1-5 star rating
- Optionally add comments about translation accuracy

## 🏗️ Architecture

### Project Structure

```
Lightning-SimulWhispe/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── translate/
│   │   │       └── route.ts          # Gemini API endpoint
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Main application page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ControlPanel.tsx          # Control buttons
│   │   ├── ErrorNotification.tsx     # Error display
│   │   ├── FeedbackForm.tsx          # Quality feedback form
│   │   ├── LanguageSelector.tsx      # Language dropdown
│   │   ├── StatusBar.tsx             # Status indicators
│   │   ├── TranslationDisplay.tsx    # Translation output
│   │   └── TranslationHistory.tsx    # History list
│   ├── services/
│   │   ├── speechRecognition.ts      # Web Speech API wrapper
│   │   └── textToSpeech.ts           # Speech synthesis wrapper
│   ├── utils/
│   │   ├── rateLimiter.ts            # API rate limiting
│   │   └── translationHistory.ts     # Local storage manager
│   ├── config/
│   │   └── languages.ts              # Supported languages
│   └── types/
│       └── index.ts                  # TypeScript definitions
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.example
└── README.md
```

### Data Flow

1. **Speech Input**: User speaks → Web Speech API → Text transcript
2. **Translation**: Text → Next.js API Route → Gemini AI → Translated text
3. **Speech Output**: Translated text → Web Speech Synthesis → Audio output
4. **History**: Translation → Local Storage → Translation History UI

### API Endpoints

#### `POST /api/translate`

Translates text using Gemini AI.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "sourceLang": "en",
  "targetLang": "es"
}
```

**Response:**
```json
{
  "translatedText": "Hola, ¿cómo estás?",
  "sourceLang": "en",
  "targetLang": "es",
  "timestamp": 1699999999999,
  "latency": 234
}
```

**Rate Limiting:**
- Default: 60 requests per minute
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

#### `GET /api/translate`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "Lightning SimulWhispe Translation API",
  "timestamp": 1699999999999
}
```

## 🌍 Supported Languages

The application supports 30+ languages:

- Arabic (ar)
- Bengali (bn)
- Chinese Simplified (zh)
- Chinese Traditional (zh-TW)
- Czech (cs)
- Danish (da)
- Dutch (nl)
- English (en)
- Finnish (fi)
- French (fr)
- German (de)
- Greek (el)
- Hebrew (he)
- Hindi (hi)
- Indonesian (id)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Malay (ms)
- Norwegian (no)
- Polish (pl)
- Portuguese (pt)
- Romanian (ro)
- Russian (ru)
- Spanish (es)
- Swedish (sv)
- Thai (th)
- Turkish (tr)
- Ukrainian (uk)
- Vietnamese (vi)

## 🔒 Privacy & Security

- **Local Processing**: Speech recognition and synthesis happen entirely in your browser
- **No Data Storage**: Translations are only stored locally in your browser
- **Secure API**: Gemini API key is stored server-side, never exposed to the client
- **Rate Limiting**: Prevents API abuse and quota exhaustion
- **HTTPS Required**: For microphone access, the app must be served over HTTPS in production

## ⚡ Performance Considerations

### Latency
- Speech recognition: Real-time (browser native)
- Translation: Typically 200-500ms (depends on Gemini API response time)
- Text-to-speech: Real-time (browser native)

### Optimization Tips
1. **API Key**: Keep your Gemini API key secure
2. **Rate Limits**: Monitor usage to stay within free tier limits
3. **Browser Support**: Use Chrome or Edge for best Web Speech API performance
4. **Network**: Stable internet connection recommended for API calls

### Gemini API Limits
- **Free Tier**: 60 requests per minute
- **Character Limit**: 5000 characters per translation (configurable)
- **Cost**: Check [Google AI Pricing](https://ai.google.dev/pricing) for current rates

## 🐛 Troubleshooting

### Microphone Not Working
- Ensure you've granted microphone permission in your browser
- Check that your microphone is connected and working
- Try using Chrome or Edge (best Web Speech API support)
- Make sure the site is served over HTTPS (required for microphone access)

### Translation Errors
- Verify your Gemini API key is correct in `.env`
- Check your API quota hasn't been exceeded
- Ensure your internet connection is stable
- Look for error messages in the browser console

### Browser Compatibility
- **Recommended**: Chrome 25+, Edge 79+, Safari 14.1+
- **Limited Support**: Firefox (no Web Speech API support)
- Check [Can I Use](https://caniuse.com/speech-recognition) for current browser support

### Text-to-Speech Not Working
- Some languages may have limited voice support
- Check your browser's text-to-speech settings
- Try a different browser if voices are missing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing the translation API
- **Web Speech API**: For browser-based speech recognition and synthesis
- **Next.js**: For the excellent React framework
- **Lucide Icons**: For beautiful, consistent icons

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Offline translation support (local models)
- [ ] Custom voice selection for TTS
- [ ] Translation confidence scores
- [ ] Multiple translation service providers (fallback options)
- [ ] Conversation mode with automatic speaker detection
- [ ] Cloud sync for translation history
- [ ] Mobile app version (React Native)
- [ ] Browser extension

---

**Built with ❤️ using Next.js and Gemini AI**

*Last updated: November 2025*
