import './env';
import { GraphQLServer } from 'graphql-yoga';
import logger from 'morgan';
import schema from './schema';
import './passport';
import { authenticateJwt } from './passport';
import { isAuthenticated } from './middlewares';
import upload, { uploadMiddleware, uploadController } from './upload';
const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated })
});

server.express.use(logger('dev'));
//authenticateJwt(./passport.js) 함수에서는 passport.authenicate("jwt") 함수 실행
server.express.use(authenticateJwt);
//서버로 하여금 route를 post하도록하고 업로드 위해 multer 부르고 파일 하나(single) 업로드
//이게 끝나면 object인 (req,res)를 얻고 req안에 file이란 객체 존재
// server.express.post('/api/upload', upload.single('file'), (req, res) => {
//   const { file } = req;
// });
/* 
 위 url(/api/upload)로 가게되면 multer가 들어오는 파일을 중간에서 가로채서 파일을 업로드하고, file이라는
 object르 제공 upload.single부분이 미들웨어(이게 뒤에있는 함수보다 먼저 실행됨) 그리고 /api/upload로
 보내지는 파일은 이름이 "file"(upload.single('file')->single("이름")) 여야함
*/
server.express.post('/api/upload', uploadMiddleware, uploadController);

server.start({ port: PORT }, () =>
  console.log(`Server running on port ${PORT}`)
);
