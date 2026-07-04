const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Invokes the official Google Gemini SDK.
 */
const callGemini = async (prompt, systemInstruction = '', jsonMode = false) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'mock-gemini-api-key-replace-this') {
    throw new Error('GEMINI_API_KEY environment secret is not configured on the backend.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction || undefined
  });

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  };

  if (jsonMode) {
    payload.generationConfig = {
      responseMimeType: 'application/json'
    };
  }

  const result = await model.generateContent(payload);
  const text = result.response?.text();
  if (!text) {
    throw new Error('Empty response received from Gemini API.');
  }

  return text;
};

module.exports = {
  callGemini
};
