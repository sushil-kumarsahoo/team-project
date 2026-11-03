import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Role } from "@/app/api/types/index"
import { hashPassword } from "@/app/api/lib/auth";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
    console.log("Strting databse seed");
    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "Marketing",
                description: "Marketing and sales team",
                code: "MKT-2026"
            },
        }),
        prisma.team.create({
            data: {
                name: "Engineering",
                description: "Engineering and development team",
                code: "ENG-2026"
            },
        }),
        prisma.team.create({
            data: {
                name: "Human Resources",
                description: "HR and recruitment team",
                code: "HR-2026"
            },
        }),
        prisma.team.create({
            data: {
                name: "Finance",
                description: "Finance and accounting team",
                code: "FIN-2026"
            },
        }),
    ]);

    const sampleUsers = [
        {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            team: teams[0],
            role: Role.MANAGER
        },
        {
            name: "Bob Smith",
            email: "bob.smith@example.com",
            team: teams[1],
            role: Role.USER
        },
        {
            name: "Charlie Brown",
            email: "charlie.brown@example.com",
            team: teams[2],
            role: Role.USER
        }
    ];

    for (const userData of sampleUsers) {
        await prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                password: await hashPassword("password123"),
                role: userData.role,
                teamId: userData.team.id
            }
        })
    }

    console.log("Database seed completed successfully");

}

    main()
        .catch((e) => {
            console.error("Sedding failed", e);
            process.exit(1);
        }).finally(async () => {
            await prisma.$disconnect();
        })
