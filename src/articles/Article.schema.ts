import mongoose from "mongoose";




export const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 6,
  },
  text: String,
  description: String
});