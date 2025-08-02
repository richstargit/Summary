import { Schema, model } from "mongoose";
import {CreateAccount} from "@/interfaces/accounts.interface";
import { Role } from "@/enums/role.enum";

const AccountSchema = new Schema(
  {
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type : String,
        require: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        require: true,
        default : Role.MEMBER
    },
    banned : {
        type : Boolean,
        default : false,
    },
    locked: {
        type : Boolean,
        default : false,
    },
    warning: {
        type : String,
    }
  },
  { timestamps: true }
);

export const AccountModel = model("accounts", AccountSchema);

export const createAccount = async (accountData : CreateAccount) => {
  const account = new AccountModel(accountData);
  return await account.save();
}