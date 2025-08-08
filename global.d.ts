import { PrismaClient } from'./generated/prisma'
import type { MongoClient } from 'mongodb';

// set

declare global {
  namespace globalThis {
    var prismadb: PrismaClient
  }
}
