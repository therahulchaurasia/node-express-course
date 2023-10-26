const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      maxlength: 50,
    },
    gender: {
      type: String,
      required: [true, "Please provide gender"],
      enum: ["Male", "Female"],
    },
    address: {
      type: String,
      required: [true, "Please provide address"],
    },
    timeZone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)
