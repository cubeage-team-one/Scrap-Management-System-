import express from 'express';
import * as quotationController from './quotation.controller.js';
import { validateCreateQuotation } from './quotation.validation.js';
import requireAuth from '../../../core/middlewares/auth.middleware.js';

const router = express.Router();

// All quotation routes require authentication
router.use(requireAuth);

// 1. Create Quotation
router.post('/', validateCreateQuotation, quotationController.createQuotation);

// 2. Get Quotations
router.get('/', quotationController.getQuotations);

// 3. Get Quotation By ID
router.get('/:id', quotationController.getQuotationById);

// 4. Accept Quotation
router.patch('/:id/accept', quotationController.acceptQuotation);

// 5. Reject Quotation
router.patch('/:id/reject', quotationController.rejectQuotation);

// 6. Withdraw Quotation
router.patch('/:id/withdraw', quotationController.withdrawQuotation);

export default router;
