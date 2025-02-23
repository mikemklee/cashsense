import { useNavigate, useOutletContext } from "@remix-run/react";
import { Session, SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "database.types";
import { useEffect } from "react";
import { Button } from "./ui/button";

export default function Login() {
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
    <div className="flex flex-col items-center gap-4">
      <Button className="cursor-pointer" onClick={handleAnonymousLogin}>
        Anonymous login
      </Button>
    </div>
  );
}
