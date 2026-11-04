"use client";
import { apiClient } from "@/app/lib/apiClient";
import { Role, Team, User } from "@/app/types";
import React, { useTransition } from "react";

interface AdminDashboardProps {
  users: User[];
  teams: Team[];
  currentUser: User;
}

const AdminDashBoard = ({ users, teams, currentUser }: AdminDashboardProps) => {
  const [isPending, startTransition] = useTransition();

  const handleTeamAssignment = async (
    userId: string,
    teamId: string | null,
  ) => {
    startTransition(async () => {
      try {
        apiClient.assignUserToTeam(userId, teamId);
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Error updating team asignment",
        );
      }
    });
  };

  const handleRoleAssignment = async (userId: string, newRole: Role) => {
    if (userId === currentUser.id) {
      alert("You cant change your role");
      return;
    }
    startTransition(async () => {
      try {
        apiClient.updateUserRole(userId, newRole);
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Error updating role asignment",
        );
      }
    });
  };
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">Admin dashboard</h1>
        <p className="text-slate-300">User and team management</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Usertabel with role an team assignment */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-4 border-b border-slate-700 ">
            <h3 className="font-semibold text-white">Users ({users.length})</h3>
            <p className="text-slate text-sm ">
              Manage roles and team assignment
            </p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Role</th>
                  <th className="text-left py-2 text-slate-300">team</th>
                  <th className="text-left py-2 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700">
                    <td className="py-2 text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex justify-center items-center text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-slate-500 text-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleAssignment(user.id, e.target.value as Role)
                        }
                        disabled={isPending || user.id === currentUser.id}
                        className="bg-slate-900 border-slate-700 rounded-sm p-1 ml-2"
                      >
                        <option value={Role.USER}>USER</option>
                        <option value={Role.MANAGER}>MANAGER</option>
                        <option value={Role.ADMIN}>ADMIN</option>
                      </select>
                    </td>
                    <td className="py-2 flex">
                      <select
                        value={user.teamId || " "}
                        onChange={(e) =>
                          handleTeamAssignment(user.id, e.target.value || null)
                        }
                        disabled={isPending}
                        className="bg-slate-900 border-slate-700 rounded-sm p-1 ml-2"
                      >
                        <option value="">No Team</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      {user.team && (
                        <span className="text-xs text-slate-500 pl-2">
                          {user.team.code}
                        </span>
                      )}
                    </td>
                    <td className="p-y">
                      {user.teamId && (
                        <button
                          disabled={isPending}
                          onClick={() => handleTeamAssignment(user.id, null)}
                          className="text-red-900 hover:text-red-500 text-xs disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teams table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-4 border-b border-slate-700 ">
            <h3 className="font-semibold text-white">Teams ({teams.length})</h3>
            <p className="text-slate text-sm ">Team overview</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Code</th>
                  <th className="text-left py-2 text-slate-300">Members</th>
                  <th className="text-left py-2 text-slate-300">Managers</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const teamMembers = users.filter(
                    (user) => user.teamId === team.id,
                  );

                  const teamManagers = teamMembers.filter(
                    (user) => user.role === Role.MANAGER,
                  );

                  return (
                    <tr key={team.id} className="border-b border-slate-700">
                      <td className="py-2 text-slate-300 font-medium">
                        {team.name}
                      </td>
                      <td className="py-2 flex items-center">
                        <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-sm ">
                          {team.code}
                        </span>
                      </td>
                      <td className="py-2 text-slate-300">
                        {teamManagers.length} users
                      </td>
                      <td className="py-2 text-slate-300">
                        {teamManagers.length > 0 ? (
                          <div className="flex flex-wrap gp-1 gap-1">
                            {teamManagers.map((manager) => (
                              <span
                                key={manager.id}
                                className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-sm"
                                title={manager.name}
                              >
                                {manager.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs ">
                            No manager
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* stats */}

      <div className="grid grid-cols-5 pt-5 gap-4">
        <div className="bg-slate-800 border-sl rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <div className="text-sm text-slate-400">Total users</div>
        </div>
        <div className="bg-slate-800 border-sl rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {users.filter((u) => u.role === Role.ADMIN).length}
          </div>
          <div className="text-sm text-slate-400">Admins</div>
        </div>
        <div className="bg-slate-800 border-sl rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {users.filter((u) => u.role === Role.MANAGER).length}
          </div>
          <div className="text-sm text-slate-400">Managers</div>
        </div>
        <div className="bg-slate-800 border-sl rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {users.filter((u) => u.role === Role.USER).length}
          </div>
          <div className="text-sm text-slate-400">Users</div>
        </div>
        <div className="bg-slate-800 border-sl rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{teams.length}</div>
          <div className="text-sm text-slate-400">Teams</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
