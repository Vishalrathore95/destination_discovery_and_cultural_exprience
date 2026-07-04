const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Import AI wrappers and helpers
const { callGemini } = require('./src/geminiApi');
const prompts = require('./src/prompts');
const validators = require('./src/validators');

/**
 * Helper to wraponRequest endpoints with CORS and central error handling.
 */
const runEndpoint = (req, res, handler) => {
  cors(req, res, async () => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("Endpoint execution error:", error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
};

/**
 * FEATURE 1: Smart Destination Discovery
 */
exports.generateGuide = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { destination, style, season } = validators.validateGuideInput(req.body);
    const prompt = prompts.getGuidePrompt(destination, style, season);
    const rawResult = await callGemini(prompt, 'You are an expert travel anthropologist. Respond strictly with formatted JSON.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * FEATURE 2: Immersive Storytelling & Heritage Promotion
 */
exports.generateStory = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { attractionName, destination } = validators.validateStoryInput(req.body);
    const prompt = prompts.getStoryPrompt(attractionName, destination);
    const rawResult = await callGemini(prompt, 'You are a master storyteller. Respond strictly with formatted JSON.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * FEATURE 3: Local Events & Authentic Experiences
 */
exports.generateEvents = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { destination, dateRange } = validators.validateEventsInput(req.body);
    const prompt = prompts.getEventsPrompt(destination, dateRange);
    const rawResult = await callGemini(prompt, 'You are a local cultural concierge. Respond strictly with formatted JSON.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * FEATURE 4: AI-Powered Cultural Q&A Chatbot
 */
exports.chatbot = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question parameter is required.' });
    }
    const prompt = prompts.getChatbotPrompt(question, context);
    const responseText = await callGemini(prompt, 'You are a respectful, helpful cultural assistant. Respond in text format.');
    res.json({ response: responseText });
  });
});

/**
 * FEATURE 5: Personalized Cultural Itinerary Generator
 */
exports.generateItinerary = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { destination, duration, interests, budget, style } = validators.validateItineraryInput(req.body);
    const prompt = prompts.getItineraryPrompt(destination, duration, interests, budget, style);
    const rawResult = await callGemini(prompt, 'You are a helpful travel planner. Respond strictly with formatted JSON.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * FEATURE 6: Community & Cultural Exchange (Moderation)
 */
exports.moderateContent = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { userContent } = validators.validateModerationInput(req.body);
    const prompt = prompts.getModerationPrompt(userContent);
    const rawResult = await callGemini(prompt, 'You are an objective content reviewer. Check comments for respect. Respond strictly with formatted JSON.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * ENHANCEMENT 1: Cultural Vocabulary Builder
 */
exports.generateVocabulary = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { destination } = req.body;
    if (!destination) return res.status(400).json({ error: 'destination is required.' });
    const prompt = prompts.getVocabularyPrompt(destination);
    const rawResult = await callGemini(prompt, 'You are a language and culture expert. Respond strictly with formatted JSON array.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * ENHANCEMENT 2: Virtual Cultural Immersion (Mindfulness Meditation script)
 */
exports.generateVirtualImmersion = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { siteName, destination } = req.body;
    if (!siteName || !destination) return res.status(400).json({ error: 'siteName and destination are required.' });
    const prompt = prompts.getVirtualImmersionPrompt(siteName, destination);
    const rawResult = await callGemini(prompt, 'You are a mindfulness guide. Respond strictly with formatted JSON.', true);
    res.json(JSON.parse(rawResult));
  });
});

/**
 * ENHANCEMENT 3: Cultural Food Pairing
 */
exports.generateFoodPairings = onRequest({ cors: true }, (req, res) => {
  runEndpoint(req, res, async (req, res) => {
    const { destination, attractionName } = req.body;
    if (!destination) return res.status(400).json({ error: 'destination is required.' });
    const prompt = prompts.getFoodPairingsPrompt(destination, attractionName || destination);
    const rawResult = await callGemini(prompt, 'You are a culinary historian. Respond strictly with formatted JSON array.', true);
    res.json(JSON.parse(rawResult));
  });
});

