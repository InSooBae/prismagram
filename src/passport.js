import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../generated/prisma-client';

const jwtOption = {
  //Authorization 헤더에서 jwt 찾는 역할 {Authorization: 'Bearer TOKEN'} 헤더의 값으로 Bearer 이후의 토큰(TOKEN에서)이 입력될것
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

//JWT콜백 함수 (매개변수중 done은 사용자를 찾았을때 호출해야하는 함수임.)
//토큰이 추출되면 verifyUser를 payload와 함께 실행, payload는 토큰에서 해석된 id를 받아서, user를 찾아서 리턴
const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

/*
express는 미들웨어를 지나고 라우트가 시작됨 토큰을 받아서 해석하고 사용자를 찾고 사용자가 존재한다면 req객체에 사용자를 추가하고 나면 
graphql함수를 실행하는거 만약 로그인 되있다면 모든 graphql요청에 사용자 정보가 추가되어서 요청됨
*/
//verifyUser에서 사용자를 받아온 후에 사용자가 존재한다면 그사용자 정보를 req객체에 붙혀줌
// passport.authenticate('jwt')는 Strategy를 활용해 jwt토큰을 추출함,
//verifyUser에서 user가 리턴되면 콜백함수가 실행되어 사용자가 있으면 그사용자를 req에 추가함 그다음 server.js의 context에 requset담아줌
export const authenticateJwt = (req, res, next) =>
  passport.authenticate('jwt', { sessions: false }, (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
//IIFE 패턴 (IIFE를 변수에 할당하면 IIFE 자체는 저장되지 않고, 함수가 실행된 결과만 저장된다.)
/*
var result = (function () {
    var name = "Barry"; 
    return name; 
})(); 
// 즉시 결과를 생성한다.
result; // "Barry" name은 선언 안된것과 마찬가지
*/
//위에 문법은 passport.authenticate('jwt',... next() })이게 함수를 리턴해서 다음함수Fn(req,res,next) 로가능함 요때 graphql함수 실행

//옵션이 잘 맞게 적용될시 JwtStrategey 험수가 토큰을 해석 (JWT는 토큰을 입력받아서 정보를 해석함 그리고 해석된 정보를 콜백함수로 전달해줌)
//Strategy를 활용해 jwt토큰을 추출함,토큰이 추출되면 verifyUser를 payload와 함께 실행
passport.use(new Strategy(jwtOption, verifyUser));
passport.initialize();
