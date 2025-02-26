import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import { responseType } from '../utils/helpers';
import CategoryController from '../controllers/category.controller';
import { UpdateCategoryValidation } from '../validations/products';

const router = express.Router();

const categoryController = Container.get(CategoryController);
const authMiddleware = Container.get(AuthMiddleware);

router.get('/', authMiddleware.validateAdminUser, categoryController.getAllCategories);
router.get('/:id', authMiddleware.validateAdminUser, categoryController.getCategoriesById);
router.patch('/:id', authMiddleware.validateAdminUser, RequestValidator.validate(UpdateCategoryValidation, responseType.body), 
  categoryController.updateCategoryById);

export default router;
