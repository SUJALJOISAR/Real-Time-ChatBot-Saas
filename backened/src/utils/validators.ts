import { NextFunction, Request, Response } from "express";
import {body, ValidationChain, validationResult} from "express-validator";

export const validate = (validations: ValidationChain[]) =>{
    return async ( req:Request , res:Response , next :NextFunction) =>{
        for(let validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty()) break; //if there is error it will break
        }
        const errors = validationResult(req);//this is final result and it will give errors if there are
        if(errors.isEmpty()){ 
            return next();
        }
        return res.status(422).json({errors : errors.array()});
    }
}
//validationResult() and ValidationChain[] are the functions predefined in express-validator package.

export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is Required"),
    body("password").trim().isLength({min: 6}).withMessage("Password must atleast 6 characters ")
];

//this is possible through express-validator package
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

export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is Required"),
];