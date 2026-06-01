import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=/dashboard`);
  return <DashboardShell />;
}
