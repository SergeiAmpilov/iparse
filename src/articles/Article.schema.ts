import mongoose from "mongoose";

export const articleSchema = new mongoose.Schema({
  slug: {
    type: String,
    require: true
  },
  title: {
    type: String,
    required: true,
    minlength: 6,
  },
  text: String,
  description: String,
  dateCreate: {
    type: Date,
    default: Date.now
  }
});