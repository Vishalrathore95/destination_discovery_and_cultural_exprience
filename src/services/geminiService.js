import apiClient from './apiClient';
import axios from 'axios';
import { parseAIJSON } from '../utils/helpers';

const GEMINI_MODEL = 'gemini-2.0-flash';

// Simple in-memory client-side cache to minimize API cost and latency
const apiCache = {
  guides: {},
  stories: {},
  events: {},
  itineraries: {},
  vocabularies: {},
  immersions: {},
  foodPairings: {},
  chatbot: {}
};

/**
 * Direct call to Gemini API.
 * Google AI Studio keys (AQ. prefix) must be sent as x-goog-api-key header.
 * Standard REST keys (AIzaSy prefix) are sent as ?key= query param.
 */
const callGeminiDirectly = async (prompt, systemInstruction = '') => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'mock-gemini-api-key-replace-this') {
    throw new Error("No Gemini API key configured. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
  }

  const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  
  // AQ. keys = Google AI Studio format → use x-goog-api-key header
  // AIzaSy keys = standard REST format → use ?key= query param
  const isAIStudioKey = apiKey.startsWith('AQ.');
  const url = isAIStudioKey ? baseUrl : `${baseUrl}?key=${apiKey}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey,
  };

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  if (prompt.toLowerCase().includes('json') || systemInstruction.toLowerCase().includes('json')) {
    payload.generationConfig = { responseMimeType: 'application/json' };
  }

  const response = await axios.post(url, payload, { headers });
  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response received from Gemini API");
  return text;
};

/**
 * FEATURE 1: Smart Destination Discovery
 */
export const generateDestinationGuide = async (destination, style = 'spiritual', season = 'spring') => {
  if (!destination) {
    return { error: 'Destination cannot be empty.' };
  }

  const cacheKey = `${destination.toLowerCase().trim()}_${style}_${season}`;
  if (apiCache.guides[cacheKey]) {
    console.log("Serving destination guide from cache for:", cacheKey);
    return apiCache.guides[cacheKey];
  }

  const prompt = `Act as an expert travel curator and cultural anthropologist. For destination: "${destination}", travel style: "${style}", time of year: "${season}", provide a comprehensive destination guide in JSON format:

{
  "overview": {
    "description": "Brief cultural context (100 words)",
    "bestTimeToVisit": "Seasonal recommendation",
    "culturalSignificance": "Why this place matters culturally"
  },
  "topAttractions": [
    {
      "name": "string",
      "description": "50-word vivid description",
      "category": "Historical|Natural|Artistic|Culinary|Spiritual",
      "estimatedTime": "e.g., 2-3 hours",
      "entryFee": "Approximate cost or 'Free'",
      "culturalTip": "Unique local insight"
    }
  ],
  "hiddenGems": [
    {
      "name": "string",
      "description": "50-word description highlighting authenticity",
      "whySpecial": "What makes this unique",
      "localSignificance": "Why locals love it",
      "howToFind": "Brief directions or tip"
    }
  ],
  "travelTips": [
    "Tip 1: Local etiquette",
    "Tip 2: Transportation advice",
    "Tip 3: Cultural do's and don'ts"
  ]
}

Ensure authenticity. If you're uncertain about facts, mark with [Based on local lore]. Always be respectful and celebrate cultural diversity.`;

  try {
    const response = await apiClient.post('/generateGuide', { destination, style, season });
    apiCache.guides[cacheKey] = response.data;
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateGuide' failed/unreachable. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      const data = parseAIJSON(rawText);
      apiCache.guides[cacheKey] = data;
      return data;
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};


/**
 * FEATURE 2: Immersive Storytelling & Heritage Promotion
 */
export const generateStory = async (attractionName, destination) => {
  const prompt = `As a master storyteller and cultural historian, craft a captivating narrative about ${attractionName} in ${destination}.

Your response must include:
1. A vivid 150-200 word story from the perspective of a local or historical figure
2. The story should be historically grounded yet engaging
3. Include sensory details (sights, sounds, smells)
4. Highlight cultural heritage and significance
5. End with a reflective question

Then provide:
6. Three "Did You Know?" cultural facts
7. A suggested way for visitors to respectfully engage with this heritage

Format as JSON:
{
  "story": "The narrative text",
  "culturalContext": "Brief historical/cultural background",
  "didYouKnow": ["Fact 1", "Fact 2", "Fact 3"],
  "engagementTip": "How to experience authentically"
}`;

  try {
    const response = await apiClient.post('/generateStory', { attractionName, destination });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateStory' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * FEATURE 3: Local Events & Authentic Experiences
 */
export const generateEvents = async (destination, dateRange = 'upcoming month') => {
  const prompt = `Act as a local cultural concierge for ${destination} during ${dateRange}.

Generate a curated list of authentic local experiences:

[
  {
    "eventName": "string",
    "date": "Specific date or range",
    "time": "Time if available",
    "description": "50-word description highlighting authenticity",
    "category": "Festival|Workshop|Market|Performance|Community",
    "culturalValue": "Why this matters to local culture",
    "visitorParticipation": "How visitors can respectfully participate",
    "bookingTip": "Practical advice for attending"
  }
]

Include 3-5 events. Prioritize less touristy, more authentic experiences. If specific dates are unknown, provide typical seasonal events.`;

  try {
    const response = await apiClient.post('/generateEvents', { destination, dateRange });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateEvents' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * FEATURE 4: AI-Powered Cultural Q&A Chatbot
 */
export const askChatbot = async (question, context = '') => {
  const prompt = `You are "Cultural Compass," an AI assistant specialized in cultural travel. Answer the user's question:
Question: "${question}"
${context ? `Destination Context: "${context}"` : ''}

Guidelines:
* Be helpful, respectful, and culturally sensitive
* If unsure, say so and suggest where to find more information
* Provide practical, actionable advice
* Include cultural context and nuance
* Avoid stereotypes and generalizations`;

  try {
    const response = await apiClient.post('/chatbot', { question, context });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/chatbot' failed. Calling Gemini directly:", error.message);
    try {
      const responseText = await callGeminiDirectly(prompt);
      return { response: responseText };
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * FEATURE 5: Personalized Cultural Itinerary Generator
 */
export const generateItinerary = async (destination, duration, interests, budget, style) => {
  const prompt = `Create a personalized cultural itinerary for ${destination} for ${duration} days with these preferences:
* Interests: ${interests}
* Budget: ${budget}
* Style: ${style}

Generate a JSON itinerary:
{
  "overview": "Brief summary of the cultural journey",
  "dailyPlan": [
    {
      "day": 1,
      "theme": "Theme of the day",
      "activities": [
        {
          "time": "Morning/Afternoon/Evening",
          "activity": "Description",
          "culturalSignificance": "Why this activity matters culturally",
          "practicalTip": "Insider advice"
        }
      ],
      "localMealSuggestion": "Recommended restaurant or food experience",
      "eveningExperience": "Cultural evening activity"
    }
  ],
  "culturalHighlights": "Summary of key cultural takeaways",
  "respectfulTravelTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

  try {
    const response = await apiClient.post('/generateItinerary', { destination, duration, interests, budget, style });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateItinerary' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * FEATURE 6: Community & Cultural Exchange (Moderation)
 */
export const moderateContent = async (userContent) => {
  const prompt = `Review the following user content: "${userContent}"

Check for:
1. Cultural sensitivity and respect
2. Accuracy of cultural information
3. Inclusivity and positive language
4. Helpfulness to other travelers

If acceptable, provide a brief AI-generated summary.
If issues found, suggest improvements respectfully.

Format your response as a JSON:
{
  "isSafe": true|false,
  "summary": "Brief summary of acceptable reviews OR suggestions for improvements",
  "ratingScore": 1-5
}`;

  try {
    const response = await apiClient.post('/moderateContent', { userContent });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/moderateContent' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * ENHANCEMENT: Cultural Vocabulary Builder
 */
export const generateVocabulary = async (destination) => {
  const prompt = `For destination: "${destination}", generate a list of 5-10 key local phrases or cultural terms essential for respectful communication.
Format as JSON:
[
  {
    "phrase": "local word/phrase",
    "pronunciation": "phonetic guide",
    "meaning": "translation",
    "culturalContext": "when and why to use it"
  }
]`;
  try {
    const response = await apiClient.post('/generateVocabulary', { destination });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateVocabulary' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * ENHANCEMENT: Virtual Cultural Immersion (Mindfulness Meditation)
 */
export const generateVirtualImmersion = async (siteName, destination) => {
  const prompt = `Generate a guided 3-minute sensory visualization script (mindfulness style) for visiting "${siteName}" in "${destination}".
Include sensory details: sights, sounds, smells, and a brief historical context. Frame it as a peaceful cultural meditation.
Format as JSON:
{
  "title": "Guided visualization title",
  "introduction": "Setting the scene",
  "steps": [
    "Step 1: Closing eyes, breathing, listening to the ambient sounds...",
    "Step 2: Imagining the smell of incense, stone, forest...",
    "Step 3: Visualizing the colors, architecture..."
  ],
  "mindfulnessReflection": "A cultural takeaway or respectful closing thought"
}`;
  try {
    const response = await apiClient.post('/generateVirtualImmersion', { siteName, destination });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateVirtualImmersion' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};

/**
 * ENHANCEMENT: Cultural Food Pairing
 */
export const generateFoodPairings = async (destination, attractionName) => {
  const prompt = `Recommend 3 authentic local dishes associated with ${destination} or the area around ${attractionName}.
Include recipes or local street food options, and explain the history/cultural significance.
Format as JSON:
[
  {
    "dishName": "Name of dish",
    "culturalSignificance": "Why it's important to this area/culture",
    "description": "Flavor profile",
    "ingredients": ["ing1", "ing2"],
    "whereToFind": "Best place to try it or recipe shortcut"
  }
]`;
  try {
    const response = await apiClient.post('/generateFoodPairings', { destination, attractionName });
    return response.data;
  } catch (error) {
    console.warn("Cloud function '/generateFoodPairings' failed. Calling Gemini directly:", error.message);
    try {
      const rawText = await callGeminiDirectly(prompt);
      return parseAIJSON(rawText);
    } catch (directErr) {
      return { error: directErr.message };
    }
  }
};
