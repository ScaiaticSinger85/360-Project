/**
 * Server Integration Tests — requires server running on localhost:4000
 * Run with: node tests/server.test.js
 *
 * Tests:
 *  - Signup with valid data
 *  - Signup with duplicate email
 *  - Signup with missing fields
 *  - Signin with valid credentials
 *  - Signin with wrong password
 *  - Create event
 *  - Get all events
 *  - Post and fetch a comment
 *  - Delete event
 */

const BASE = 'http://localhost:4000/api';

let passed = 0;
let failed = 0;
let createdEventId = null;
let createdCommentId = null;

const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'Test1234';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🔐 Auth Tests\n');

  // Signup - valid
  try {
    const { status, data } = await request('POST', '/auth/signup', {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      passwordConfirm: testPassword,
    });
    assert('Signup returns 201', status === 201);
    assert('Signup returns success:true', data.success === true);
    assert('Signup returns user object', !!data.user);
    assert('Signup user has id', !!data.user?.id);
    assert('Signup user has email', data.user?.email === testEmail);
  } catch (e) {
    console.error('  ❌ Signup test crashed:', e.message);
    failed++;
  }

  // Signup - duplicate email
  try {
    const { status, data } = await request('POST', '/auth/signup', {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      passwordConfirm: testPassword,
    });
    assert('Duplicate signup returns 400', status === 400);
    assert('Duplicate signup returns success:false', data.success === false);
  } catch (e) {
    console.error('  ❌ Duplicate signup test crashed:', e.message);
    failed++;
  }

  // Signup - missing fields
  try {
    const { status, data } = await request('POST', '/auth/signup', { name: 'Test' });
    assert('Missing fields signup returns 400', status === 400);
    assert('Missing fields signup returns success:false', data.success === false);
  } catch (e) {
    console.error('  ❌ Missing fields test crashed:', e.message);
    failed++;
  }

  // Signin - valid
  try {
    const { status, data } = await request('POST', '/auth/signin', {
      email: testEmail,
      password: testPassword,
    });
    assert('Signin returns 200', status === 200);
    assert('Signin returns success:true', data.success === true);
    assert('Signin returns user object', !!data.user);
  } catch (e) {
    console.error('  ❌ Signin test crashed:', e.message);
    failed++;
  }

  // Signin - wrong password
  try {
    const { status, data } = await request('POST', '/auth/signin', {
      email: testEmail,
      password: 'wrongpassword',
    });
    assert('Wrong password returns 401', status === 401);
    assert('Wrong password returns success:false', data.success === false);
  } catch (e) {
    console.error('  ❌ Wrong password test crashed:', e.message);
    failed++;
  }

  // Signin - non-existent user
  try {
    const { status, data } = await request('POST', '/auth/signin', {
      email: 'nobody@nowhere.com',
      password: 'anything',
    });
    assert('Non-existent user returns 401', status === 401);
    assert('Non-existent user returns success:false', data.success === false);
  } catch (e) {
    console.error('  ❌ Non-existent user test crashed:', e.message);
    failed++;
  }

  console.log('\n📅 Event Tests\n');

  // Get all events
  try {
    const { status, data } = await request('GET', '/events');
    assert('Get events returns 200', status === 200);
    assert('Get events returns success:true', data.success === true);
    assert('Get events returns array', Array.isArray(data.events));
  } catch (e) {
    console.error('  ❌ Get events test crashed:', e.message);
    failed++;
  }

  // Create event
  try {
    const { status, data } = await request('POST', '/events', {
      title: 'Test Event from Tests',
      description: 'This is a test event created by the test suite',
      category: 'Technology',
      date: '2026-12-01',
      time: '18:00',
      location: 'Test Venue',
      address: '123 Test St, Kelowna, BC',
      capacity: 50,
      imageUrl: 'https://via.placeholder.com/800x400',
      organizer: 'Test User',
      organizerId: 'test_user_id',
      isPublic: true,
    });
    assert('Create event returns 201', status === 201);
    assert('Create event returns success:true', data.success === true);
    assert('Create event returns event object', !!data.event);
    assert('Create event has id', !!data.event?.id);
    createdEventId = data.event?.id;
  } catch (e) {
    console.error('  ❌ Create event test crashed:', e.message);
    failed++;
  }

  // Create event - missing fields
  try {
    const { status, data } = await request('POST', '/events', { title: 'Incomplete' });
    assert('Incomplete event returns 400', status === 400);
    assert('Incomplete event returns success:false', data.success === false);
  } catch (e) {
    console.error('  ❌ Incomplete event test crashed:', e.message);
    failed++;
  }

  console.log('\n💬 Comment Tests\n');

  if (createdEventId) {
    // Add comment
    try {
      const { status, data } = await request('POST', `/events/${createdEventId}/comments`, {
        userId: 'test_user_id',
        userName: 'Test User',
        text: 'This is a test comment',
      });
      assert('Add comment returns 201', status === 201);
      assert('Add comment returns success:true', data.success === true);
      assert('Add comment returns comment object', !!data.comment);
      createdCommentId = data.comment?.id;
    } catch (e) {
      console.error('  ❌ Add comment test crashed:', e.message);
      failed++;
    }

    // Get comments
    try {
      const { status, data } = await request('GET', `/events/${createdEventId}/comments`);
      assert('Get comments returns 200', status === 200);
      assert('Get comments returns success:true', data.success === true);
      assert('Get comments returns array', Array.isArray(data.comments));
      assert('Get comments contains our comment', data.comments.some((c) => c.text === 'This is a test comment'));
    } catch (e) {
      console.error('  ❌ Get comments test crashed:', e.message);
      failed++;
    }

    // Delete comment
    if (createdCommentId) {
      try {
        const { status, data } = await request('DELETE', `/events/${createdEventId}/comments/${createdCommentId}`);
        assert('Delete comment returns 200', status === 200);
        assert('Delete comment returns success:true', data.success === true);
      } catch (e) {
        console.error('  ❌ Delete comment test crashed:', e.message);
        failed++;
      }
    }

    // Delete event (cleanup)
    try {
      const { status, data } = await request('DELETE', `/events/${createdEventId}`);
      assert('Delete event returns 200', status === 200);
      assert('Delete event returns success:true', data.success === true);
    } catch (e) {
      console.error('  ❌ Delete event test crashed:', e.message);
      failed++;
    }
  } else {
    console.log('  ⚠️  Skipping comment and delete tests (event creation failed)');
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('✅ All tests passed!\n');
  }
}

runTests().catch((e) => {
  console.error('\n❌ Could not connect to server. Make sure it is running on localhost:4000');
  console.error(e.message);
  process.exit(1);
});
