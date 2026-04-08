// Re-export everything from the database modules
export * from './database';
export * from './auth';
export * from './queries';

// Helper function to get authenticated user (for server components)
export async function getUser() {
  const { getAuthToken, getCurrentUser } = await import('./auth');
  const token = await getAuthToken();
  if (!token) return null;
  return getCurrentUser(token);
}

// Helper to require authentication
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Helper to require admin role
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}
