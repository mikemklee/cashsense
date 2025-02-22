import { Link } from "@remix-run/react";
import { PiggyBank } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

function Header() {
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
      <div className="flex-1 flex gap-2"></div>
      <div className="">
        <Avatar>
          <AvatarImage src="https://lh3.googleusercontent.com/-KFSt35NjpxY/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknMyLoIN-2gxrsvd4INDZPQcIhSwA/photo.jpg?sz=46" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Header;
