import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "POST") {
    console.log("accounts actions - request");

    const payload = await request.json();

    console.log("accounts actions - payload", payload);
  }

  return redirect("/");
};
