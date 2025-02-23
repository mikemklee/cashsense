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

    const { error: insertError } = await supabase.from("categories").insert({
      id: uuid(),
      name: payload.name,
      color: payload.color,
      profile_id: user?.id,
    });

    if (insertError) {
      console.error(insertError);
      throw Error("Unexpected error while adding new category");
    } else {
      return redirect("/");
    }
  }
  return redirect("/");
};
