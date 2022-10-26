import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-5">
      <Link href="/">
        <button className="text-lg font-normal">Creative Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <a className="py-2 px-4 text-sm bg-[#5F9DF7] text-white font-medium rounded-lg ml-8">
              Join Now
            </a>
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-[#5F9DF7] text-white py-2 px-4 rounded-md text-sm">Post</button>
            </Link>
            <Link href="/dashboard">
              <img src={user.photoURL} className="w-12 rounded-full cursor-pointer"/>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
