import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "POST") {
    const payload = await request.json();

    // TODO: implement
    console.log("transactions actions - payload", payload);
  }

  return redirect("/");
};
