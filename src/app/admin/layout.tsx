import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.email?.endsWith("@febeflo.com")) {
    redirect("/"); // Or a custom "Access Denied" page
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
