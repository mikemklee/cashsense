import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { v4 as uuid } from "uuid";

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "POST") {
    const payload = await request.json();

    const response = new Response();

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // check demo user
    if (user?.email === "demo@cashsense.com") {
      return redirect("/");
    }

    const { error: insertError } = await supabase.from("accounts").insert({
      id: uuid(),
      name: payload.name,
      type: payload.type,
      profile_id: user?.id,
    });

    if (insertError) {
      console.error(insertError);
      throw Error("Unexpected error while adding new account");
    } else {
      return redirect("/");
    }
  }
  return redirect("/");
};
