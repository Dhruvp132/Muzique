import { PrismaClient } from "@prisma/client";

//whenever u create db you should migrate db then generate client 
// export const prismaClient = new PrismaClient()
//this isn't the best way so introduce a singleton here 

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismaClient

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaClient