import { Server } from "hapi";
import { Model } from "mongoose";
import { Todo } from "../lib/models";
import { TodoRequest } from "../lib/interfaces";
import { badRequest } from "boom";
import { boolean } from "joi";

export default function (server: Server) {
    server.route({
        method:"POST",
        path:"/todo",
        options: {
            auth: "jwt"
        },
        handler: async (request: TodoRequest) => {
            if (!request.payload.text) {
                throw badRequest("text field is required");
            }

            const todo = await new Todo({
                userName: request.auth.credentials,
                text: request.payload.text,
                isCompleted: false,
                date: new Date()
            }).save();

            return JSON.stringify(todo);
        }
    })

    server.route({
        method: "PUT",
        path: "/todo/{todoId}",
        options: {
            auth: "jwt"
        },
        handler: async (request: TodoRequest) => {
            const text = request.payload.text;
            const id = request.params.todoId;

            if (!text) {
                throw badRequest("text field is required");
            }

            return await Todo.findOneAndUpdate(
                id, 
                { $set: { "text": text }}, 
                { new: true } 
            );
        }
    })

    server.route({
        method: "PATCH",
        options: { auth: "jwt" },
        path: "/todo/{todoId}",
        handler: async (request: TodoRequest) => {
            const isCompleted = request.payload.isCompleted;
            const id = request.params.todoId;

            if (isCompleted === undefined) {
                throw badRequest("isCompleted field is required");
            }
            
            if (typeof isCompleted !== "boolean") {
                throw badRequest("isCompleted field is must be boolean");
            }
            
            return await Todo.findOneAndUpdate(
                id, 
                { $set: { "isCompleted": isCompleted }}, 
                { new: true } 
            );
        }
    })

    server.route({
        method: "DELETE",
        options: { auth: "jwt" },
        path:"/todo/{todoId}",
        handler: async (request: TodoRequest) => {
            return await Todo.find({_id: request.params.todoId}).remove().exec();
        }
    })

    server.route({
        method: "GET",
        options: { auth: "jwt" },
        path: "/todo",
        handler: async (request: TodoRequest) => {
            return await Todo.find({userName: request.auth.credentials}).sort("-date");
        }
    })
}