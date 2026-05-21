require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const { data: sampleListings } = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to Atlas");
}

const initDB = async () => {
  await main();
  await Listing.deleteMany({});

  // pick any existing user as the default owner
  const owner = await User.findOne({});
  if (!owner) {
    console.log("No users found! Create a user first by signing up, then re-run this.");
    mongoose.connection.close();
    return;
  }

  const listingsWithOwner = sampleListings.map(listing => ({
    ...listing,
    owner: owner._id,
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Data inserted with owner:", owner.username);
  mongoose.connection.close();
};

initDB();