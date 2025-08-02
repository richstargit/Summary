import { Schema, model } from "mongoose";


const TemplateSchema = new Schema(
  {
    username:{
        type: String,
        required: true,
        unique: true,
    },
  },
  { timestamps: true }
);

export const AccountModel = model("templates", TemplateSchema);