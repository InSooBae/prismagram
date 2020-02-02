import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    /*
    처음 보낼시 상대에게 보내야하니 상대 id인 toId랑 방을 만들고 메세지를 보내고 다음엔 방에 들어가서 보낼거니 상대
    아이디를 몰라도 되서 roomId만 알면 그방에서 보내 새로운 방을 만들필요가 없다
    */
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      //room이 없으면
      if (roomId === undefined) {
        //자기 자신의 room(챗팅방)이 안만들어지게끔 조건문
        if (user.id !== toId) {
          // 자기와 상대에 대한 새 room을 만듬(participants를 갖고오고싶어 fragment(ROOM_FRAGMENT)를 넣음)
          room = await prisma.createRoom({
            participants: {
              connect: [{ id: toId }, { id: user.id }]
            }
          });
        }
        //room이 있으면 toId가 필요없이 room에서 해결하면되니(문제가 to(toId)가 누군지모름 그래서아래 getTo에서 filter)
      } else {
        room = await prisma.room({ id: roomId });
      }
      //room없으면(위에서도 room을 못만들시) error출력
      if (!room) {
        throw Error('Room not found');
      }
      const participants = await prisma.room({ id: room.id }).participants();
      //현재 상대와 만들어진 room에서 자기 자신을 제외한 상대를 filter함
      const getTo = participants.find(
        //자기 자신이 포함되있는거 빼고?
        participant => participant.id !== user.id
      );
      //메세지 만들고 보내기
      return await prisma.createMessage({
        text: message,
        from: {
          connect: { id: user.id }
        },
        to: {
          connect: {
            id: roomId ? getTo.id : toId
          }
        },
        room: {
          connect: { id: room.id }
        }
      });
    }
  }
};
