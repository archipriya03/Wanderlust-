const express = require("express");
const router = express.Router();

const wrapAsyncs = require("../utils/wrapAsyncs");

const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const Listing = require("../models/listing.js");    
const { listingSchema } = require("../schema.js");

const ExpressError = require("../utils/ExpressError");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);

    } else {
        next();
    }
};


// INDEX ROUTE + CREATE ROUTE
router.route("/")
    .get(
        wrapAsyncs(listingController.index)
    )

  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsyncs(listingController.createListing)
);

// NEW ROUTE
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);


// SHOW ROUTE + UPDATE ROUTE + DELETE ROUTE
router.route("/:id")

    .get(
        wrapAsyncs(listingController.showListing)
    )

    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsyncs(listingController.updateListing)
    )

    .delete(
        isLoggedIn,
        isOwner,
        wrapAsyncs(listingController.deleteListing)
    );


// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsyncs(listingController.renderEditForm)
);

module.exports = router;