import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import { Container } from 'typedi';
import ProductController from '../controllers/product.controller';
import { GetProductInfoQueryValidation, GetProductInfoParamsValidation, SearchProductQueryValidation, CountryQueryValidation, EditProductValidation, CreateProductValidation } from '../validations/products';
import { responseType } from '../utils/helpers';
import { GetAllItemsValidation } from '../validations/common/getAllItems.validation';
import AuthMiddleware from '../middlewares/auth.middleware';

const authMiddleware = Container.get(AuthMiddleware);


const router = express.Router();

const productController = Container.get(ProductController);

router.post('/', RequestValidator.validate(CreateProductValidation), authMiddleware.validateAdminUser, productController.createProduct);
router.get('/all', RequestValidator.validate(GetAllItemsValidation), authMiddleware.validateAdminUser, productController.getProducts);
router.get('/category', RequestValidator.validate(CountryQueryValidation, responseType.query), productController.getAllProducts);
router.get('/category/:id', [RequestValidator.validate(GetProductInfoParamsValidation, responseType.params), 
    RequestValidator.validate(CountryQueryValidation, responseType.query)], productController.getProductsByCategory);
router.get('/search', RequestValidator.validate(SearchProductQueryValidation, responseType.query), productController.searchProduct);
router.get('/sync', authMiddleware.validateAdminUser, productController.syncProducts);
router.get('/:id', RequestValidator.validate(GetProductInfoParamsValidation, responseType.params), productController.getProductsById);
router.get('/:id/info', [RequestValidator.validate(GetProductInfoParamsValidation, responseType.params),
 RequestValidator.validate(GetProductInfoQueryValidation, responseType.query)], productController.getProductInfo);
router.patch('/:id/edit', RequestValidator.validate(EditProductValidation), authMiddleware.validateAdminUser, productController.editProduct);

export default router;
