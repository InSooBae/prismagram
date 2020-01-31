import { prisma } from '../../../../generated/prisma-client';
export default {
  Query: {
    me: async (_, __, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const userProfile = await prisma.user({ id: user.id });
      const posts = await prisma.user({ id: user.id }).posts();
      //return중에 user: null이면 아래 custom resolver에 접근도 안함
      //
      return {
        user: userProfile,
        posts
      };
    }
  }
  //custom field 수정할때 (custom resolver) 여기서 매개변수 parent는 현재 resolver를 불러오는 상위 resolver에서 받아옴
  /*ex) graphql query
   query{
    me {
      user{  //parent는 상위인 user resolver에서 가져온다.
        fullName
      }
    }
   }
  */
};
