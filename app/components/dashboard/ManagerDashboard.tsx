"use client";
import { Role, SafeUser, User } from "@/app/types";
import React from "react";

export type MemberWithTeam = SafeUser & {
  team: {
    id: string;
    name: string;
    code: string;
    description: string | null; // Prisma returns null, not undefined
  } | null;
};

interface ManagerDashboardProps {
  myTeamMembers: User[];
  allTeamMembers: User[];
  currentUser: User
}

const roleStyles: Record<Role, string> = {
  USER: "bg-slate-800 text-slate-300",
  MANAGER: "bg-purple-950 text-purple-300",
  ADMIN: "bg-red-950 text-red-300",
};

const Avatar = ({ label }: { label: string }) => (
  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold uppercase text-white">
    {label.charAt(0)}
  </div>
);

const RoleBadge = ({ role }: { role: Role }) => (
  <span className={`rounded-md px-3 py-1 text-sm font-medium ${roleStyles[role]}`}>
    {role}
  </span>
);

const UserCell = ({
  user,
  isSelf,
}: {
  user: Pick<SafeUser, "name" | "email">;
  isSelf: boolean;
}) => {
  const displayName = user.name ?? user.email;
  return (
    <div className="flex items-center gap-3">
      <Avatar label={displayName} />
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-100">
          {displayName}
          {isSelf && <span className="ml-2 text-sm text-slate-500">(You)</span>}
        </p>
        <p className="truncate text-sm text-slate-400">{user.email}</p>
      </div>
    </div>
  );
};

const ManagerDashboard = ({
  myTeamMembers,
  allTeamMembers,
  currentUser,
}: ManagerDashboardProps) => {
  const myTeam = allTeamMembers.find((m) => m.teamId === currentUser.teamId)?.team;

  return (
    <div className="px-6 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">Manager Dashboard</h1>
        <p className="mt-3 text-xl text-slate-300">Team management view</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------- My team members ---------- */}
        <section className="self-start rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-6 py-6">
            <h2 className="text-2xl font-semibold text-white">
              My Team ({myTeamMembers.length})
            </h2>
            <p className="mt-1 text-lg text-slate-400">
              {myTeam ? (
                <>
                  {myTeam.name}{" "}
                  <span className="rounded-md bg-blue-950 px-2 py-0.5 text-sm text-blue-300">
                    {myTeam.code}
                  </span>
                </>
              ) : (
                "Members of your team"
              )}
            </p>
          </div>

          <div className="overflow-x-auto px-6 py-4">
            {!currentUser.teamId ? (
              <p className="py-8 text-center text-slate-400">
                You are not assigned to a team yet.
              </p>
            ) : myTeamMembers.length === 0 ? (
              <p className="py-8 text-center text-slate-400">
                No members in your team yet.
              </p>
            ) : (
              <table className="w-full min-w-[360px] text-left">
                <thead>
                  <tr className="text-lg font-semibold text-slate-200">
                    <th className="pb-4 pr-4">Name</th>
                    <th className="pb-4">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {myTeamMembers.map((member) => (
                    <tr key={member.id} className="border-t border-slate-800">
                      <td className="py-4 pr-4">
                        <UserCell user={member} isSelf={member.id === currentUser.id} />
                      </td>
                      <td className="py-4">
                        <RoleBadge role={member.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ---------- All team members ---------- */}
        <section className="self-start rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-6 py-6">
            <h2 className="text-2xl font-semibold text-white">
              All Members ({allTeamMembers.length})
            </h2>
            <p className="mt-1 text-lg text-slate-400">Overview across all teams</p>
          </div>

          <div className="overflow-x-auto px-6 py-4">
            {allTeamMembers.length === 0 ? (
              <p className="py-8 text-center text-slate-400">No members found.</p>
            ) : (
              <table className="w-full min-w-[480px] text-left">
                <thead>
                  <tr className="text-lg font-semibold text-slate-200">
                    <th className="pb-4 pr-4">Name</th>
                    <th className="pb-4 pr-4">Role</th>
                    <th className="pb-4">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {allTeamMembers.map((member) => (
                    <tr key={member.id} className="border-t border-slate-800">
                      <td className="py-4 pr-4">
                        <UserCell user={member} isSelf={member.id === currentUser.id} />
                      </td>
                      <td className="py-4 pr-4">
                        <RoleBadge role={member.role} />
                      </td>
                      <td className="py-4">
                        {member.team ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-100">{member.team.name}</span>
                            <span className="rounded-md bg-blue-950 px-2 py-0.5 text-sm text-blue-300">
                              {member.team.code}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">No Team</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManagerDashboard;
