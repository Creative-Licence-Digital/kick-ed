import multer from 'multer'
import s3     from 'multer-storage-s3'

const storage = s3({
  bucket: 'ed-content-creator-assets',
  destination: (req, file, done) => {
    if (file.mimetype.match(/^video/)) {
      done(null, 'assets/videos/')
    } else if (file.mimetype.match(/^image/)) {
      done(null, 'assets/images/')
    } else {
      done(new Error("not an asset you can upload"));
    }
  },
  filename: (req, file, n) => {
    let extension = "";
    if (file.mimetype.match(/^video/)) {
      extension = 'mp4'
    } else if (file.mimetype.match(/^image/)) {
      extension = 'jpg'
    }
    n(null, Date.now() + "." + extension )
  }
})


const upload  = multer({ storage })

export default (app) => {
  app.post("/api/content/upload", 
           upload.single('file'), 
           (req, res, next) => {
             res.send({ url: req.file.s3.Location });
           });
}
