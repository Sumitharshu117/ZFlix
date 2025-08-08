// lib/prismadb.ts
import { PrismaClient } from'../generated/prisma'

const client = global.prismadb || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prismadb = client;

export default client;
