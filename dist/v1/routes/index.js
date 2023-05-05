"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./auth.route"));
const product_route_1 = __importDefault(require("./product.route"));
const cart_route_1 = __importDefault(require("./cart.route"));
const user_route_1 = __importDefault(require("./user.route"));
const category_route_1 = __importDefault(require("./category.route"));
const image_route_1 = __importDefault(require("./image.route"));
const feedback_route_1 = __importDefault(require("./feedback.route"));
function routes(app) {
    app.use('/api/v1/auth', auth_route_1.default);
    app.use('/api/v1/products', product_route_1.default);
    app.use('/api/v1/cart', cart_route_1.default);
    app.use('/api/v1/user', user_route_1.default);
    app.use('/api/v1/category', category_route_1.default);
    app.use('/api/v1/image', image_route_1.default);
    app.use('/api/v1/feedback', feedback_route_1.default);
}
exports.default = routes;
//# sourceMappingURL=index.js.map