import { ImgurApiResponse, ImgurClient } from 'imgur'
import { imgurConfig } from '../configs/imgur'
import { ImageData } from 'imgur/lib/common/types'

const imgurClient = new ImgurClient({
  clientId: imgurConfig.ClientId,
  clientSecret: imgurConfig.ClientSecret,
  refreshToken: imgurConfig.RefreshToken,
})

export const imgurUpload = (images: Express.Multer.File[]) => {
  const promiseArr: Promise<ImgurApiResponse<ImageData>>[] = []

  images.forEach(image => {
    promiseArr.push(
      imgurClient.upload({
        image: image.buffer,
        type: 'stream',
        album: imgurConfig.AlbumProductsId,
        name: image.originalname,
      })
    )
  })
  return Promise.all(promiseArr)
}

export const imgurDelete = (deleteHash: string) => {
  return imgurClient.deleteImage(deleteHash)
}
