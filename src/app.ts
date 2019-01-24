import Hapi from "hapi";
import hapiAuth from "hapi-auth-jwt2";
import auth from "./routes/auth.controller";
import todos from "./routes/todo.controller";
import validate from "./lib/validate";
import config from "./config";

(async () => {
    const server = new Hapi.Server({
        host: "localhost",
        port: 3000
    });
    await server.register(hapiAuth);
    
    server.auth.strategy("jwt", "jwt", { 
        key: config.secret,
        validate: validate,
        verifyOptions: { 
            algorithms: [ "HS256" ] 
        }
    });
    
    server.auth.default("jwt");
    
    auth(server);
    todos(server);
    
    server.start();
})();
