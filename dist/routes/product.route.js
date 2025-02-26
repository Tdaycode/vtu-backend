"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const typedi_1 = require("typedi");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const products_1 = require("../validations/products");
const helpers_1 = require("../utils/helpers");
const getAllItems_validation_1 = require("../validations/common/getAllItems.validation");
const router = express_1.default.Router();
const productController = typedi_1.Container.get(product_controller_1.default);
router.get('/', validate_middleware_1.default.validate(getAllItems_validation_1.GetAllItemsValidation), productController.getProducts);
router.get('/category', validate_middleware_1.default.validate(products_1.CountryQueryValidation, helpers_1.responseType.query), productController.getAllProducts);
router.get('/category/:id', [validate_middleware_1.default.validate(products_1.GetProductInfoParamsValidation, helpers_1.responseType.params),
    validate_middleware_1.default.validate(products_1.CountryQueryValidation, helpers_1.responseType.query)], productController.getProductsByCategory);
router.get('/search', validate_middleware_1.default.validate(products_1.SearchProductQueryValidation, helpers_1.responseType.query), productController.searchProduct);
router.get('/:id', validate_middleware_1.default.validate(products_1.GetProductInfoParamsValidation, helpers_1.responseType.params), productController.getProductsById);
router.get('/:id/info', [validate_middleware_1.default.validate(products_1.GetProductInfoParamsValidation, helpers_1.responseType.params),
    validate_middleware_1.default.validate(products_1.GetProductInfoQueryValidation, helpers_1.responseType.query)], productController.getProductInfo);
exports.default = router;
