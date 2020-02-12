import multer from 'multer';
//muler가 하는일은 어떤 사용자로부터 제출된 form을 받았을때 전달받은 파일을 업로드 시켜주는 것.
//그래서 업로드 과정을 하나하나 다룰 필요가 없이 이름짓고 url할당하고 고유한 이름도 주고 확장자..이럴필요없음->multer가해줌

//multer를 써 업로드된 파일들을 이 폴더에 저장할것이다.
const upload = multer({ dest: 'uploads/' });
export const uploadMiddleware = upload.single('file');
export const uploadController = (req, res) => {
  const { file } = req;
  console.log(file);
  res.end();
};
