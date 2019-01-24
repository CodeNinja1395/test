import { Document } from "mongoose";
import { Request } from "hapi";

export interface UserModel extends Document {
    name: string;
    password: string;
}
export interface TodoModel extends Document {
    userName: string;
    text: string;
    date: Date;
    isCompleted: boolean;
}

export interface AuthRequest extends Request {
    payload: {
        name: string,
        password: string
    }
}
export interface TodoRequest extends Request {
    payload: {
        text?: string,
        isCompleted?: string
    }
}