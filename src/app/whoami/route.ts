import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function GET() {
  const store = await cookies();

  // API antiga do @supabase/ssr: getAll / setAll
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value, options }) => {
            store.set(name, value, options as any);
          });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  return Response.json({
    ok: !error,
    hasUser: !!user,
    userEmail: user?.email ?? null,
    error: error?.message ?? null,
  });
}
