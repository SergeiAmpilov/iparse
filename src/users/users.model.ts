import mongoose from "mongoose";
import { UsersSchema } from "./users.schema";

export const UsersModel = mongoose.model('user', UsersSchema);
