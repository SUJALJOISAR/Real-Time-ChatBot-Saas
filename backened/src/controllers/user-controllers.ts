import UserModel from "../models/UserModel.js"
import { compare, hash } from "bcrypt";

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
  
      return res.status(200).json({ msg: "User SignedUp Successfully!!",id:newUser._id.toString() });
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
         return res.status(200).json({msg:"User loggedIn Successfully!!",id:User._id.toString()});
    } catch (error) {
      return res.status(500).json({ msg: "Some error occurred during user signup", error });
    }
  };