import AdminDashBoard from "@/app/components/dashboard/AdminDashboard";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import {  transformTeams, transFormUsers } from "@/app/lib/utils";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const user = await getCurrentUser();
  if (!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect("/unauthorized");
  }

  //Fetch data for admin dashboard

  const [prismaUsers, prismaTeams] = await Promise.all([
    prisma.user.findMany({
      include: {
        team: true,
      },
      omit: { password: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const users = transFormUsers(prismaUsers);
  const teams = transformTeams(prismaTeams);

  return (
    <AdminDashBoard
      users={users}
      teams={teams}
      currentUser={user}
    />
  );
};

export default AdminPage;
