import { Server } from "hapi";
import { hashSync as hash, compareSync as compare } from "bcrypt";
import JWT from "jsonwebtoken";
import { forbidden } from "boom";
import  { User }  from "../lib/models";
import  config  from "../config";
import { AuthRequest } from "../lib/interfaces";

export default function (server: Server) {
    server.route({
        method:'POST',
        path:'/signin',
        options: {
            auth: false
        },
        handler: async (request: AuthRequest)  => {
            const { name, password } = request.payload;

            const user = await User.find({ name });
            
            if (user.length === 0 || compare(password, user[0].password) === false) {
                throw forbidden("Incorrect email or password");
            }
    
            return JSON.stringify({ token: JWT.sign(name, config.secret, { algorithm: "HS256" })});
        }
    })

    server.route({
        method:'POST',
        path:'/signup',
        options: {
            auth: false
        },
        handler: async (request: any, h) => {
            const name = request.payload.name;
            
            if ((await User.find({ name })).length > 0) {
                throw forbidden("username is already taken");
            }

            await new User({
                name: name, 
                password: hash(request.payload.password, config.salt)
            }).save();

            return JSON.stringify({ token: JWT.sign(name, config.secret) });
        }
    })
}