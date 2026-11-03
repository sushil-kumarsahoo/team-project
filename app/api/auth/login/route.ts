import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { generateToken, verifyPassword } from "@/app/lib/auth";
import { Role } from "@/app/types/index";

export async function POST(request: NextRequest) {
    try {
        const {  email, password } = await request.json();
        if ( !email || !password) {
            return NextResponse.json({
                error: "Email & password are required or not valid",
            }, { status: 400 })
        }

        //find existing user
        const userFromDb = await prisma.user.findUnique({
            where: { email },
            include: {
                team: true,
            }
        });

        if(!userFromDb) {
            return NextResponse.json({
                error: "User with this email does not exist"
            }, { status: 404 })
        }

        const isValidPassword = await verifyPassword(password, userFromDb.password);

        if(!isValidPassword) {
            return NextResponse.json({
                error: "Invalid credentials, please check your email and password"
            }, { status: 401 })
        }

        //Generate the token for user
        const token = generateToken(userFromDb.id);

        // Create response
        const response = NextResponse.json({
            user: {
                id: userFromDb.id,
                email: userFromDb.email,
                name: userFromDb.name,
                role: userFromDb.role,
                teamId: userFromDb.teamId,
                team: userFromDb.team,
                token
            },
        });

        //set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        console.error("Login failed", error);
        return NextResponse.json({ error: "Internal server error, Something went wrong!" }, { status: 500 })
    }
}