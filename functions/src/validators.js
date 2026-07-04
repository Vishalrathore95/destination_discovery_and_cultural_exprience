const sanitize = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>]/g, '').trim();
};

const validateGuideInput = (body) => {
  const destination = sanitize(body.destination);
  const style = sanitize(body.style);
  const season = sanitize(body.season);

  if (!destination || destination.length < 2 || destination.length > 80) {
    throw new Error('Invalid destination parameter.');
  }
  return { destination, style: style || 'historical', season: season || 'spring' };
};

const validateStoryInput = (body) => {
  const attractionName = sanitize(body.attractionName);
  const destination = sanitize(body.destination);

  if (!attractionName || !destination) {
    throw new Error('Missing attractionName or destination parameter.');
  }
  return { attractionName, destination };
};

const validateEventsInput = (body) => {
  const destination = sanitize(body.destination);
  const dateRange = sanitize(body.dateRange);

  if (!destination) {
    throw new Error('Missing destination parameter.');
  }
  return { destination, dateRange: dateRange || 'upcoming month' };
};

const validateItineraryInput = (body) => {
  const destination = sanitize(body.destination);
  const duration = parseInt(body.duration, 10);
  const interests = sanitize(body.interests);
  const budget = sanitize(body.budget);
  const style = sanitize(body.style);

  if (!destination || isNaN(duration) || duration < 1 || duration > 14) {
    throw new Error('Invalid destination or duration parameters.');
  }
  return {
    destination,
    duration,
    interests: interests || 'general interest',
    budget: budget || 'mid-range',
    style: style || 'spiritual'
  };
};

const validateModerationInput = (body) => {
  const userContent = sanitize(body.userContent);
  if (!userContent || userContent.length > 500) {
    throw new Error('Missing userContent or content exceeds 500 character limit.');
  }
  return { userContent };
};

module.exports = {
  validateGuideInput,
  validateStoryInput,
  validateEventsInput,
  validateItineraryInput,
  validateModerationInput
};
