import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import { imgurGetAlbumImages, imgurGetAlbums } from '../utils/imgur'

// [GET] /image
const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  const albums = await imgurGetAlbums()
  responseSuccess(res, STATUS.Ok, { message: 'Lấy albums thành công', data: albums })
}

// [GET] /image/:albumId
const getImages = async (req: Request, res: Response, next: NextFunction) => {
  const albumId = req.params.albumId
  const album = await imgurGetAlbumImages(albumId)
  const images = album.data.images
  responseSuccess(res, STATUS.Ok, { message: 'Lấy hình ảnh thành công', data: images })
}

const imageController = { getAlbums, getImages }

export default imageController
