import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <div>hello</div>
      <Link href="/users">
        <Button>Users</Button>
      </Link>
    </div>
  );
}
