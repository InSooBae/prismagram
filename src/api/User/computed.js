import { prisma } from '../../../generated/prisma-client';

export default {
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
  User: {
    fullName: parent => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      //paraent객체(안에 있는 id 를 paraentId라는 변수에 넣음) destructing
      const { id: parentId } = parent;
      return await prisma.$exists.user({
        AND: [{ id: parentId }, { followers_some: { id: user.id } }]
      });
    },
    //요청한사람이 같으면 자기자신 프로필을 요청
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};
