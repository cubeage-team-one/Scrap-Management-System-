import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import listingRoutes from '../modules/marketplace/listings/listing.routes.js';


const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'ok' }));
router.use('/auth', authRoutes);
router.use('/marketplace/listings', listingRoutes);

export default router;
