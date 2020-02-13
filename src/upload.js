import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
//muler가 하는일은 어떤 사용자로부터 제출된 form을 받았을때 전달받은 파일을 업로드 시켜주는 것.
//그래서 업로드 과정을 하나하나 다룰 필요가 없이 이름짓고 url할당하고 고유한 이름도 주고 확장자..이럴필요없음->multer가해줌

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'ap-northeast-2'
});

//multer를 써 업로드된 파일들을 이 폴더에 저장할것이다.
const upload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'prismagram6',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});
export const uploadMiddleware = upload.single('file');
export const uploadController = (req, res) => {
  //s3에 저장할시 file안에 location으로 되고 서버자체로 저장시 path로 되어있어 각자에 맞춰서해야함
  const {
    file: { location }
  } = req;
  console.log(location);
  res.json({ location });
};
