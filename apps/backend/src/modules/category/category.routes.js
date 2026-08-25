import express from 'express';
import * as categoryController from './category.controller.js';
import requireAuth from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Read-only — any authenticated user can browse categories
router.use(requireAuth);

// 1. List Categories
router.get('/', categoryController.getCategories);

// 2. Get Category by ID
router.get('/:id', categoryController.getCategoryById);

export default router;
