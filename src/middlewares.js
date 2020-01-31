//인증이 됬는지 안됬는지 확인
export const isAuthenticated = request => {
  if (!request.user) {
    throw Error('You need to log in to perform this action');
  }
  return;
};
