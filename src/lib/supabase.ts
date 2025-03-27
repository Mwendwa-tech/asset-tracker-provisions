
// This is a mock implementation as we've removed the Supabase backend
export const supabase = {
  auth: {
    signUp: async () => ({ data: { user: { id: 'mock-id', email: 'mock@example.com' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'mock-id', email: 'mock@example.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: { user: { id: 'mock-id', email: 'mock@example.com' } } }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};

// Mock the Supabase configuration check
export const isSupabaseConfigured = () => true;
