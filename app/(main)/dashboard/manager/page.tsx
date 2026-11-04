import ManagerDashboard from "@/app/components/dashboard/ManagerDashboard";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { transformTeams, transFormUsers } from "@/app/lib/utils";
import { Role, User } from "@/app/types";
import { redirect } from "next/navigation";

const ManagerPage = async () => {
  const user = await getCurrentUser();
  if (!user || !checkUserPermission(user, Role.MANAGER)) {
    redirect("/unauthorized");
  }

  //Fetch managers own team members

  const prismaMyteamMembers = user.teamId
    ? await prisma.user.findMany({
        where: {
          teamId: user.teamId,
          role: { not: Role.ADMIN },
        },
        include: {
          team: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  //fetch all team members acorss team view - exclude sensitive field

  const prismaAllteamMembers = await prisma.user.findMany({
    where: {
      role: { not: Role.ADMIN },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      },
    },
      orderBy: {
        teamId: "desc",
      },
  });

  const myTeamMembers = transFormUsers(prismaMyteamMembers);
  const allTeammembers = transformTeams(prismaAllteamMembers);

  return (
    <ManagerDashboard
      myTeamMembers={prismaMyteamMembers as User[]}
      allTeamMembers={prismaAllteamMembers as User[]}
      currentUser={user}
    />
  );
};

export default ManagerPage;
