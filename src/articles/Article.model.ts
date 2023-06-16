import mongoose from "mongoose";
import { articleSchema } from "./Article.schema";

export const ArticleModel = mongoose.model('article', articleSchema);