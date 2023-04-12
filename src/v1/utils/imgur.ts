import axios, { AxiosPromise } from 'axios'

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
            Authorization: 'Bearer 7c860d13657676966d755257df3cec489786d7ec',
          },
        }
      )
    )
  })
  return Promise.all(promiseArr)
}
