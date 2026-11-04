import {Team, User} from "../types/index"

//Simple transformation function that handles the actual prisma response

export function transformUser(user: any) : User{
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
        teamId: user.teamId,
        team: user.team,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

export function transFormUsers(users: any[]): User[]{
    return users.map(transformUser);
}

export function transformTeam(team: any) : Team {
    return {
        id: team.id,
        name: team.name,
        description: team.description || undefined,
        code: team.code,
        members: team.members,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
    };
}

export function transformTeams(teams: any[]): Team[]{
    return teams.map(transformTeam);
}
