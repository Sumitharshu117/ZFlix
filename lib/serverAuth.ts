import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import prismadb from '@/lib/prismadb';

const serverAuth = async (req: NextApiRequest) => {

  // fetch logged in user session
  const session = await getSession({ req });

  // if session or user or email doesn't exist
  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }
  // if exist fetch current user
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    }
  });

  // if theres no user
  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
}

export default serverAuth;
