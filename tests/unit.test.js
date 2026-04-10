/**
 * Unit Tests — no server or database required.
 * Run with: node tests/unit.test.js
 */

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

// --- Sanitize helper (mirrors server logic) ---
function sanitize(value) {
  return String(value || '')
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- Email validation (mirrors server logic) ---
function isValidEmail(email) {
  return email.includes('@') && email.includes('.');
}

// --- Password validation ---
function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// --- formatEvent helper ---
function formatEvent(event) {
  return {
    id: event._id ? event._id.toString() : '',
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    date: event.date || '',
    attendees: event.attendees || 0,
    capacity: event.capacity || 0,
    isPublic: event.isPublic !== undefined ? event.isPublic : true,
  };
}

// ============================
// Test Suite: Input Sanitization
// ============================
console.log('\n📋 Input Sanitization Tests');

assert('sanitize removes leading/trailing whitespace', sanitize('  hello  ') === 'hello');
assert('sanitize escapes < character', sanitize('<script>') === '&lt;script&gt;');
assert('sanitize escapes > character', sanitize('alert()>') === 'alert()&gt;');
assert('sanitize handles null input', sanitize(null) === '');
assert('sanitize handles undefined input', sanitize(undefined) === '');
assert('sanitize preserves normal strings', sanitize('Hello World') === 'Hello World');
assert('sanitize escapes both < and >', sanitize('<b>bold</b>') === '&lt;b&gt;bold&lt;/b&gt;');

// ============================
// Test Suite: Email Validation
// ============================
console.log('\n📋 Email Validation Tests');

assert('valid email passes', isValidEmail('user@example.com'));
assert('email without @ fails', !isValidEmail('userexample.com'));
assert('email without . fails', !isValidEmail('user@examplecom'));
assert('empty string fails', !isValidEmail(''));
assert('email with subdomain passes', isValidEmail('user@mail.example.com'));

// ============================
// Test Suite: Password Validation
// ============================
console.log('\n📋 Password Validation Tests');

assert('password of 6+ chars passes', isValidPassword('abc123'));
assert('password of exactly 6 chars passes', isValidPassword('123456'));
assert('password of 5 chars fails', !isValidPassword('12345'));
assert('empty password fails', !isValidPassword(''));
assert('non-string fails', !isValidPassword(12345));

// ============================
// Test Suite: Event Formatting
// ============================
console.log('\n📋 Event Formatting Tests');

const mockEvent = {
  _id: { toString: () => 'event123' },
  title: 'Test Event',
  description: 'A test event',
  category: 'Music',
  date: '2026-06-01',
  attendees: 10,
  capacity: 100,
  isPublic: true,
};

const formatted = formatEvent(mockEvent);
assert('event id is formatted correctly', formatted.id === 'event123');
assert('event title is preserved', formatted.title === 'Test Event');
assert('event attendees defaults correctly', formatted.attendees === 10);
assert('event isPublic preserved', formatted.isPublic === true);

const emptyEvent = formatEvent({});
assert('empty event has empty title', emptyEvent.title === '');
assert('empty event attendees default to 0', emptyEvent.attendees === 0);
assert('empty event isPublic defaults to true', emptyEvent.isPublic === true);

// ============================
// Test Suite: Name Validation
// ============================
console.log('\n📋 Name Validation Tests');

function isValidName(name) {
  return typeof name === 'string' && name.trim().length >= 2;
}

assert('name of 2+ chars passes', isValidName('Jo'));
assert('name of 1 char fails', !isValidName('J'));
assert('empty name fails', !isValidName(''));
assert('whitespace-only name fails', !isValidName('  '));
assert('normal name passes', isValidName('John Doe'));

// ============================
// Summary
// ============================
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ All tests passed!\n');
}
