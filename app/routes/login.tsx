import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useNavigate, useOutletContext } from "@remix-run/react";
import {
  createServerClient,
  SupabaseClient,
  User,
} from "@supabase/auth-helpers-remix";
import type { Database } from "database.types";
import { PiggyBank } from "lucide-react";
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
  const { supabase, user } = useOutletContext<{
    supabase: SupabaseClient<Database>;
    user: User | null;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAnonymousLogin = async () => {
    const { error } = await supabase.auth.signInAnonymously();

    if (!error) {
      navigate("/");
    } else {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <div className="flex items-center text-3xl font-display">
        Cashsense
        <PiggyBank className="ml-2 mt-2" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button className="cursor-pointer" onClick={handleAnonymousLogin}>
          Sign in as demo user
        </Button>
      </div>
    </div>
  );
}
