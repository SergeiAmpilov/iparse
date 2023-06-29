import mongoose from "mongoose";

export const contactFormSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
  },
  description: String  
});