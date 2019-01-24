import { Request } from "hapi";
import { User } from "./models";

// TODO: validate correctly

export default async (decoded: string) => {   
    if (User.find(decoded)) {
        return { isValid: true };
    }

    return { isValid: false }; 
};