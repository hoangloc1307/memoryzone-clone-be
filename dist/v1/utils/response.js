"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.responseSuccess = void 0;
const responseSuccess = (res, status, data) => {
    return res.status(status).json(Object.assign({ status: 'Success' }, data));
};
exports.responseSuccess = responseSuccess;
const catchError = (controllerFunction) => {
    return (req, res, next) => {
        controllerFunction(req, res, next).catch(next);
    };
};
exports.catchError = catchError;
//# sourceMappingURL=response.js.map