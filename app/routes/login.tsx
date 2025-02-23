import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";

import Login from "../components/login";

export const meta: MetaFunction = () => {
  return [
    { title: "Cashsense" },
    { name: "description", content: "Login to Cashsense" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "DELETE") {
    const response = new Response();

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    );

    const { error } = await supabase.auth.signOut();

    return Response.json(
      {
        error,
      },
      {
        headers: response.headers,
      }
    );
  }
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Login />
    </div>
  );
}
