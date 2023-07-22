import mongoose from "mongoose";


export const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});