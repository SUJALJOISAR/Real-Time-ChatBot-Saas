import UserModel from "../models/UserModel.js"
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (req,res) =>{
    try {
        //get all users
        const users=await UserModel.find({});
        return res.status(200).json({msg:"Users Fetched Successfully",users});
    } catch (error) {
        return res.status(400).json({msg:"Some Error Occured in Fetching Users",error});
    }
}
// http://localhost:5000/api/v1/user/ just check this API in postman to get all users

export const userSignup = async (req, res) => {
    try {
      // Destructure name, email, and password from the request body
      const { name, email, password } = req.body;
  
      // Check if a user with the same name or email already exists
      const existingUser = await UserModel.findOne({ $or: [{ name }, { email }] });
  
      if (existingUser) {
        return res.status(400).json({ msg: "User with this name or email already exists" });
      }
  
      // If the user does not exist, hash the password and create a new user
      const hashedPassword = await hash(password, 10);
      const newUser = new UserModel({ name, email, password: hashedPassword });
  
      await newUser.save();

      res.clearCookie(COOKIE_NAME,{
        path:"/",
        // domain:"127.0.0.1",
        httpOnly:true,
        sameSite:'None',
        secure:true,
        signed:true,
    });
    
    //create and store token
    const token= createToken(newUser._id.toString(),newUser.email , "7d");//here first we have created token
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    //now we have to just send the token in form of cookies
    //see this below step is to send the cookie from backend to frontend. so for that we have use 'cookie-parser' package.
    res.cookie(COOKIE_NAME,token,{
        path:"/",
        // domain:"localhost",
        expires,
        httpOnly:true,
        sameSite:'None',
        secure:true,
        signed:true,
    })
  
  
      return res.status(200).json({ msg: "User SignedUp Successfully!!", name:newUser.name,email:newUser.email ,id:newUser._id.toString() });
    } catch (error) {
      return res.status(500).json({ msg: "Some error occurred during user signup", error });
    }
  };


  export const userLogin = async (req, res) => {
    try {
      // Destructure name, email, and password from the request body
      const { email, password } = req.body;  
      const User = await UserModel.findOne({email});
      if(!User){
        return res.status(400).json({msg:"No User Exists"});
      }
        const isPasswordCorrect = await compare(password,User.password);
        if(!isPasswordCorrect){
            return res.status(400).json({msg:"Password is Incorrect"});
        }

        res.clearCookie(COOKIE_NAME,{
            path:"/",
            // domain:"localhost",
            httpOnly:true,
            sameSite: 'None',
            secure:true,
            signed:true,
        });

        const token= createToken(User._id.toString(),User.email , "7d");
        const expires = new Date();//current date  
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME,token,{ //to send the cookie from backend to frontend we use "cookie-parser "package
            path:"/", //inside the root directory cookies will store
            // domain:"localhost",
            expires,
            httpOnly:true,
            sameSite:'None',
            secure:true,
            signed:true,
        })
        
         return res.status(200).json({msg:"User loggedIn Successfully!!",name:User.name,email:User.email,id:User._id.toString()});
    } catch (error) {
      return res.status(500).json({ msg: "Some error occurred during user signup", error });
    }
  };

  export const verifyUser = async (req, res) => {
    try {
      const User = await UserModel.findById(res.locals.jwtData.id);
      if(!User){
        return res.status(400).json({msg:"No User Exists or Token is Expired"});
      }
      if(User._id.toString() !== res.locals.jwtData.id){
        return res.status(400).json({msg:"User is not authenticated"});
      }        
        // console.log(User._id.toString(),res.locals.jwtData.id);
         return res.status(200).json({msg:"User loggedIn Successfully!!",name:User.name,email:User.email,id:User._id.toString()});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Some error occurred during user signup", error });
    }
  };

  export const userLogout = async (req, res) => {
    try {
      const User = await UserModel.findById(res.locals.jwtData.id);
      if(!User){
        return res.status(400).json({msg:"No User Exists or Token is Expired"});
      }
      if(User._id.toString() !== res.locals.jwtData.id){
        return res.status(400).json({msg:"User is not authenticated"});
      }        
        // console.log(User._id.toString(),res.locals.jwtData.id);
        res.clearCookie(COOKIE_NAME,{
          path:"/",
          // domain:"localhost",
          httpOnly:true,
          sameSite: 'None',
          secure:true,
          signed:true,
      });
         return res.status(200).json({msg:"User loggedIn Successfully!!",name:User.name,email:User.email,id:User._id.toString()});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Some error occurred during user signup", error });
    }
  };


  //Some imp info
  //Authentication:it is a step in which the user needs to verify their identity. For this application, the user needs to provide the same login credentials(email and password) which it created during registration process.
  //The user will be provided a Token after the auth process.

  //Authorization: Once the user authenticates(means user is logged in), he is provided a token. Now to access any resource from website, the user needs to show a token that was sent during authentication. This ensures that user can access the resource.

  //JWT: JSON Web Token(JWT) is used to encrypt a payload into a signed token that has the permissions or authorities of the user.

  //HTTP only Cookies: They are type of web cookie that comes with a special security attribute that restricts cookies from being accessed by JS in the webbrowser. This prevents XSS attacks.

  //so the whole process is that first user authenticate , then we will send the HTTP cookie along with JWT token(means in form HTTP cookies), now the user has token.
  //Now the user can access any resource from website by showing the token that was sent during authentication by sending that token back