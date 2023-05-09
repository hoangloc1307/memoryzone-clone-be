import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import { imgurGetAlbumImages, imgurGetAlbums } from '../utils/imgur'
import prismaClient from '../utils/prisma'

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

// [PATCH] /image/:id
const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)
  const { alt } = req.body

  const image = await prismaClient.image.update({
    where: {
      id: id,
    },
    data: {
      alt: alt ?? undefined,
    },
    select: {
      id: true,
      alt: true,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật hình ảnh thành công', data: image })
}

const imageController = { getAlbums, getImages, updateImage }

export default imageController
