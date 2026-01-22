import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

  if (isMock) {
    // Return pure mock client without any real Supabase connection
    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "mock-admin-id",
              email: "muryllooliveira2017@gmail.com",
              app_metadata: { role: "ADMIN" },
              user_metadata: { role: "ADMIN" },
            },
          },
          error: null,
        }),
        signInWithPassword: async ({ email, password }: any) => {
          if (email === "muryllooliveira2017@gmail.com" && password === "Mijg123@") {
            document.cookie = "mock-token=admin-valid; path=/; max-age=3600";
            return {
              data: {
                user: {
                  id: "mock-admin-id",
                  email: "muryllooliveira2017@gmail.com",
                  app_metadata: { role: "ADMIN" },
                  user_metadata: { role: "ADMIN" },
                },
                session: { access_token: "mock-token" }
              },
              error: null,
            };
          }
          return { data: { user: null }, error: { message: "Invalid credentials (Mock Mode)" } };
        },
        signUp: async () => ({
          data: { user: { id: "mock-user-id" } },
          error: null,
        }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: {}, error: null }),
            maybeSingle: () => Promise.resolve({ data: {}, error: null }),
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => Promise.resolve({ data: {}, error: null }),
        update: () => ({
          eq: () => Promise.resolve({ data: {}, error: null }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: {}, error: null }),
        }),
      }),
    } as any;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(url, anon);
}
