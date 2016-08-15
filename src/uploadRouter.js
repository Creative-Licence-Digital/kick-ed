import multer from 'multer'
import s3     from 'multer-storage-s3'

const storage = s3({
  bucket: 'ed-content-creator-assets',
  destination: (req, file, done) => {
    const isVideo   = req.url.match(/video$/);
    const folder    = "assets/" + (isVideo ? "videos/" : "images/");
    done(null, folder);
  },
  filename: (req, file, n) => {
    const isVideo   = req.url.match(/video$/)
    const extension = isVideo ? "mov" : "jpg"
    const result    = Date.now() + "." + extension 
    console.error("FILENAME", result)
    n(null, result)
  }
})


const upload  = multer({ storage })

export default (app) => {
  app.post("/api/content/upload/:type", 
           upload.single('file'), 
           (req, res, next) => {
             res.send({ url: req.file.s3.Location });
           });
}
