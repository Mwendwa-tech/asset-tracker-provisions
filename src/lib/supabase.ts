
// This is a mock implementation as we've removed the Supabase backend
export const supabase = {
  auth: {
    signUp: async () => ({ data: { user: { id: 'mock-id', email: 'mock@example.com' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'mock-id', email: 'mock@example.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: { user: { id: 'mock-id', email: 'mock@example.com' } } }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  // Mock database methods
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        then: (callback: any) => callback({ 
          data: [], 
          error: null 
        }),
      }),
      single: () => ({
        then: (callback: any) => callback({ 
          data: null, 
          error: null 
        }),
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => ({
          then: (callback: any) => callback({ 
            data: null, 
            error: null 
          }),
        })
      })
    }),
    update: () => ({
      eq: () => ({
        then: (callback: any) => callback({ 
          data: null, 
          error: null 
        }),
      })
    }),
    delete: () => ({
      eq: () => ({
        then: (callback: any) => callback({ 
          data: null, 
          error: null 
        }),
      })
    })
  })
};

// Mock the Supabase configuration check
export const isSupabaseConfigured = () => true;
