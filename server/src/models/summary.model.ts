import { Schema, model } from "mongoose";


const QuestionSchema = new Schema({
  number: { type: Number, required: true },
  question: { type: String, required: true },
  choices: {
    type: [String],
    required: true
  },
  answer: {
    type: Number,
    required: true,
  }
}, { _id: false });
const SummarySchema = new Schema(
  {
    title:{
        type: String,
        required: true,
        //unique: true, title should be same because ai not know the database
    },
    summary:{
        type: String,
        required: false,
        default:""
    },
    data:{
        type: [QuestionSchema],
        required:true
    }
  },
  { timestamps: true }
);

export const QuestionsModel = model("questions", SummarySchema);