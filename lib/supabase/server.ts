import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
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
        signInWithPassword: async () => ({ data: { user: {} }, error: null }),
        signUp: async () => ({ data: { user: {} }, error: null }),
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

  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string, value: string, options?: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
        }
      },
    },
  });
}
