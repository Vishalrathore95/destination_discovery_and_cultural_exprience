/**
 * Cleans and parses AI JSON string outputs.
 * Handles markdown formatting wrappers like ```json ... ```.
 */
export const parseAIJSON = (rawText) => {
  if (!rawText) return null;
  
  // Clean markdown wraps
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.substring(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  
  try {
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("Failed to parse JSON string from AI response:", error, rawText);
    throw new Error("Invalid format in AI response. Please retry.");
  }
};

/**
 * Text-To-Speech Manager using Web Speech API
 */
export const textToSpeech = {
  speak: (text, langCode = 'en-US') => {
    if ('speechSynthesis' in window) {
      // Cancel ongoing synthesis
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to match language
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(langCode.substring(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.lang = langCode;
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis is not supported in this browser.");
    }
  },
  
  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};

/**
 * Returns a randomized image URL related to travel categories to make UI pop.
 */
export const getPlaceholderImage = (category = 'general') => {
  const images = {
    historical: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    natural: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    artistic: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    culinary: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
    spiritual: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    adventure: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
    romantic: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    general: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80'
  };
  
  const cleanCat = category.toLowerCase().split(' ')[0]; // Handle inputs like "historical travel"
  return images[cleanCat] || images.general;
};

/**
 * Returns a premium inline SVG fallback gradient/pattern based on travel style
 * so that the app never displays a broken image icon.
 */
export const getSvgFallback = (category = 'general') => {
  const gradients = {
    historical: { from: '%231e1b4b', to: '%23311042', icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="%23c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
    natural: { from: '%23064e3b', to: '%23022c22', icon: '<path d="M12 22V12M12 12L8 8M12 12l4-4M17 12a5 5 0 10-10 0" stroke="%2334d399" stroke-width="2" stroke-linecap="round" fill="none"/>' },
    artistic: { from: '%23581c87', to: '%233b0764', icon: '<circle cx="12" cy="12" r="9" stroke="%23f472b6" stroke-width="2" fill="none"/><path d="M12 8v8M8 12h8" stroke="%23f472b6" stroke-width="2" stroke-linecap="round"/>' },
    culinary: { from: '%237c2d12', to: '%23431407', icon: '<path d="M12 2v20M17 5H7a2 2 0 00-2 2v3a7 7 0 0014 0V7a2 2 0 00-2-2z" stroke="%23fb923c" stroke-width="2" stroke-linecap="round" fill="none"/>' },
    spiritual: { from: '%231e3a8a', to: '%230f172a', icon: '<path d="M12 2v20M2 12h20M12 12m-6 0a6 6 0 1012 0 6 6 0 10-12 0" stroke="%2360a5fa" stroke-width="2" fill="none"/>' },
    adventure: { from: '%230f766e', to: '%23115e59', icon: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="%232dd4bf" stroke-width="2" fill="none"/>' },
    romantic: { from: '%239d174d', to: '%23831843', icon: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="%23f472b6" opacity="0.8"/>' },
    general: { from: '%23334155', to: '%231e293b', icon: '<circle cx="12" cy="12" r="10" stroke="%2394a3b8" stroke-width="2" fill="none"/><path d="M12 2v20M2 12h20" stroke="%2394a3b8" stroke-width="2"/>' }
  };

  const cleanCat = category.toLowerCase().split(' ')[0];
  const style = gradients[cleanCat] || gradients.general;
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${style.from}"/><stop offset="100%" stop-color="${style.to}"/></linearGradient></defs><rect width="1200" height="600" fill="url(%23g)"/><g transform="translate(600, 300) scale(10)"><g transform="translate(-12, -12)">${style.icon}</g></g></svg>`;
};

