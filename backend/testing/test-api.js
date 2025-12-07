// Using built-in fetch (Node.js 18+)
// If using older Node.js, install node-fetch: npm install node-fetch

import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper function to add timeout to fetch
function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
    )
  ]);
}

// Helper function to make API requests
async function testEndpoint(name, method, url, body = null, headers = {}, expectedStatus = null) {
  testResults.total++;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`${colors.cyan}Testing: ${name}${colors.reset}`);
    console.log(`${colors.blue}  ${method} ${url}${colors.reset}`);
    
    const response = await fetchWithTimeout(url, options);
    const data = await response.json().catch(() => ({ message: response.statusText }));
    
    if (response.ok) {
      console.log(`${colors.green}  ✓ PASSED${colors.reset} (Status: ${response.status})`);
      console.log(`  Response:`, JSON.stringify(data, null, 2));
      testResults.passed++;
      return { success: true, data, status: response.status };
    } else {
      // Check if this is an expected failure
      const isExpected = expectedStatus && response.status === expectedStatus;
      if (isExpected) {
        console.log(`${colors.green}  ✓ PASSED (Expected ${expectedStatus})${colors.reset} (Status: ${response.status})`);
        console.log(`  Response:`, JSON.stringify(data, null, 2));
        testResults.passed++;
        return { success: true, data, status: response.status };
      } else {
        console.log(`${colors.red}  ✗ FAILED${colors.reset} (Status: ${response.status})`);
        console.log(`  Error:`, JSON.stringify(data, null, 2));
        testResults.failed++;
        return { success: false, data, status: response.status };
      }
    }
  } catch (error) {
    console.log(`${colors.red}  ✗ ERROR${colors.reset}`);
    console.log(`  ${error.message}`);
    if (error.message.includes('timeout')) {
      console.log(`  ${colors.yellow}  Server may not be responding. Make sure the server is running.${colors.reset}`);
    }
    testResults.failed++;
    return { success: false, error: error.message };
  } finally {
    console.log('');
  }
}

// Test functions
async function runTests() {
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}  API Test Suite${colors.reset}`);
  console.log(`${colors.cyan}  Base URL: ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);

  // Test 1: Health Check
  await testEndpoint(
    'Health Check',
    'GET',
    `${API_BASE_URL}/api/health`
  );

  // Test 2: Root Endpoint
  await testEndpoint(
    'Root Endpoint',
    'GET',
    `${API_BASE_URL}/`
  );

  // Test 3: Admin Login (with invalid credentials) - Expected 401
  await testEndpoint(
    'Admin Login - Invalid Credentials',
    'POST',
    `${API_BASE_URL}/api/admin/auth/login`,
    {
      email: 'test@example.com',
      password: 'wrongpassword'
    },
    {},
    401
  );

  // Test 4: Admin Login (with valid credentials from .env)
  // Note: Load .env file to get credentials
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log(`${colors.yellow}Note: Using admin credentials from .env file${colors.reset}`);
  console.log(`${colors.yellow}  Email: ${adminEmail}${colors.reset}\n`);
  
  const adminLoginResult = await testEndpoint(
    'Admin Login - Valid Credentials',
    'POST',
    `${API_BASE_URL}/api/admin/auth/login`,
    {
      email: adminEmail,
      password: adminPassword
    }
  );

  let adminToken = null;
  if (adminLoginResult.success && adminLoginResult.data.token) {
    adminToken = adminLoginResult.data.token;
    
    // Test 5: Get Admin Profile (with token)
    await testEndpoint(
      'Get Admin Profile',
      'GET',
      `${API_BASE_URL}/api/admin/auth/profile`,
      null,
      { Authorization: `Bearer ${adminToken}` }
    );

    // Test 6: Get All Plans (requires admin auth)
    await testEndpoint(
      'Get All Plans',
      'GET',
      `${API_BASE_URL}/api/admin/plans`,
      null,
      { Authorization: `Bearer ${adminToken}` }
    );
  }

  // Test 7: Gym Manager Login (with invalid credentials) - Expected 401
  await testEndpoint(
    'Gym Manager Login - Invalid Credentials',
    'POST',
    `${API_BASE_URL}/api/gym/auth/login`,
    {
      email: 'gym@example.com',
      password: 'wrongpassword'
    },
    {},
    401
  );

  // Test 8: Gym Manager Register (new gym manager)
  const gymRegisterResult = await testEndpoint(
    'Gym Manager Register',
    'POST',
    `${API_BASE_URL}/api/gym/auth/register`,
    {
      name: 'Test Manager',
      gymName: 'Test Gym',
      email: `testgym${Date.now()}@example.com`,
      password: 'test123456',
      phone: '1234567890',
      address: '123 Test Street'
    }
  );

  let gymToken = null;
  if (gymRegisterResult.success && gymRegisterResult.data.token) {
    gymToken = gymRegisterResult.data.token;
    
    // Test 9: Get Gym Manager Profile (Expected 403 - subscription expired)
    // Note: New gym managers have 'expired' subscription by default
    await testEndpoint(
      'Get Gym Manager Profile - Expired Subscription',
      'GET',
      `${API_BASE_URL}/api/gym/auth/profile`,
      null,
      { Authorization: `Bearer ${gymToken}` },
      403
    );
  }

  // Test 10: Protected endpoint without token - Expected 401
  await testEndpoint(
    'Get Admin Profile - No Token',
    'GET',
    `${API_BASE_URL}/api/admin/auth/profile`,
    null,
    {},
    401
  );

  // Test 11: Invalid endpoint - Expected 404
  await testEndpoint(
    'Invalid Endpoint',
    'GET',
    `${API_BASE_URL}/api/invalid/endpoint`,
    null,
    {},
    404
  );

  // Print Summary
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}  Test Summary${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Total: ${testResults.total}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test suite error: ${error.message}${colors.reset}`);
  process.exit(1);
});

