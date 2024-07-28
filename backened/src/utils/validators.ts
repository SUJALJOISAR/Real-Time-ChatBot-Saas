import { NextFunction, Request, Response } from "express";
import {body, ValidationChain, validationResult} from "express-validator";

export const validate = (validations: ValidationChain[]) =>{
    return async ( req:Request , res:Response , next :NextFunction) =>{
        for(let validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty()) break; //if there is error it will break
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){ 
            return next();
        }
        return res.status(422).json({errors : errors.array()});
    }
}

export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is Required"),
    body("password").trim().isLength({min: 6}).withMessage("Password must atleast 6 characters ")
];

export const signupValidator = [
    body("name").notEmpty().withMessage("Name is Required"),
    body("email").trim().isEmail().withMessage("Email is Required"),
    body("password").trim().isLength({min: 6}).withMessage("Password must atleast 6 characters ") // or just instead of writing same email and password field here just write '...loginValidator'
    //that's why we have first written 'loginValidator' first.
];
// export const signupValidator = [
//     body("name").notEmpty().withMessage("Name is Required"),
//     ...loginValidator,
//like this
// ];