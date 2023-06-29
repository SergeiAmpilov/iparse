import mongoose from "mongoose";
import { contactFormSchema } from "./ContactForm.schema";

export const ContactFormModel = mongoose.model('contactForm', contactFormSchema);