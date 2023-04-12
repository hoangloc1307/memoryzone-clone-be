import multer from 'multer'

const upload = multer()

const productImages = upload.fields([{ name: 'product-images', maxCount: 10 }])

const uploadMiddleware = {
  productImages,
}

export default uploadMiddleware
