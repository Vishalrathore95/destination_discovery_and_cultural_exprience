import { formatDate, truncateText, capitalizeWords } from '../../utils/formatters';

describe('formatters utilities', () => {
  describe('truncateText', () => {
    it('returns text unchanged if under limit', () => {
      expect(truncateText('Hello World', 100)).toBe('Hello World');
    });

    it('truncates and appends ellipsis when over limit', () => {
      const result = truncateText('Hello World', 5);
      expect(result).toHaveLength(8); // 5 chars + '...'
      expect(result).toMatch(/\.\.\.$/);
    });

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('tokyo cultural tour')).toBe('Tokyo Cultural Tour');
    });

    it('handles single word', () => {
      expect(capitalizeWords('japan')).toBe('Japan');
    });
  });

  describe('formatDate', () => {
    it('returns a formatted date string', () => {
      const result = formatDate('2024-03-15');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles invalid date gracefully', () => {
      const result = formatDate('not-a-date');
      expect(typeof result).toBe('string');
    });
  });
});
