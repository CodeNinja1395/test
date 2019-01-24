import { Schema, Model, model, connect } from "mongoose";
import { UserModel, TodoModel } from "./interfaces";

connect("mongodb://localhost:27017");

const userSchema: Schema = new Schema({
    name: String,
    password: String,
});

const todoSchema: Schema = new Schema({
    userName: String, 
    text: String,
    isCompleted: Boolean,
    date: Date
})

export const User: Model<UserModel> = model<UserModel>("User", userSchema);
export const Todo: Model<TodoModel> = model<TodoModel>("Todo", todoSchema);