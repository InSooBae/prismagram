import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import path from 'path';

//** 는 모든 디렉토리 *.~~ ~~타입의 모든파일
const allTypes = fileLoader(path.join(__dirname, '/api/**/*.graphql'));
//위와 같은 효과고 api 디렉토리 안에 resolver가 아닌 js파일을 두면 문제가 생김 -> 안에두지마 위도 마찬가지
const allResolvers = fileLoader(path.join(__dirname, '/api/**/*.js'));

const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  //요거 merge해서 모든resolver 사용(연동)가능함
  resolvers: mergeResolvers(allResolvers)
});

export default schema;
