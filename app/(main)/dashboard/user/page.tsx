import UserDashboard from "@/app/components/dashboard/UserDashboard";
import  { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

import { redirect } from "next/navigation";

const UserPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  //Fetch user-specific data
  const teamMembers = user.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      })
    : [];

  return <UserDashboard teamMembers={teamMembers} currentUser={user} />;
};

export default UserPage;
