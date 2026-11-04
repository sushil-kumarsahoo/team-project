"use client";
import { Role, SafeUser } from "@/app/types";
import React from "react";

type TeamMember = Pick<SafeUser, "id" | "name" | "email" | "role">;

interface UserDashboardProps {
  teamMembers: TeamMember[];
  currentUser: Pick<
    SafeUser,
    "id" | "name" | "email" | "role" | "teamId" | "createdAt"
  >;
}

const roleStyles: Record<Role, string> = {
  USER: "bg-slate-800 text-slate-300",
  MANAGER: "bg-purple-950 text-purple-300",
  ADMIN: "bg-red-950 text-red-300",
};

const RoleBadge = ({ role }: { role: Role }) => (
  <span className={`rounded-md px-3 py-1 text-sm font-medium ${roleStyles[role]}`}>
    {role}
  </span>
);

const Avatar = ({ label, large = false }: { label: string; large?: boolean }) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold uppercase text-white ${
      large ? "h-16 w-16 text-2xl" : "h-9 w-9 text-sm"
    }`}
  >
    {label.charAt(0)}
  </div>
);

// A fixed locale and time zone give the same text on the server and in the browser,
// so React does not report a hydration mismatch.
const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const UserDashboard = ({ teamMembers, currentUser }: UserDashboardProps) => {
  const displayName = currentUser.name ?? currentUser.email;

  return (
    <div className="px-6 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
        <p className="mt-3 text-xl text-slate-300">Welcome back, {displayName}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------- Profile ---------- */}
        <section className="self-start rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-6 py-6">
            <h2 className="text-2xl font-semibold text-white">Profile</h2>
            <p className="mt-1 text-lg text-slate-400">Your account details</p>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-center gap-4">
              <Avatar label={displayName} large />
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold text-slate-100">
                  {displayName}
                </p>
                <p className="truncate text-slate-400">{currentUser.email}</p>
              </div>
            </div>

            <dl className="mt-6 divide-y divide-slate-800 border-t border-slate-800">
              <div className="flex items-center justify-between py-4">
                <dt className="text-slate-400">Role</dt>
                <dd>
                  <RoleBadge role={currentUser.role} />
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-slate-400">Member since</dt>
                <dd className="text-slate-100">{formatDate(currentUser.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---------- My team ---------- */}
        <section className="self-start rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-6 py-6">
            <h2 className="text-2xl font-semibold text-white">
              My Team ({teamMembers.length})
            </h2>
            <p className="mt-1 text-lg text-slate-400">People in your team</p>
          </div>

          <div className="px-6 py-4">
            {!currentUser.teamId ? (
              <p className="py-8 text-center text-slate-400">
                You are not assigned to a team yet. Please contact an admin.
              </p>
            ) : teamMembers.length === 0 ? (
              <p className="py-8 text-center text-slate-400">No team members found.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {teamMembers.map((member) => {
                  const name = member.name ?? member.email;
                  return (
                    <li
                      key={member.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar label={name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-100">
                            {name}
                            {member.id === currentUser.id && (
                              <span className="ml-2 text-sm text-slate-500">(You)</span>
                            )}
                          </p>
                          <p className="truncate text-sm text-slate-400">{member.email}</p>
                        </div>
                      </div>
                      <RoleBadge role={member.role} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;