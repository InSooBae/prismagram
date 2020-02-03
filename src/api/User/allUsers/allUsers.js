import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    allUsers: () =>
      prisma.users({
        where: {
          id_not_in: [user.id]
        },
        orderBy: 'createdAt_DESC'
      })
  }
};
