import express from 'express';
import * as scrapController from './scrap.controller.js';
import requireAuth from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all scrap routes to ensure user is logged in
router.use(requireAuth);

// 1. Add Scrap
router.post('/', scrapController.addScrap);

// 2. View/List Scrap
router.get('/', scrapController.getScraps);

// 3. View Scrap by ID
router.get('/:id', scrapController.getScrapById);

// 4. Update Scrap
router.put('/:id', scrapController.updateScrap);

// 5. Delete Scrap
router.delete('/:id', scrapController.deleteScrap);

export default router;
