import multer from 'multer'

const upload = multer()

const productImages = upload.array('productImages[]', 10)

const uploadMiddleware = {
  productImages,
}

export default uploadMiddleware
