import { getDB } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export default async function Page() {
  const { userId } = auth();

  const posts = await getDB().post.findMany({});
  console.log("posts", posts);
  console.log("process env", process.env.NODE_ENV);
  return (
    <div className="p-4">
      <h3>{process.env.NODE_ENV}</h3>
      <hr />
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id}>
            {post.title} | {post.userId === userId ? "Me" : "Other"}
          </div>
        ))}
      </div>
    </div>
  );
}
