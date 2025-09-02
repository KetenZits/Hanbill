import { NextResponse } from "next/server";
import { createUser,findUserByEmail } from '@/services/userService';
import { hash } from "bcryptjs";

export async function POST(req: Request){
    try{
      const {name,email,password} = await req.json();

    if(!name || !email || !password){
        return NextResponse.json({message: "Missing required fields"}, {status: 400})
    }

    const existing = await findUserByEmail(email)
    if(existing) return NextResponse.json({message : "User already exits"}, {status: 400})

    const hashedPassword = await hash(password,12)

    const user  = await createUser(name,email,hashedPassword)

    return NextResponse.json({message: "User Created"}, {status: 201})  
    }catch(error){
        return NextResponse.json({message: "Internal Error"}, {status: 500})
    }
}
