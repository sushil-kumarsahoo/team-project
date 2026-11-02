import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { Role, User } from "../types";

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};   

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

export const verifyToken = (token : string): {userId : string} => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {userId : string}; 
};

export const getCurrentUser = async () : Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token) return null;
    const decode = verifyToken(token);

    const userFromDb = await prisma.user.findUnique({where: {id: decode.userId}});

    if(!userFromDb) return null;
    const {password, ...user} = userFromDb;

    return user as User;

  } catch (error) {
    console.error("Error :", error);
    return null;
  }
};

export const checkUserPermission = (
    user: User, 
    requiredRole: Role 
): boolean  => {
   const roleHierarchy = {
      [Role.GUEST]: 0,
      [Role.USER] : 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN] : 3,
   };
   return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};