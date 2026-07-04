// Mock axios and apiClient before importing the service
jest.mock('axios');
jest.mock('../../services/apiClient', () => ({
  post: jest.fn(),
}));

import axios from 'axios';
import apiClient from '../../services/apiClient';
import {
  generateDestinationGuide,
  generateStory,
  generateEvents,
  askChatbot,
  moderateContent,
  generateVocabulary,
  generateVirtualImmersion,
  generateFoodPairings,
} from '../../services/geminiService';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('geminiService', () => {
  describe('generateDestinationGuide', () => {
    it('returns error object when destination is empty', async () => {
      const result = await generateDestinationGuide('');
      expect(result).toEqual({ error: 'Destination cannot be empty.' });
    });

    it('calls Cloud Function and returns data on success', async () => {
      const mockData = { overview: { description: 'Tokyo overview' } };
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await generateDestinationGuide('Tokyo', 'spiritual', 'spring');
      expect(apiClient.post).toHaveBeenCalledWith('/generateGuide', {
        destination: 'Tokyo',
        style: 'spiritual',
        season: 'spring',
      });
      expect(result).toEqual(mockData);
    });

    it('falls back to direct API when Cloud Function fails and no API key', async () => {
      apiClient.post.mockRejectedValueOnce(new Error('Network error'));
      // No API key set — should return an error object
      const result = await generateDestinationGuide('Kyoto');
      expect(result).toHaveProperty('error');
    });
  });

  describe('generateStory', () => {
    it('calls Cloud Function with correct params', async () => {
      const mockData = { story: 'Once upon a time...' };
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await generateStory('Fushimi Inari', 'Kyoto');
      expect(apiClient.post).toHaveBeenCalledWith('/generateStory', {
        attractionName: 'Fushimi Inari',
        destination: 'Kyoto',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('askChatbot', () => {
    it('calls chatbot endpoint and returns response', async () => {
      const mockData = { response: 'Remove shoes before entering.' };
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await askChatbot('What are Japanese customs?', 'Tokyo');
      expect(result).toEqual(mockData);
    });
  });

  describe('moderateContent', () => {
    it('calls moderation endpoint with user content', async () => {
      const mockData = { isSafe: true, summary: 'Helpful review', ratingScore: 5 };
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await moderateContent('This place is amazing!');
      expect(apiClient.post).toHaveBeenCalledWith('/moderateContent', {
        userContent: 'This place is amazing!',
      });
      expect(result.isSafe).toBe(true);
    });
  });

  describe('generateVocabulary', () => {
    it('calls generateVocabulary endpoint with destination', async () => {
      const mockData = [{ phrase: 'Konnichiwa', meaning: 'Hello' }];
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await generateVocabulary('Kyoto');
      expect(apiClient.post).toHaveBeenCalledWith('/generateVocabulary', { destination: 'Kyoto' });
      expect(result).toEqual(mockData);
    });
  });

  describe('generateVirtualImmersion', () => {
    it('calls generateVirtualImmersion endpoint with siteName and destination', async () => {
      const mockData = { title: 'Temple Meditation' };
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await generateVirtualImmersion('Kinkaku-ji', 'Kyoto');
      expect(apiClient.post).toHaveBeenCalledWith('/generateVirtualImmersion', { siteName: 'Kinkaku-ji', destination: 'Kyoto' });
      expect(result).toEqual(mockData);
    });
  });

  describe('generateFoodPairings', () => {
    it('calls generateFoodPairings endpoint with destination and attractionName', async () => {
      const mockData = [{ dishName: 'Ramen' }];
      apiClient.post.mockResolvedValueOnce({ data: mockData });
      const result = await generateFoodPairings('Kyoto', 'Kinkaku-ji');
      expect(apiClient.post).toHaveBeenCalledWith('/generateFoodPairings', { destination: 'Kyoto', attractionName: 'Kinkaku-ji' });
      expect(result).toEqual(mockData);
    });
  });
});
