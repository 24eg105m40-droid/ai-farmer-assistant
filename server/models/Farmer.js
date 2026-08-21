const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    farmerId: {
      type: String,
      unique: true,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    mobile: {
      type: String,
      required: true,
      unique: true
    },

    location: {
      type: String,
      required: true
    },

    soilType: {
      type: String,
      required: true
    },

    crops: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Farmer", farmerSchema);