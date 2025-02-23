import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { PiggyBank } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return Response.json(
    {
      session,
    },
    {
      headers: response.headers,
    }
  );
};

function Header() {
  const { session } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  if (!session) return null;

  return (
    <div className="flex gap-4 py-3 items-center border-b border-gray-700">
      <div className="flex items-center gap-x-6">
        <Link to="/">
          <div className="flex items-center text-3xl font-display">
            Cashsense
            <PiggyBank className="ml-2 mt-2" />
          </div>
        </Link>
      </div>
      <div className="flex-1 flex gap-2" />
      <Avatar
        onClick={() =>
          submit({ myKey: "myValue" }, { method: "delete", action: "/login" })
        }
        className="cursor-pointer"
      >
        <AvatarImage src="https://lh3.googleusercontent.com/-KFSt35NjpxY/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknMyLoIN-2gxrsvd4INDZPQcIhSwA/photo.jpg?sz=46" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default Header;
