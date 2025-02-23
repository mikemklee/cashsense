import type {
  ActionFunctionArgs,
  MetaFunction,
  Session,
} from "@remix-run/node";
import { useNavigate, useOutletContext } from "@remix-run/react";
import {
  createServerClient,
  SupabaseClient,
} from "@supabase/auth-helpers-remix";
import type { Database } from "database.types";
import { useEffect } from "react";

import { Button } from "~/components/ui/button";

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
  const { supabase, session } = useOutletContext<{
    supabase: SupabaseClient<Database>;
    session: Session | null;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleAnonymousLogin = async () => {
    const { error } = await supabase.auth.signInAnonymously();

    if (!error) {
      navigate("/");
    } else {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Button className="cursor-pointer" onClick={handleAnonymousLogin}>
          Anonymous login
        </Button>
      </div>
    </div>
  );
}
