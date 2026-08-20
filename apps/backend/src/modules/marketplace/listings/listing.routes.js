import express from "express";

import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  publishListing,
  cancelListing,
} from "./listing.controller.js";

import {
  validateCreateListing,
  validateUpdateListing,
} from "./listing.validation.js";

import requireAuth from "../../../core/middlewares/auth.middleware.js";
import { allowRoles } from "../../../core/middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  allowRoles("INDUSTRY", "DEALER"),
  validateCreateListing,
  createListing
);

router.get("/", getListings);

router.get("/:id", getListingById);

router.patch(
  "/:id",
  validateUpdateListing,
  updateListing
);

router.patch(
  "/:id/publish",
  publishListing
);

router.delete(
  "/:id",
  cancelListing
);

export default router;