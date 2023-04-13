import axios, { AxiosPromise } from 'axios'
import { imgurConfig } from '../configs/imgur'

export const imgurUpload = (images: Express.Multer.File[]) => {
  const promiseArr: AxiosPromise[] = []
  images.forEach(image => {
    promiseArr.push(
      axios.postForm(
        'https://api.imgur.com/3/image',
        {
          image: image.buffer,
          album: '46td1aG',
          type: 'file',
          name: image.originalname,
        },
        {
          headers: {
            Authorization: `Bearer ${imgurConfig.AccessToken}`,
          },
        }
      )
    )
  })
  return Promise.all(promiseArr)
}
