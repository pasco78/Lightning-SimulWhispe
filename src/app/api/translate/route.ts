// Next.js API route for translation using Gemini AI

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiRateLimiter } from '@/utils/rateLimiter';

// Initialize Gemini AI
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  return new GoogleGenerativeAI(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = apiRateLimiter.check(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, sourceLang, targetLang } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing text parameter' },
        { status: 400 }
      );
    }

    if (!sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing sourceLang or targetLang parameter' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create translation prompt
    const prompt = `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}.
Only provide the translation without any additional explanation, notes, or commentary.

Text to translate:
${text}

Translation:`;

    // Call Gemini API
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();
    const latency = Date.now() - startTime;

    // Return successful response
    return NextResponse.json(
      {
        translatedText,
        sourceLang,
        targetLang,
        timestamp: Date.now(),
        latency,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (error: any) {
    console.error('Translation error:', error);

    // Handle specific errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API configuration error. Please check server configuration.' },
        { status: 500 }
      );
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Translation failed',
        details: process.env.DEBUG === 'true' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Lightning SimulWhispe Translation API',
    timestamp: Date.now(),
  });
}
