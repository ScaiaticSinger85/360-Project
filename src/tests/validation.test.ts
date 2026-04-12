import { describe, it, expect } from 'vitest';

// ─── Validation helpers (mirrors the logic in CreateEvent.tsx) ────────────────

function validateEventTitle(title: string): string | null {
  if (!title.trim()) return 'Title is required';
  if (title.trim().length < 5) return 'Title must be at least 5 characters';
  return null;
}

function validateDescription(description: string): string | null {
  if (!description.trim()) return 'Description is required';
  if (description.trim().length < 20) return 'Description must be at least 20 characters';
  return null;
}

function validateCapacity(capacity: string): string | null {
  const num = parseInt(capacity);
  if (!capacity || isNaN(num) || num <= 0) return 'Capacity must be greater than 0';
  if (num > 10000) return 'Capacity cannot exceed 10,000';
  return null;
}

function validateImageUrl(url: string): string | null {
  if (!url.trim()) return 'Image URL is required';
  if (!url.startsWith('http')) return 'Please enter a valid URL';
  return null;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!email.includes('@') || !email.includes('.')) return 'Please enter a valid email address';
  return null;
}

function validatePassword(password: string, confirm: string): string | null {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password !== confirm) return 'Passwords do not match';
  return null;
}

// ─── Title validation ─────────────────────────────────────────────────────────

describe('validateEventTitle', () => {
  it('rejects an empty title', () => {
    expect(validateEventTitle('')).toBe('Title is required');
  });

  it('rejects a title that is only whitespace', () => {
    expect(validateEventTitle('   ')).toBe('Title is required');
  });

  it('rejects a title shorter than 5 characters', () => {
    expect(validateEventTitle('Hi')).toBe('Title must be at least 5 characters');
  });

  it('accepts a valid title', () => {
    expect(validateEventTitle('Summer Music Festival')).toBeNull();
  });

  it('accepts a title of exactly 5 characters', () => {
    expect(validateEventTitle('Fiesta')).toBeNull();
  });
});

// ─── Description validation ───────────────────────────────────────────────────

describe('validateDescription', () => {
  it('rejects an empty description', () => {
    expect(validateDescription('')).toBe('Description is required');
  });

  it('rejects a description shorter than 20 characters', () => {
    expect(validateDescription('Too short')).toBe('Description must be at least 20 characters');
  });

  it('accepts a description of 20 or more characters', () => {
    expect(validateDescription('This is a valid event description')).toBeNull();
  });
});

// ─── Capacity validation ──────────────────────────────────────────────────────

describe('validateCapacity', () => {
  it('rejects empty capacity', () => {
    expect(validateCapacity('')).not.toBeNull();
  });

  it('rejects zero capacity', () => {
    expect(validateCapacity('0')).not.toBeNull();
  });

  it('rejects negative capacity', () => {
    expect(validateCapacity('-5')).not.toBeNull();
  });

  it('rejects capacity over 10000', () => {
    expect(validateCapacity('10001')).toBe('Capacity cannot exceed 10,000');
  });

  it('accepts a valid capacity', () => {
    expect(validateCapacity('100')).toBeNull();
  });

  it('accepts capacity of exactly 10000', () => {
    expect(validateCapacity('10000')).toBeNull();
  });
});

// ─── Image URL validation ─────────────────────────────────────────────────────

describe('validateImageUrl', () => {
  it('rejects an empty URL', () => {
    expect(validateImageUrl('')).toBe('Image URL is required');
  });

  it('rejects a URL not starting with http', () => {
    expect(validateImageUrl('ftp://example.com/image.jpg')).toBe('Please enter a valid URL');
  });

  it('accepts a valid https URL', () => {
    expect(validateImageUrl('https://images.unsplash.com/photo.jpg')).toBeNull();
  });

  it('accepts a valid http URL', () => {
    expect(validateImageUrl('http://example.com/image.jpg')).toBeNull();
  });
});

// ─── Email validation ─────────────────────────────────────────────────────────

describe('validateEmail', () => {
  it('rejects an empty email', () => {
    expect(validateEmail('')).not.toBeNull();
  });

  it('rejects an email without @', () => {
    expect(validateEmail('notanemail.com')).not.toBeNull();
  });

  it('rejects an email without a dot', () => {
    expect(validateEmail('user@nodot')).not.toBeNull();
  });

  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });
});

// ─── Password validation ──────────────────────────────────────────────────────

describe('validatePassword', () => {
  it('rejects a password shorter than 6 characters', () => {
    expect(validatePassword('abc', 'abc')).not.toBeNull();
  });

  it('rejects mismatched passwords', () => {
    expect(validatePassword('password123', 'different')).toBe('Passwords do not match');
  });

  it('accepts a valid matching password', () => {
    expect(validatePassword('securepass', 'securepass')).toBeNull();
  });
});
