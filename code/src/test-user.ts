// Test user for authentication debugging
export const TEST_USER = {
  email: "test@safetravel.com",
  password: "testpass123",
  name: "Test User",
  phone: "+1234567890"
};

// Function to create test user - call this in console if needed
export const createTestUser = async () => {
  const authService = await import('./services/authService');
  
  try {
    console.log('Creating test user...');
    const result = await authService.default.signUp(TEST_USER.email, TEST_USER.password, {
      name: TEST_USER.name,
      phone: TEST_USER.phone
    });
    console.log('✅ Test user created successfully:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Error creating test user:', error);
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Test user already exists, that\'s okay');
    }
    throw error;
  }
};

// Add to window for console access
(window as any).createTestUser = createTestUser;
(window as any).TEST_USER = TEST_USER;