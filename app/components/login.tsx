import { useNavigate, useOutletContext } from "@remix-run/react";
import { Session, SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "database.types";
import { useEffect } from "react";

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

  const handleEmailLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: "valid.email@supabase.io",
      password: "password",
    });
  };

  const handleAnonymousLogin = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (!error) {
      navigate("/");
    } else {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="border border-gray-200 rounded-md"
        onClick={handleEmailLogin}
      >
        Email Login
      </button>
      <button
        className="border border-gray-200 rounded-md"
        onClick={handleAnonymousLogin}
      >
        Anonymous login
      </button>
    </div>
  );
}
