import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import AddBookmarkForm from "@/components/add-bookmark-form";
import BookmarkList from "@/components/bookmark-list";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  console.log("User:", user);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Header email={user.user_metadata.full_name ?? ""} />
      <AddBookmarkForm />
      <div className="mt-8">
        <BookmarkList userId={user.id} />
      </div>
    </main>
  );
}
