import { prisma } from "@/lib/prisma";
import { hash,compare } from "bcryptjs";

export async function findUserByEmail (email:string){
    return await prisma.user.findUnique({
        where: {email}
    })
}

export async function createUser(name: string, email: string, password: string){
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    return user;
}

export async function validatePassword(email: string, password: string){
    const user = await findUserByEmail(email);
    if(!user) return null

    const isValid = await compare(password, user.password);
    if(!isValid) return null

    return user;
}