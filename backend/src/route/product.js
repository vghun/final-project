import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.getAll);
router.get("/latest", productController.getLatest);
router.get("/best-selling", productController.getBestSelling);
router.get("/most-viewed", productController.getMostViewed);
router.get("/top-discount", productController.getTopDiscount);
router.get("/:id", productController.getById);

export default router;
