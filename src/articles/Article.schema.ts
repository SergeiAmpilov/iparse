import mongoose from "mongoose";

export const articleSchema = new mongoose.Schema({
  slug: {
    type: String,
    require: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    minlength: 6,
  },
  text: String,
  dateCreate: {
    type: Date,
    default: Date.now
  },
  tags: [String],
});