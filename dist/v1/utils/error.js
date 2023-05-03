"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(status, error, name) {
        super();
        this.status = status;
        this.name = name;
        this.error = error || 'App Error';
    }
}
exports.default = AppError;
//# sourceMappingURL=error.js.map