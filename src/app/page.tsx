import { api } from "@/lib/trpc/server";
import {
  auth,
  currentUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { CreatePost } from "./_components/create-post";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const { userId } = auth();

  const user = await currentUser();

  return (
    <main className="min-h-screen p-4">
      <div className="flex items-center justify-between">
        <div>at4-kit</div>
        <div>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl">
              {userId && <span>Logged in as {user?.username}</span>}
            </p>
          </div>
        </div>
        {userId && <CrudShowcase />}
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.title}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
