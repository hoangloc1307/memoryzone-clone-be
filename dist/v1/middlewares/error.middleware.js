"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    switch (err.constructor.name) {
        case 'AppError':
            if (typeof err.error === 'string') {
                res.status(err.status).json({ status: 'Error', name: err.name, message: err.error });
            }
            else {
                res.status(err.status).json({ status: 'Error', name: err.name, message: 'Lỗi', data: err.error });
            }
            break;
        case 'MulterError':
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                res
                    .status(httpStatus_1.STATUS.BadRequest)
                    .json({ status: 'Error', message: 'Lỗi', data: { [err.field]: 'Quá số lượng file quy định' } });
            }
            break;
        case 'PrismaClientRustPanicError':
        case 'PrismaClientValidationError':
        case 'PrismaClientKnownRequestError':
        case 'PrismaClientInitializationError':
        case 'PrismaClientUnknownRequestError':
            res
                .status(httpStatus_1.STATUS.InternalServerError)
                .json({ status: 'Error', message: err.constructor.name.replace('Prisma', '') });
            break;
        default:
            res
                .status(httpStatus_1.STATUS.InternalServerError)
                .json({ status: 'Error', message: err.message || 'Có lỗi trong quá trình xử lý' });
    }
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map