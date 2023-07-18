import mongoose from "mongoose";
import { caseSchema } from "./cases.schema";

export const CaseModel = mongoose.model('case', caseSchema);