const getGuidePrompt = (destination, style, season) => {
  return `Act as an expert travel curator and cultural anthropologist. For destination: "${destination}", travel style: "${style}", time of year: "${season}", provide a comprehensive destination guide in JSON format:

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
};

const getStoryPrompt = (attractionName, destination) => {
  return `As a master storyteller and cultural historian, craft a captivating narrative about ${attractionName} in ${destination}.

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
};

const getEventsPrompt = (destination, dateRange) => {
  return `Act as a local cultural concierge for ${destination} during ${dateRange}.

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
};

const getChatbotPrompt = (question, context = '') => {
  return `You are "Cultural Compass," an AI assistant specialized in cultural travel. Answer the user's question:
Question: "${question}"
${context ? `Destination Context: "${context}"` : ''}

Guidelines:
* Be helpful, respectful, and culturally sensitive
* If unsure, say so and suggest where to find more information
* Provide practical, actionable advice
* Include cultural context and nuance
* Avoid stereotypes and generalizations`;
};

const getItineraryPrompt = (destination, duration, interests, budget, style) => {
  return `Create a personalized cultural itinerary for ${destination} for ${duration} days with these preferences:
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
};

const getModerationPrompt = (userContent) => {
  return `Review the following user content: "${userContent}"

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
};

const getVocabularyPrompt = (destination) => {
  return `For destination: "${destination}", generate a list of 8 key local phrases or cultural terms essential for respectful communication.
Format as a JSON array:
[
  {
    "phrase": "local word/phrase",
    "pronunciation": "phonetic guide",
    "meaning": "English translation",
    "culturalContext": "when and why to use it respectfully"
  }
]`;
};

const getVirtualImmersionPrompt = (siteName, destination) => {
  return `Generate a guided 3-minute sensory visualization script (mindfulness style) for visiting "${siteName}" in "${destination}".
Include sensory details: sights, sounds, smells, and brief historical context. Frame it as a peaceful cultural meditation.
Format as JSON:
{
  "title": "Guided visualization title",
  "introduction": "Setting the scene (2-3 sentences)",
  "steps": [
    "Step 1: Close your eyes, take a slow breath, and listen to the ambient sounds...",
    "Step 2: Notice the smell of incense, stone, or forest...",
    "Step 3: Visualize the colors, architecture, and people around you..."
  ],
  "mindfulnessReflection": "A respectful cultural takeaway or closing thought"
}`;
};

const getFoodPairingsPrompt = (destination, attractionName) => {
  return `Recommend 3 authentic local dishes associated with ${destination} or the area around ${attractionName}.
Include cultural significance and where to find them.
Format as a JSON array:
[
  {
    "dishName": "Name of dish",
    "culturalSignificance": "Why it is important to this area or culture",
    "description": "Flavor profile and presentation",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "whereToFind": "Best place to try it or a simple recipe shortcut"
  }
]`;
};

module.exports = {
  getGuidePrompt,
  getStoryPrompt,
  getEventsPrompt,
  getChatbotPrompt,
  getItineraryPrompt,
  getModerationPrompt,
  getVocabularyPrompt,
  getVirtualImmersionPrompt,
  getFoodPairingsPrompt
};
