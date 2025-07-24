import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { MiddlewareHandler } from 'hono';
import type { Context } from "hono";

export type Env = {
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    // userId: string
    prisma: PrismaClient 
  }
};

export type AppContext = Context<Env>;


export const getPrisma: MiddlewareHandler = async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  c.set('prisma', prisma)

  try {
    await next()
  } finally {
    await prisma.$disconnect()
  }
}