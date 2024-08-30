import React,{createContext, ReactNode, useContext, useEffect, useState} from 'react'
import { checkAuthStatus, loginUser, logoutUser, signupUser } from '../helpers/api-communication';

type User={
    name:string;
    email:string;
};

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email:string, password: string)=> Promise<void>; // login function will return promise and promise will not return anything that's why type of promise is "void"
    signup: (name:string, email:string, password:string) =>Promise<void>;
    logout: ()=>Promise<void>;
    //logout() is used to remove the cookies if the cookies are http-only cookies and they can be remove only by the backened part
};

const AuthContext=createContext<UserAuth | null>(null);

export const AuthProvider = ({children}:{children:ReactNode}) =>{ //means whatever specify betw opening and closing bracket of 'AuthProvider' i.e childrens will be React Nodes. In simple words components mention inside it.
    const [user,setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        //fetch if the user's cookies are valid then skip login
        async function checkStatus(){
            const data = await checkAuthStatus();
            if(data){
                setUser({email:data.email,name:data.name});
                setIsLoggedIn(true);
            }
        }
        checkStatus();
    },[]);

    const login = async (email:string,password:string) =>{
        const data = await loginUser(email,password);
        if(data){
            setUser({email:data.email,name:data.name});
            setIsLoggedIn(true);
        }
    };

    const signup = async (name:string, email:string, password:string) =>{
        await signupUser(name,email,password);
    };
    const logout= async ()=>{
        await logoutUser();
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload();
    };

    const value = {// this is the value that AuthProvider will be providing to its children
        user,
        isLoggedIn,
        login,
        logout,
        signup,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const UseAuth = () =>useContext(AuthContext);
