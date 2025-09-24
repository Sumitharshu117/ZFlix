
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    await serverAuth(req);
    const { query } = req.query;

    if (typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const movies = await prismadb.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive' 
            }
          },
          {
            genre: {
              contains: query,
              mode: 'insensitive' 
            }
          }
        ]
      }
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}