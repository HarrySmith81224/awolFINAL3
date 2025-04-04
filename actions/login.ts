"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/prisma/prisma";

// zod compares retrieved data with the login schema from prisma, throws an error if it doesn't match
export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedData = LoginSchema.parse(data);

    if(!validatedData) {
        return { error: "Invalid input data" };
    }

    const { email, password } = validatedData;

    // check if user exists in database    
    const userExists = await prisma.user.findFirst({
        where: {
            email: email,
        },
    })

    if (!userExists || !userExists.email) {
        return { error: "User not found" };
    }

    // sign in user if they exist
    try {
        await signIn('credentials', {
            email: userExists.email,
            password: password,
            redirectTo: '/'
        })
    } catch (error) {
        if (error instanceof AuthError) {

            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
            }
        }
        throw error;
    }
    return { success: "User logged in successfully"}
}