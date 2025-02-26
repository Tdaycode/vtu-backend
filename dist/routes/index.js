"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const product_route_1 = __importDefault(require("./product.route"));
const order_route_1 = __importDefault(require("./order.route"));
const payment_route_1 = __importDefault(require("./payment.route"));
const cowry_route_1 = __importDefault(require("./cowry.route"));
const router = express_1.default.Router();
const allRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/user',
        route: user_route_1.default,
    },
    {
        path: '/products',
        route: product_route_1.default,
    },
    {
        path: '/orders',
        route: order_route_1.default,
    },
    {
        path: '/payments',
        route: payment_route_1.default,
    },
    {
        path: '/cowry',
        route: cowry_route_1.default,
    },
];
allRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
