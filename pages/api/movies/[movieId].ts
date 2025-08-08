import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req);

    // thats how it works in next.js // [] square brackets file

    const { movieId } = req.query;

    // If movie id is not equal to string

    if (typeof movieId !== 'string') {
      throw new Error('Invalid Id');
    }

    // If movie id is missing

    if (!movieId) {
      throw new Error('Missing Id');
    }

    // Check a movie

    const movies = await prismadb.movie.findUnique({
      where: {
        id: movieId
      }
    });

    // if (!movies) {
    //   throw new Error('Invalid ID');
    // }

    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
