import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { MousePointerClick } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { loader as rootLoader } from "~/root";

function Header() {
  const loaderData = useLoaderData<typeof rootLoader>();
  const submit = useSubmit();

  if (!loaderData?.user) return null;

  return (
    <div className="flex gap-4 py-3 items-center border-b border-gray-700">
      <div className="flex items-center gap-x-6">
        <Link to="/">
          <div className="flex items-center text-3xl font-display">
            Cashsense
            <MousePointerClick className="ml-2 mt-2" />
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
        <AvatarImage src={loaderData.avatarUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default Header;
