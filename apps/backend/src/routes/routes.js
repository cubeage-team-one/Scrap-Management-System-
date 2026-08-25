import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import listingRoutes from '../modules/marketplace/listings/listing.routes.js';
import quotationRoutes from '../modules/marketplace/quotation/quotation.routes.js';
import scrapRoutes from '../modules/scrap/scrap.routes.js';
import categoryRoutes from '../modules/category/category.routes.js';

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'ok' }));
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/marketplace/listings', listingRoutes);
router.use('/marketplace/quotations', quotationRoutes);
router.use('/scrap', scrapRoutes);
router.use('/category', categoryRoutes);

export default router;
