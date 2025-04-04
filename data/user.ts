import { prisma } from "@/prisma/prisma";

// find user by ID using prisma
export const getUserById = async(id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        return user;
    } catch (error) {
        console.log(error)
        return null
    }
}