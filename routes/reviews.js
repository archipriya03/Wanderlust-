const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviews.js");
const wrapAsyncs = require("../utils/wrapAsyncs");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewOwner } = require("../middleware");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsyncs(reviewController.createReview)
);

// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewOwner,

    wrapAsyncs(reviewController.deleteReview)
);  

module.exports = router;