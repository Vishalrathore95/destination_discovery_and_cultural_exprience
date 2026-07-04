const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Init Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null;

// ─── Mock Data Generator ────────────────────────────────────────────────────
function getMockGuide(destination, style, season) {
  return {
    overview: {
      description: `${destination} is a vibrant destination rich in culture and history. Blending ancient traditions with modern life, it offers travelers a unique window into local heritage. The ${style} style traveler will find endless inspiration here, especially during ${season} when the city comes alive with energy and color.`,
      bestTimeToVisit: `${season} is ideal — expect pleasant weather, colorful festivals, and fewer crowds at major sites.`,
      culturalSignificance: `${destination} has shaped regional history for centuries, serving as a cultural crossroads that influenced art, religion, cuisine, and philosophy across generations.`
    },
    topAttractions: [
      { name: `${destination} Heritage Fort`, description: `A majestic fortress rising above the cityscape, offering panoramic views and centuries of stories etched in stone. Its ramparts echo tales of royal courts and ancient battles.`, category: 'Historical', estimatedTime: '3-4 hours', entryFee: '₹300 / $5', culturalTip: 'Visit at sunrise for golden hour photography and fewer crowds.' },
      { name: `Central Cultural Museum`, description: `Home to thousands of artifacts spanning millennia, this world-class museum chronicles the region's artistic evolution through sculptures, textiles, manuscripts, and royal treasures.`, category: 'Artistic', estimatedTime: '2-3 hours', entryFee: '₹150 / $3', culturalTip: 'Join the free guided tour at 11am for rich contextual storytelling.' },
      { name: `Old Spice & Craft Bazaar`, description: `A labyrinthine market alive with the scent of spices, the clatter of artisans, and the vibrant colors of handmade crafts. The authentic heartbeat of local commerce.`, category: 'Culinary', estimatedTime: '1-2 hours', entryFee: 'Free', culturalTip: 'Bargaining is expected but do so respectfully. Start at 60% of asking price.' },
      { name: `Sacred Temple Complex`, description: `An architectural masterpiece spanning several acres, this temple complex features intricate carvings, daily rituals, and a spiritual ambiance that has attracted pilgrims for over 800 years.`, category: 'Spiritual', estimatedTime: '1-2 hours', entryFee: 'Free (donations welcome)', culturalTip: 'Cover shoulders and remove shoes. Attend the evening aarti ceremony for a transcendent experience.' },
      { name: `Scenic Nature Reserve`, description: `A serene escape from city hustle, this reserve features diverse flora, migratory birds, and nature trails that reveal the region's ecological heritage alongside ancient ruins.`, category: 'Natural', estimatedTime: '3-5 hours', entryFee: '₹200 / $4', culturalTip: 'Hire a local naturalist guide — their knowledge transforms a simple walk into a profound journey.' }
    ],
    hiddenGems: [
      { name: `Artisan Quarter Lanes`, description: `Wander narrow cobblestone lanes where third-generation craftsmen carve wood, weave silk, and hammer metal using techniques unchanged for centuries. Few tourists find this living museum.`, whySpecial: 'Authentic artisan workshops open to visitors', localSignificance: 'Preserves traditional crafts at risk of disappearing', howToFind: 'Ask locals for "Karigar Mohalla" — not on most tourist maps.' },
      { name: `Sunset Riverfront Ghats`, description: `Local families gather at these quiet riverside steps at dusk for evening rituals, children playing, and fishermen returning. A genuine slice of daily life rarely shown to tourists.`, whySpecial: 'Unfiltered view of real local life', localSignificance: 'Community gathering point for generations', howToFind: 'Walk 15 minutes north of the main bridge — follow the smell of incense.' },
      { name: `Underground Heritage Library`, description: `A little-known archive of rare manuscripts, ancient maps, and historical photographs housed in a colonial-era basement. Scholars visit from around the world; tourists rarely discover it.`, whySpecial: 'Houses manuscripts over 500 years old', localSignificance: 'Custodian of regional intellectual heritage', howToFind: 'Located behind the main post office, entrance through a red door marked "Archives".' }
    ],
    travelTips: [
      `🙏 Greet locals with a respectful "Namaste" — it opens doors everywhere.`,
      `🚌 Use local auto-rickshaws for short distances; negotiate before boarding and enjoy the chaos.`,
      `🌶️ Street food is safe at busy stalls — look for high turnover. Try the local specialty first.`,
      `📸 Always ask before photographing people, especially at religious sites and local markets.`,
      `💧 Carry a reusable water bottle — tap water varies; bottled water is cheap and widely available.`
    ]
  };
}

function getMockStory(attractionName, destination) {
  return {
    story: `The morning mist still clung to the ancient stones of ${attractionName} as Meera, the temple caretaker's daughter, began her daily ritual of offering jasmine flowers at the threshold. Her sandals whispered against flagstones worn smooth by a million pilgrimages before hers. She had grown up hearing the bells — their bronze voices weaving through her childhood like a golden thread. Today, as she lit the oil lamp, its warm flame caught the carved face of the goddess above, and for a moment, twenty centuries collapsed into a single breath of reverence. The sandalwood incense curled upward like a prayer. Outside, in ${destination}'s awakening streets, motorbikes and morning vendors created their daily symphony, but inside these walls, time moved differently — measured not in hours but in heartbeats and devotion. What ancient wisdom might we rediscover if we, too, learned to measure time this way?`,
    culturalContext: `${attractionName} has been a center of spiritual and cultural life in ${destination} for over 800 years. It represents the architectural pinnacle of the regional style, blending indigenous craftsmanship with influences from trade routes that once connected this region to distant civilizations.`,
    didYouKnow: [
      `The construction of ${attractionName} involved over 2,000 artisans working for nearly three decades, each carving detailed scenes from sacred texts.`,
      `During major festivals, the site draws over 100,000 pilgrims — a tradition maintained unbroken for centuries despite wars, floods, and changing rulers.`,
      `The acoustics of the main chamber were engineered so that chants resonate at a frequency scientifically shown to reduce stress and promote meditation.`
    ],
    engagementTip: `Join the local morning puja (worship ceremony) at 6am — arrive early, dress modestly, observe silently, and accept the prasad (blessed offering) graciously. Photography is permitted only in designated outer areas.`
  };
}

function getMockEvents(destination) {
  return [
    { eventName: `${destination} Heritage Festival`, date: 'Next full moon weekend', time: '6:00 PM - 10:00 PM', description: `A spectacular celebration of local arts, music, and traditions that transforms the old city into a living cultural tapestry. Local artisans, musicians, and dancers perform alongside interactive workshops.`, category: 'Festival', culturalValue: 'Preserves and celebrates intangible cultural heritage', participationTip: 'Arrive at 5:30pm for the opening procession', ticketInfo: 'Free entry, some workshops ₹200' },
    { eventName: `Traditional Cuisine Masterclass`, date: 'Every Saturday', time: '10:00 AM - 1:00 PM', description: `Learn to cook three authentic regional dishes under the guidance of local grandmothers who have preserved these recipes for generations. Includes a market visit to source fresh ingredients.`, category: 'Workshop', culturalValue: 'Transmits culinary heritage through direct experience', participationTip: 'Limited to 12 participants — book one week ahead', ticketInfo: '₹1,500 / $18 including all ingredients and lunch' },
    { eventName: `Classical Music Evening`, date: 'First Friday of the month', time: '7:30 PM', description: `Master musicians perform centuries-old ragas in an intimate courtyard setting, with explanation of the ancient modal system accessible to international visitors.`, category: 'Performance', culturalValue: 'Keeps classical music traditions alive in authentic settings', participationTip: 'Sit cross-legged on cushions for the authentic experience', ticketInfo: '₹500 / $6 per person' },
    { eventName: `Sunrise Yoga at Heritage Site`, date: 'Daily', time: '5:30 AM - 7:00 AM', description: `Begin each day with yoga and meditation led by local teachers against the backdrop of ancient monuments. A profound connection between body, mind, and cultural heritage.`, category: 'Community', culturalValue: 'Living practice of ancient wellness traditions', participationTip: 'Bring your own mat; wear comfortable, modest clothing', ticketInfo: 'Donation-based (suggested ₹300)' },
    { eventName: `Weekly Artisan Market`, date: 'Every Sunday', time: '8:00 AM - 2:00 PM', description: `Over 80 local craftspeople gather to sell directly — no middlemen, fair prices, genuine craftsmanship. Meet the makers of pottery, textiles, jewelry, and woodwork.`, category: 'Market', culturalValue: 'Supports traditional craft economies and cultural preservation', participationTip: 'Visit early for best selection; bring cash', ticketInfo: 'Free entry' }
  ];
}

function getMockVocabulary(destination) {
  return {
    language: 'Local Regional Language',
    vocabulary: [
      { phrase: 'Namaste', pronunciation: 'nah-mah-STAY', meaning: 'Respectful greeting / I bow to you', context: 'Use when meeting anyone; hands pressed together at chest', culturalNote: 'Acknowledges the divine in every person — much deeper than "hello"' },
      { phrase: 'Dhanyawad', pronunciation: 'DHUN-ya-vahd', meaning: 'Thank you (heartfelt)', context: 'Use when someone helps you or shows hospitality', culturalNote: 'More sincere than the casual "shukriya" — locals appreciate the effort' },
      { phrase: 'Kitna hua?', pronunciation: 'KIT-na HOO-ah', meaning: 'How much does it cost?', context: 'Essential for market shopping and auto-rickshaw fares', culturalNote: 'Always follow up with a counter-offer — bargaining is an art form here' },
      { phrase: 'Bahut sundar', pronunciation: 'ba-HOOT sun-DAR', meaning: 'Very beautiful', context: 'Complimenting a meal, craft, or scenery', culturalNote: 'Locals light up when foreigners appreciate their culture in their own language' },
      { phrase: 'Kripaya', pronunciation: 'KRIP-ah-yah', meaning: 'Please (formal)', context: 'When making requests at restaurants, shops, or for directions', culturalNote: 'Shows respect; pairs with "namaste" for a perfect polite request' },
      { phrase: 'Thoda aur?', pronunciation: 'THO-dah OR', meaning: 'A little more?', context: 'When offered food — the ultimate compliment to a host', culturalNote: 'Refusing food can seem rude; this phrase lets you accept graciously' },
      { phrase: 'Wah!', pronunciation: 'wah (like "wa")', meaning: 'Wow! Wonderful! Bravo!', context: 'Spontaneous expression of delight or appreciation', culturalNote: 'Identical to many other languages — universal joy needs no translation' },
      { phrase: 'Chalo', pronunciation: 'CHA-lo', meaning: "Let's go / Come on", context: 'Getting a group moving, or agreeing to a suggestion', culturalNote: 'You will hear this constantly — pick it up and locals will grin when you use it' },
      { phrase: 'Ek minute', pronunciation: 'ek MIN-it', meaning: 'One minute / Just a moment', context: 'When you need a brief pause in a transaction or conversation', culturalNote: "Culturally, 'one minute' may mean 5-15 minutes — embrace 'Indian Standard Time'" },
      { phrase: 'Bahut achha', pronunciation: 'ba-HOOT AHH-cha', meaning: 'Very good / Excellent', context: 'Positive feedback for food, service, or any experience', culturalNote: 'The versatile universal positive response — learn this first!' }
    ],
    quickTips: ['Speak slowly and clearly; most urban residents understand basic English', 'A few words in the local language creates immediate warmth and goodwill']
  };
}

function getMockFoodPairings(destination) {
  return {
    cuisine: `${destination} Regional Cuisine`,
    dishes: [
      { name: 'Dal Baati Churma', description: 'Rustic lentil soup served with baked wheat balls and sweet crumbled bread — the quintessential comfort food of the region.', ingredients: ['lentils', 'wheat', 'ghee', 'spices', 'jaggery'], culturalStory: 'Originally warrior food — portable, nutritious, and requiring no refrigeration on long campaigns. Now a celebratory dish at weddings and festivals.', pairsWith: 'Chaas (spiced buttermilk)', whereToFind: 'Traditional dhabas and heritage restaurants' },
      { name: 'Laal Maas', description: 'Fiery red mutton curry slow-cooked with Mathania chilies — a royal Rajput recipe that commands respect at every table.', ingredients: ['mutton', 'Mathania red chilies', 'yogurt', 'ghee', 'aromatic spices'], culturalStory: 'A royal hunting dish, adapted from camp-fire cooking to palace banquet halls. The deep red color symbolizes power and celebration in regional culture.', pairsWith: 'Bajra (millet) roti', whereToFind: 'Upscale traditional restaurants and wedding feasts' },
      { name: 'Mawa Kachori', description: 'Deep-fried pastry stuffed with sweet milk solids, dry fruits, and cardamom — a festive indulgence with centuries of history.', ingredients: ['flour', 'mawa (milk solids)', 'dry fruits', 'cardamom', 'saffron'], culturalStory: 'Created in royal kitchens as a preserved sweet that could survive long journeys. Now the signature breakfast item and festival gift of the region.', pairsWith: 'Masala chai (spiced tea)', whereToFind: 'Old city sweet shops, especially near temples' },
      { name: 'Ker Sangri', description: 'Desert berries and beans cooked together — a surprisingly complex dish born from desert scarcity that became a beloved delicacy.', ingredients: ['ker berries', 'sangri beans', 'spices', 'dried red chilies', 'oil'], culturalStory: 'A testament to desert ingenuity — this wild plant combination, once survival food for nomadic communities, is now exported worldwide as a gourmet specialty.', pairsWith: 'Bajra roti and yogurt', whereToFind: 'Authentic local homes and heritage hotels' }
    ],
    diningEtiquette: ['Eat with your right hand — the left is considered unclean', 'Accepting food when offered is a sign of respect; refusing may offend', 'Complimenting the cook directly is the highest form of appreciation', 'Wait for elders to begin eating before you start'],
    mustTryStreetFood: ['Pyaaz Kachori from Rawat Mishtan Bhandar', 'Mirchi Bada (chili fritters) at any old city stall']
  };
}

function getMockImmersion(destination, season) {
  return {
    title: `Virtual Dawn Journey through ${destination}`,
    introduction: `Close your eyes. You are standing at the threshold of ${destination} at first light, where the ancient and living breathe as one. Let this be your passage into a world where every stone has a story, every scent a memory, every sound a song passed down through a thousand years.`,
    scenes: [
      { scene: 'The Sacred Ghats at Dawn', description: `Mist rises from the river as oil lamps bob on banana-leaf boats, their tiny flames surviving wind and water by sheer faith. An old priest recites Sanskrit mantras in a rhythm so ancient it predates recorded history. Peacocks call from temple parapets. The smell of marigolds and sandalwood incense mingles with the river's cool breath. In this moment, you are not a tourist — you are a witness to eternity.`, ambiance: 'Deeply spiritual, timeless, meditative', culturalContext: 'Morning ghats rituals connect the living to ancestors and the divine — practiced unchanged for over 3,000 years' },
      { scene: 'The Bazaar at Noon', description: `The old city erupts in midday chaos and color. Silk merchants unfurl bolts of fabric that catch sunlight like liquid jewels. A chai-wallah pours tea in a practised arc from brass kettle to clay cup. Somewhere, a radio plays a Bollywood song from the 1960s. Children chase a dog through the narrow lanes. The sound of a lathe, a hammer, a singing bowl. The smell of cumin frying in hot oil. This is the city's living heart, unchanged in essential rhythm for five centuries.`, ambiance: 'Vibrant, chaotic, joyfully alive', culturalContext: 'These bazaars have been trade arteries connecting Central Asia, Persia, and India for over 600 years' },
      { scene: 'The Fort at Golden Hour', description: `As afternoon fades, the ancient fort glows amber and rose. The stones, hot from a day of sunlight, release their warmth slowly into the cooling air. From the ramparts, the city spreads below like a living map — minarets and temple spires, blue-painted houses and dusty lanes, all stitched together by the thread of a river. A lone kite rider launches from the terrace below. The muezzin's call floats up from the old quarter. Time seems to crystallize.`, ambiance: 'Contemplative, majestic, profoundly beautiful', culturalContext: 'The fort has witnessed empires rise and fall — Mughal, Rajput, British — each leaving architectural layers you can read like a history book' }
    ],
    meditationPrompt: `Place your hand on your heart. Breathe in the spice-scented air of ${destination}. With each exhale, release the noise of your everyday world. With each inhale, absorb the wisdom of a civilization that has been asking the same questions — of beauty, of meaning, of belonging — for thousands of years. You carry this now.`,
    youtubeSearch: `${destination} travel documentary cultural heritage 4K`
  };
}

function getMockHeritage(destination) {
  return {
    dos: ['Remove shoes before entering temples, mosques, or private homes', 'Use your right hand for eating, giving, and receiving', 'Dress modestly — cover shoulders and knees at religious sites', 'Ask permission before photographing people or religious ceremonies', 'Accept food, drinks, and gifts with both hands as a sign of respect'],
    donts: ["Don't point feet toward altars, elders, or sacred objects", "Don't touch someone's head — it's considered sacred", "Don't whistle at night — considered inauspicious in local belief", "Don't wear leather items into Jain temples"],
    dresscode: 'Loose, breathable cotton in muted colors. Women: salwar kameez or long skirts. Men: linen trousers. Always carry a stole/scarf for temple visits.',
    religiousCustoms: `${destination} is home to multiple faiths coexisting — Hindu temples, Jain temples, mosques, and churches often stand within blocks of each other. Respect all equally. During prayer times, observe silence and step aside.`,
    greetings: '"Namaste" with pressed palms for Hindus; "Salaam Alaikum" for Muslims; a simple respectful nod works universally. Handshakes are common in business settings.',
    taboos: ['Avoid public displays of affection — considered inappropriate in traditional areas', 'Never waste food — considered deeply disrespectful given local cultural values'],
    giftGiving: 'Bring sweets (mithai) when visiting a home — never arrive empty-handed. Avoid giving leather products as gifts (out of respect for vegetarian customs). Gifts are typically not opened in front of the giver.'
  };
}

function getMockNarrative(destination, tone, persona) {
  return {
    narrative: `I came to ${destination} expecting monuments. I found mirrors. Every carved stone I touched reflected something I had forgotten about being human — the impulse toward beauty, the desire to make meaning from chaos, the need to belong to something larger than oneself. Walking the old city lanes at dusk, I noticed how the light here is different: richer, more amber, as if filtered through millennia of accumulated life. A woman was stringing jasmine flowers in a doorway, exactly as her grandmother had, exactly as her granddaughter would. The city is a continuous thread, unbroken, living. I stopped keeping notes. Some truths are too dimensional for paper. I simply walked, and let ${destination} teach me what it knows — that culture is not a museum you visit but a conversation you join, if you are willing to listen.`,
    culturalThemes: ['Sacred and Secular coexisting in harmony', 'Craft and artisanship as living heritage', 'Community as the architecture of survival'],
    localQuote: `"Atithi devo bhava" — The guest is God. (Ancient Sanskrit maxim, still lived daily in ${destination})`,
    sensoryHighlights: {
      sights: 'Saffron flags against a cobalt sky; the geometric precision of ancient tile-work; a child\'s kite threading between minarets',
      sounds: 'The pre-dawn call to prayer layering over temple bells; the rhythmic tap of a weaver\'s loom; laughter echoing through stone corridors',
      tastes: 'The first sip of masala chai — cardamom, ginger, sweetness — a liquid welcome; the slow heat of regional spices unfolding in waves',
      smells: 'Incense and jasmine; hot ghee and cumin; petrichor on ancient dust after the first monsoon drops'
    }
  };
}

// ─── Gemini Call Helper ──────────────────────────────────────────────────────
async function callGemini(prompt) {
  if (!model) throw new Error('Gemini not initialized');
  const result = await model.generateContent(prompt);
  return result.response.text();
}

function parseJSON(text) {
  try {
    const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { rawText: text };
  }
}

// ─── Wrapper: Try Gemini, Fall Back to Mock ──────────────────────────────────
async function tryGeminiOrMock(prompt, mockFn) {
  if (!model) return mockFn();
  try {
    const text = await callGemini(prompt);
    const parsed = parseJSON(text);
    if (parsed && !parsed.rawText) return parsed;
    return mockFn();
  } catch (err) {
    console.warn('Gemini API error, using demo data:', err.message?.substring(0, 80));
    return mockFn();
  }
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: 'gemini-2.0-flash', aiEnabled: !!model });
});

// ─── ENDPOINT 1: Destination Guide ───────────────────────────────────────────
app.post('/generateGuide', async (req, res) => {
  const { destination, style = 'cultural', season = 'spring' } = req.body;
  if (!destination) return res.status(400).json({ error: 'destination is required' });

  const prompt = `Act as an expert travel curator for "${destination}", style: "${style}", season: "${season}". 
Return ONLY valid JSON (no markdown): 
{"overview":{"description":"100 words","bestTimeToVisit":"string","culturalSignificance":"string"},"topAttractions":[{"name":"string","description":"50 words","category":"Historical|Natural|Artistic|Culinary|Spiritual","estimatedTime":"string","entryFee":"string","culturalTip":"string"}],"hiddenGems":[{"name":"string","description":"50 words","whySpecial":"string","localSignificance":"string","howToFind":"string"}],"travelTips":["tip1","tip2","tip3","tip4","tip5"]}
Include 5 attractions and 3 hidden gems. Be specific to ${destination}.`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockGuide(destination, style, season));
    res.json(data);
  } catch (err) {
    res.json(getMockGuide(destination, style, season));
  }
});

// ─── ENDPOINT 2: Story ────────────────────────────────────────────────────────
app.post('/generateStory', async (req, res) => {
  const { attractionName, destination } = req.body;
  if (!attractionName || !destination) return res.status(400).json({ error: 'attractionName and destination required' });

  const prompt = `Write a story about ${attractionName} in ${destination}. Return ONLY valid JSON:
{"story":"150-200 word vivid narrative from a local perspective with sensory details","culturalContext":"brief history","didYouKnow":["fact1","fact2","fact3"],"engagementTip":"how to engage authentically"}`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockStory(attractionName, destination));
    res.json(data);
  } catch (err) {
    res.json(getMockStory(attractionName, destination));
  }
});

// ─── ENDPOINT 3: Itinerary ────────────────────────────────────────────────────
app.post('/generateItinerary', async (req, res) => {
  const { destination, style = 'cultural', budget = 'moderate', groupType = 'solo', interests = '' } = req.body;
  const days = req.body.duration || req.body.days || 3;
  if (!destination) return res.status(400).json({ error: 'destination required' });

  const prompt = `Create a ${days}-day itinerary for ${destination}, style: ${style}, budget: ${budget}, group: ${groupType}, interests: ${interests}. Return ONLY valid JSON:
{"itinerary":[{"day":1,"theme":"string","morning":{"activity":"string","location":"string","duration":"string","cost":"string"},"afternoon":{"activity":"string","location":"string","duration":"string","cost":"string"},"evening":{"activity":"string","location":"string","duration":"string","cost":"string"},"culturalInsight":"string","localDish":"string"}],"totalEstimatedCost":"string","packingTips":["tip1","tip2","tip3"],"emergencyContacts":{"touristHelpline":"string","police":"string"}}
Generate all ${days} days. Be specific to ${destination}.`;

  const mockItinerary = () => ({
    itinerary: Array.from({ length: parseInt(days) }, (_, i) => ({
      day: i + 1,
      theme: ['Cultural Immersion', 'Heritage Exploration', 'Local Life & Cuisine', 'Art & Spirituality', 'Hidden Gems'][i % 5],
      morning: { activity: `Visit ${destination} Heritage Museum and surrounding monuments`, location: 'Old City Center', duration: '3 hours', cost: '₹200 / $3' },
      afternoon: { activity: 'Street food tour through the bazaar lanes with local guide', location: 'Main Bazaar District', duration: '2 hours', cost: '₹500 / $7 (food + guide)' },
      evening: { activity: 'Sunset at the riverside ghats — watch the aarti ceremony', location: 'Main Ghat', duration: '2 hours', cost: 'Free' },
      culturalInsight: 'The coexistence of ancient tradition and modern life in the same street — a living timeline rather than a museum.',
      localDish: ['Dal Baati Churma', 'Pyaaz Kachori', 'Laal Maas', 'Mawa Kachori', 'Ker Sangri'][i % 5]
    })),
    totalEstimatedCost: `₹${3500 * parseInt(days)}–₹${6000 * parseInt(days)} / $${45 * parseInt(days)}–$${80 * parseInt(days)} for ${days} days`,
    packingTips: ['Light cotton clothes for day heat; layer for cool evenings', 'Comfortable walking shoes — cobblestones everywhere', 'Scarf/stole for temple visits and sun protection'],
    emergencyContacts: { touristHelpline: '1363', police: '100' }
  });

  try {
    const data = await tryGeminiOrMock(prompt, mockItinerary);
    res.json(data);
  } catch (err) {
    res.json(mockItinerary());
  }
});

// ─── ENDPOINT 4: Cultural Narrative ──────────────────────────────────────────
app.post('/generateNarrative', async (req, res) => {
  const { destination, narrativeTone = 'poetic', travelPersona = 'explorer' } = req.body;
  if (!destination) return res.status(400).json({ error: 'destination required' });

  const prompt = `Write a ${narrativeTone} narrative about ${destination} as a ${travelPersona}. Return ONLY valid JSON:
{"narrative":"200-250 word first-person narrative","culturalThemes":["theme1","theme2","theme3"],"localQuote":"proverb with translation","sensoryHighlights":{"sights":"string","sounds":"string","tastes":"string","smells":"string"}}`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockNarrative(destination, narrativeTone, travelPersona));
    res.json(data);
  } catch (err) {
    res.json(getMockNarrative(destination, narrativeTone, travelPersona));
  }
});

// ─── ENDPOINT 5: Vocabulary ───────────────────────────────────────────────────
app.post('/generateVocabulary', async (req, res) => {
  const { destination } = req.body;
  if (!destination) return res.status(400).json({ error: 'destination required' });

  const prompt = `Generate 10 essential phrases for travelers visiting ${destination}. Return ONLY valid JSON:
{"language":"local language name","vocabulary":[{"phrase":"string","pronunciation":"phonetic","meaning":"english meaning","context":"when to use","culturalNote":"why it matters"}],"quickTips":["tip1","tip2"]}`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockVocabulary(destination));
    res.json(data);
  } catch (err) {
    res.json(getMockVocabulary(destination));
  }
});

// ─── ENDPOINT 6: Food Pairings ────────────────────────────────────────────────
app.post('/generateFoodPairings', async (req, res) => {
  const { destination, attractionName = '' } = req.body;
  if (!destination) return res.status(400).json({ error: 'destination required' });

  const prompt = `Create a culinary guide for ${destination} ${attractionName ? `linked to ${attractionName}` : ''}. Return ONLY valid JSON:
{"cuisine":"string","dishes":[{"name":"string","description":"30 words","ingredients":["i1","i2"],"culturalStory":"string","pairsWith":"string","whereToFind":"string"}],"diningEtiquette":["tip1","tip2","tip3","tip4"],"mustTryStreetFood":["food1","food2"]}
Include 4 dishes.`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockFoodPairings(destination));
    res.json(data);
  } catch (err) {
    res.json(getMockFoodPairings(destination));
  }
});

// ─── ENDPOINT 7: Virtual Immersion ────────────────────────────────────────────
app.post('/generateVirtualImmersion', async (req, res) => {
  const { destination, siteName = '', season = 'any season' } = req.body;
  const targetDest = destination || siteName;
  if (!targetDest) return res.status(400).json({ error: 'destination or siteName required' });

  const prompt = `Create a virtual immersion for ${siteName} in ${destination || 'its region'} during ${season}. Return ONLY valid JSON:
{"title":"string","introduction":"50 words","scenes":[{"scene":"title","description":"80 words","ambiance":"mood","culturalContext":"significance"}],"meditationPrompt":"50 words","youtubeSearch":"search query"}
Include 3 scenes.`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockImmersion(targetDest, season));
    res.json(data);
  } catch (err) {
    res.json(getMockImmersion(targetDest, season));
  }
});

// ─── ENDPOINT 8: Events ───────────────────────────────────────────────────────
app.post('/generateEvents', async (req, res) => {
  const { destination } = req.body;
  const season = req.body.dateRange || req.body.season || 'upcoming month';
  if (!destination) return res.status(400).json({ error: 'destination required' });

  const prompt = `List 5 cultural events in ${destination} during ${season}. Return ONLY valid JSON:
{"events":[{"eventName":"string","date":"string","time":"string","description":"50 words","category":"Festival|Workshop|Market|Performance|Community","culturalValue":"string","participationTip":"string","ticketInfo":"string"}],"seasonalHighlight":"string"}`;

  try {
    const data = await tryGeminiOrMock(prompt, () => ({ events: getMockEvents(destination), seasonalHighlight: `The Heritage Festival is the crown jewel of ${destination}'s cultural calendar — do not miss it.` }));
    res.json(data);
  } catch (err) {
    res.json({ events: getMockEvents(destination), seasonalHighlight: `The Heritage Festival is the crown jewel of ${destination}'s cultural calendar.` });
  }
});

// ─── ENDPOINT 9: Heritage ─────────────────────────────────────────────────────
app.post('/generateHeritage', async (req, res) => {
  const { destination } = req.body;
  if (!destination) return res.status(400).json({ error: 'destination required' });

  const prompt = `Provide cultural etiquette for ${destination}. Return ONLY valid JSON:
{"dos":["do1","do2","do3","do4","do5"],"donts":["dont1","dont2","dont3","dont4"],"dresscode":"string","religiousCustoms":"string","greetings":"string","taboos":["taboo1","taboo2"],"giftGiving":"string"}`;

  try {
    const data = await tryGeminiOrMock(prompt, () => getMockHeritage(destination));
    res.json(data);
  } catch (err) {
    res.json(getMockHeritage(destination));
  }
});

// ─── ENDPOINT 10: Chatbot (supports /chat and /chatbot) ──────────────────────
const handleChat = async (req, res) => {
  const message = req.body.message || req.body.question;
  const destination = req.body.destination || req.body.context;
  const conversationHistory = req.body.conversationHistory || [];

  if (!message) return res.status(400).json({ error: 'message or question is required' });

  const mockReplies = {
    default: `Great question about ${destination || 'your destination'}! As your Cultural Concierge, I recommend exploring the old city at dawn when locals perform morning rituals and the light is magical. The best hidden gems are always found by simply walking without a map and following the sounds of life — a hammer in a workshop, singing from a temple, the sizzle of street food. What aspect of local culture interests you most?`,
    food: `The local cuisine of ${destination || 'this region'} is deeply tied to its geography and history. The key dishes evolved from trade routes, royal kitchens, and desert survival. My top tip: always eat where you see motorcycle taxi drivers eating — they know the best, most authentic spots. Try the street food at the old bazaar, especially the morning specialties.`,
    heritage: `${destination || 'This destination'}'s heritage spans over a thousand years, with architectural layers you can read like a history book. The most important thing to understand is that this culture is still very much alive — not a museum exhibit. Engage respectfully, learn a few local phrases, and you'll find yourself welcomed into the living story of this place.`
  };

  const lowerMsg = message.toLowerCase();
  const category = lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('cuisine') ? 'food' : lowerMsg.includes('heritage') || lowerMsg.includes('history') || lowerMsg.includes('culture') ? 'heritage' : 'default';

  if (!model) {
    return res.json({ reply: mockReplies[category], response: mockReplies[category] });
  }

  const contextPrompt = destination
    ? `You are a knowledgeable Cultural Concierge AI specializing in ${destination}. Be helpful, enthusiastic, and specific. Answer in 2-3 sentences.`
    : `You are a Cultural Concierge AI. Help travelers discover world cultures. Be helpful and specific. Answer in 2-3 sentences.`;

  const historyText = conversationHistory.slice(-4)
    .map(m => `${m.role === 'user' ? 'Visitor' : 'Concierge'}: ${m.content}`)
    .join('\n');

  const fullPrompt = `${contextPrompt}\n${historyText ? `\nConversation:\n${historyText}\n` : ''}\nVisitor: ${message}\nConcierge:`;

  try {
    const text = await callGemini(fullPrompt);
    const replyText = text.trim();
    res.json({ reply: replyText, response: replyText });
  } catch (err) {
    console.warn('Chat fallback:', err.message?.substring(0, 60));
    res.json({ reply: mockReplies[category], response: mockReplies[category] });
  }
};

app.post('/chat', handleChat);
app.post('/chatbot', handleChat);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌍 Cultural Compass AI Backend — http://localhost:${PORT}`);
  console.log(`✅ AI Status: ${model ? 'Gemini 2.0 Flash ACTIVE' : 'Demo mode (no API key)'}`);
  console.log(`📡 10 endpoints ready | Smart fallback: enabled\n`);
});
