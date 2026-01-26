import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/AdminLayoutClient";

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
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
