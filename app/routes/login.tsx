import type { MetaFunction } from "@remix-run/node";

import Login from "../components/login";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Login />
    </div>
  );
}
