import express from "express";
import ratingController from "../controllers/ratingController.js";

const router = express.Router();

router.get("/ratings/barber/:idBarber", ratingController.getRatingSummaryByBarber);
router.post("/ratings/barber/:idBarber", ratingController.updateRating);
router.get("/ratings/branch/:idBranch", ratingController.getAllRatingsByBranch);


export default router;
