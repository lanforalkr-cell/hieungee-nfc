/**
 * gemini.js — Google Gemini API integration
 *
 * Provides text & image generation for Hee-eung-ee content.
 *
 * Usage:
 *   GeminiAPI.generateText('prompt')          → text string
 *   GeminiAPI.generateImage('prompt')         → { text, images: [{ dataUrl, data, mimeType }] }
 *   GeminiAPI.generateCharacter('description') → character image result
 *   GeminiAPI.generateLessonContent('topic')  → { korean, romanized, english, tip }
 *   GeminiAPI.testConnection()                → { success, message }
 *
 * NOTE: API key is client-side for prototype use.
 *       For production, proxy through a backend server.
 */
const GeminiAPI = (() => {
  const CONFIG = {
    apiKey: 'AIzaSyDBgOnCTmM2Z_OGpPNtV6WncehPTmDvGRM',
    textModel: 'gemini-2.5-flash',
    imageModel: 'gemini-2.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  };

  /**
   * Generate text content
   */
  async function generateText(prompt, options = {}) {
    const model = options.model || CONFIG.textModel;
    const url = `${CONFIG.baseUrl}/models/${model}:generateContent?key=${CONFIG.apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 1024,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Generate image (uses Gemini multimodal response)
   */
  async function generateImage(prompt, options = {}) {
    const model = options.model || CONFIG.imageModel;
    const url = `${CONFIG.baseUrl}/models/${model}:generateContent?key=${CONFIG.apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    const result = { text: '', images: [] };
    for (const part of parts) {
      if (part.text) result.text += part.text;
      if (part.inlineData) {
        result.images.push({
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data,
          dataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
        });
      }
    }
    return result;
  }

  /**
   * Generate a Hee-eung-ee character image
   * @param {string} description - Scene or pose description
   */
  async function generateCharacter(description) {
    const prompt = [
      'Create a cute, round character mascot called "Hee-eung-ee" (히응이)',
      'inspired by the Korean Hangul consonant ㅎ.',
      'Style: kawaii/chibi, flat illustration, clean vector-like lines.',
      'Color palette: warm gold (#c9974a), cream, soft brown, dark background accents.',
      'The character has a round body shaped like ㅎ, small dot eyes, tiny limbs.',
      'White or transparent background.',
      description,
    ].join(' ');

    return generateImage(prompt);
  }

  /**
   * Generate Korean lesson content
   * @param {string} topic - Lesson topic (e.g., "감사합니다", "ordering food")
   */
  async function generateLessonContent(topic) {
    const prompt = [
      'You are a friendly Korean language teacher for foreign tourists.',
      `Generate a short lesson about "${topic}".`,
      'Respond ONLY with valid JSON (no markdown):',
      '{ "korean": "한글 text", "romanized": "romanization", "english": "translation",',
      '  "context": "when/how to use this", "tip": "fun cultural tip" }',
      'Keep each field under 80 characters.',
    ].join(' ');

    const text = await generateText(prompt, { temperature: 0.8 });
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : { raw: text };
    } catch {
      return { raw: text };
    }
  }

  /**
   * Test API connection
   */
  async function testConnection() {
    try {
      const result = await generateText(
        'Respond with exactly: "Gemini connected! 안녕하세요 히응이!" and nothing else.',
        { maxTokens: 50 }
      );
      console.log('%c✅ Gemini API connected', 'color:#c9974a;font-weight:bold', result);
      return { success: true, message: result };
    } catch (err) {
      console.error('❌ Gemini API failed:', err.message);
      return { success: false, message: err.message };
    }
  }

  return {
    generateText,
    generateImage,
    generateCharacter,
    generateLessonContent,
    testConnection,
    CONFIG,
  };
})();
