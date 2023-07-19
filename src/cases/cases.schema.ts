import mongoose, { Mongoose } from "mongoose";

export const caseSchema = new mongoose.Schema({
  slug: {
    type: String,
    require: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 6,
  },
  description: String,
  dateCreate: {
    type: Date,
    default: Date.now
  },
});