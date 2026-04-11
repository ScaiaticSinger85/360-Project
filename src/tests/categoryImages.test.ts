import { describe, it, expect } from 'vitest';
import { getCategoryImage } from '../app/utils/categoryImages';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80';

describe('getCategoryImage', () => {
  it('returns a URL for Music category', () => {
    const url = getCategoryImage('Music');
    expect(url).toContain('https://');
    expect(url).not.toBe(DEFAULT_IMAGE);
  });

  it('returns a URL for Food & Drink category', () => {
    const url = getCategoryImage('Food & Drink');
    expect(url).toContain('https://');
    expect(url).not.toBe(DEFAULT_IMAGE);
  });

  it('returns a URL for Technology category', () => {
    const url = getCategoryImage('Technology');
    expect(url).toContain('unsplash.com');
  });

  it('returns a URL for Sports & Fitness category', () => {
    const url = getCategoryImage('Sports & Fitness');
    expect(url).toContain('https://');
  });

  it('returns a URL for Arts & Culture category', () => {
    const url = getCategoryImage('Arts & Culture');
    expect(url).toContain('https://');
  });

  it('returns the default image for an unknown category', () => {
    const url = getCategoryImage('Unknown Category');
    expect(url).toBe(DEFAULT_IMAGE);
  });

  it('returns the default image for an empty string', () => {
    const url = getCategoryImage('');
    expect(url).toBe(DEFAULT_IMAGE);
  });

  it('returns a string (not undefined or null) for any category', () => {
    const categories = ['Music', 'Community', 'Health', 'Party', 'Education', 'Social'];
    categories.forEach((cat) => {
      expect(typeof getCategoryImage(cat)).toBe('string');
      expect(getCategoryImage(cat).length).toBeGreaterThan(0);
    });
  });
});
